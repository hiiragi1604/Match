from fastapi import APIRouter, Depends, HTTPException
from pymongo.database import Database
from bson.objectid import ObjectId
from typing import List

from src.services.database import get_database
from src.services.embedding import create_embedding
from src.api.schemas import ProjectEmbeddingRequestBody, UserEmbeddingRequestBody
from src.services.matching import top_k_matches
from src.shared import Shared

from src.services.database import get_database, get_swipe_history, delete_swipe

router = APIRouter()

# Dependency to get database instance
async def get_db():
    db = get_database()
    try:
        yield db
    finally:
        db.client.close()

#Project routes
@router.post("/projects/embedding")
async def create_project_embedding(body: ProjectEmbeddingRequestBody, db: Database = Depends(get_db)):
    try:
        # Check if embedding already exists
        existing_embedding = db.projectEmbeddings.find_one({"projectId": ObjectId(body.projectId)})
        
        # Retrieve project from database
        project = db.projects.find_one({"_id": ObjectId(body.projectId)})
        if not project:
            print(f"Project not found: {body.projectId}")
            return {"success": False, "error": "Project not found"}
    
        # Create embedding for project
        desired_skills_text = " ".join(project["desiredSkills"])
        languages_text = " ".join(project["languages"])
        project_text = f"Name: {project['name']}. Description: {project['description']}. Desired Skills: {desired_skills_text}. Languages: {languages_text}"
        embedding = create_embedding(project_text)

        # Update or insert embedding in database
        result = db.projectEmbeddings.find_one_and_update(
            {"projectId": ObjectId(body.projectId)},
            {"$set": {
                "projectId": ObjectId(body.projectId),
                "embedding": embedding
            }},
            upsert=True,
            return_document=True
        )

        # Only append to shared list if it's a new embedding
        if not existing_embedding:
            Shared.project_embeddings_list.append(result)
            print(f"New project embedding created for project {project['_id']}")
        else:
            print(f"Project embedding updated for project {project['_id']}")
            
        return {"success": True, "message": "Project embedding created/updated successfully"}
    except Exception as e:
        print(f"Error creating embedding for project {body.projectId}: {e}")
        return {"success": False, "error": str(e)}


#User routes
@router.post("/users/embedding")
async def create_user_embedding(body: UserEmbeddingRequestBody, db: Database = Depends(get_db)):
    try:
        # Check if embedding already exists
        existing_embedding = db.userEmbeddings.find_one({"userId": ObjectId(body.userId)})
        
        # Retrieve user from database
        user = db.users.find_one({"_id": ObjectId(body.userId)})
        if not user:
            print(f"User not found: {body.userId}")
            return {"success": False, "error": "User not found"}
    
        # Create embedding for user
        user_skills_text = " ".join(user["technicalInfo"]["skills"])
        user_languages_text = " ".join(user["technicalInfo"]["languages"])
        user_skills_to_learn = " ".join(user["technicalInfo"]["skillsToLearn"])
        user_text = f"Skills: {user_skills_text}. Languages: {user_languages_text}. Skills to learn: {user_skills_to_learn}. Degree: {user['technicalInfo']['degree']}."
        embedding = create_embedding(user_text)

        # Update or insert embedding in database
        result = db.userEmbeddings.find_one_and_update(
            {"userId": ObjectId(body.userId)},
            {"$set": {
                "userId": ObjectId(body.userId),
                "embedding": embedding
            }},
            upsert=True,
            return_document=True
        )

        # Only append to shared list if it's a new embedding
        if not existing_embedding:
            Shared.user_embeddings_list.append(result)
            print(f"New user embedding created for user {user['_id']}")
        else:
            print(f"User embedding updated for user {user['_id']}")
            
        return {"success": True, "message": "User embedding created/updated successfully"}
    except Exception as e:
        print(f"Error creating embedding for user {body.userId}: {e}")
        return {"success": False, "error": str(e)}

#Admin routes
@router.post("/admin/createProjectEmbeddings")
async def create_project_embeddings(db: Database = Depends(get_db)):
    print("Creating project embeddings...")
    projects = db.projects.find()
    failed_projects = []
    successful_projects = []
    
    #Create embeddings for each project
    for project in projects:
        result = await create_project_embedding(ProjectEmbeddingRequestBody(projectId=str(project["_id"])), db)
        if not result["success"]:
            failed_projects.append({
                "id": str(project["_id"]),
                "error": result.get("error", "Unknown error")
            })
        else:
            successful_projects.append(str(project["_id"]))
    
    return {
        "message": "Project embeddings creation completed",
        "successful_count": len(successful_projects),
        "failed_count": len(failed_projects),
        "failed_projects": failed_projects
    }

@router.post("/admin/createUserEmbeddings")
async def create_user_embeddings(db: Database = Depends(get_db)):
    print("Creating user embeddings...")
    users = db.users.find()
    failed_users = []
    successful_users = []
    
    #Create embeddings for each user
    for user in users:
        result = await create_user_embedding(UserEmbeddingRequestBody(userId=str(user["_id"])), db)
        if not result["success"]:
            failed_users.append({
                "id": str(user["_id"]),
                "error": result.get("error", "Unknown error")
            })
        else:
            successful_users.append(str(user["_id"]))
    
    return {
        "message": "User embeddings creation completed",
        "successful_count": len(successful_users),
        "failed_count": len(failed_users),
        "failed_users": failed_users
    }

#Matching routes
@router.get("/matching/user/{userId}")
async def get_user_matches(userId: str, k: int = 10):
    try:
        user_embedding_doc = next(
            obj for obj in Shared.user_embeddings_list 
            if str(obj["userId"]) == userId
        )
        
        # Get swipe history
        db = get_database()
        swipes = get_swipe_history(db, userId)
        
        # Create sets for lookup
        liked_project_ids = {str(swipe["targetProject"]) for swipe in swipes if swipe["action"] == "like"}
        dislike_swipes = {
            str(swipe["targetProject"]): swipe["_id"] 
            for swipe in swipes 
            if swipe["action"] == "dislike"
        }
        disliked_project_ids = set(dislike_swipes.keys())
        
        # Find unswiped projects
        available_projects = [
            proj for proj in Shared.project_embeddings_list 
            if str(proj["projectId"]) not in liked_project_ids 
            and str(proj["projectId"]) not in disliked_project_ids
        ]
        
        # If no new projects available, use previously disliked ones
        if not available_projects:
            print("No new projects available, now including previously disliked projects...")
            available_projects = [
                proj for proj in Shared.project_embeddings_list 
                if str(proj["projectId"]) not in liked_project_ids
            ]
        
        if not available_projects:
            print("No available projects found")
            return []
            
        available_embeddings = [proj["embedding"] for proj in available_projects]
        
        # Get top k matches from available projects
        top_k_indices, top_k_scores = top_k_matches(
            user_embedding_doc["embedding"], 
            available_embeddings,
            k=k
        )
        
        # Create response
        matched_projects = []
        for idx, score in zip(top_k_indices, top_k_scores):
            project_id = str(available_projects[idx]["projectId"])
            was_disliked = project_id in disliked_project_ids
            
            # If project was previously disliked, delete the dislike swipe from db
            if was_disliked:
                swipe_id = dislike_swipes[project_id]
                delete_swipe(str(swipe_id), db)
                print(f"Deleted dislike record for project {project_id}")
            
            project = {
                "projectId": project_id,
                "similarityScore": float(score),
                "wasDisliked": was_disliked
            }
            matched_projects.append(project)
            
        print(f"Found {len(matched_projects)} matches")
        return matched_projects
            
    except StopIteration:
        raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        print(f"Error in get_user_matches: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/matching/project/{projectId}")
async def get_project_matches(projectId: str):
    try:
        project_embedding_doc = next(
            obj for obj in Shared.project_embeddings_list 
            if str(obj["projectId"]) == projectId
        )
        
        # Extract just the embeddings for comparison
        project_embedding = project_embedding_doc["embedding"]
        user_embeddings = [user["embedding"] for user in Shared.user_embeddings_list]
        
        # Get top k matches
        top_k_indices, top_k_scores = top_k_matches(project_embedding, user_embeddings)
        
        # Get matched users and add similarity scores
        matched_users = []
        for i, (index, score) in enumerate(zip(top_k_indices, top_k_scores)):
            # Create a new dict with string IDs
            user = {
                "userId": str(Shared.user_embeddings_list[index]["userId"]),
                "similarityScore": float(score)
            }
            matched_users.append(user)
            
        return matched_users
    except StopIteration:
        raise HTTPException(status_code=404, detail="Project not found")

