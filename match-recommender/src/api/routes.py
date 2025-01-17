from fastapi import APIRouter, Depends, HTTPException
from pymongo.database import Database
from bson.objectid import ObjectId
from typing import List

from src.services.database import get_database
from src.services.embedding import create_embedding
from src.api.schemas import ProjectEmbeddingRequestBody, UserEmbeddingRequestBody

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
        #Retrieve project from database
        project = db.projects.find_one({"_id": ObjectId(body.projectId)})
        if not project:
            print(f"Project not found: {body.projectId}")
            return {"success": False, "error": "Project not found"}
    
        #Create embedding for project
        desired_skills_text = " ".join(project["desiredSkills"])
        languages_text = " ".join(project["languages"])
        project_text = f"Name: {project['name']}. Description: {project['description']}. Desired Skills: {desired_skills_text}. Languages: {languages_text}"
        embedding = create_embedding(project_text)

        #Update or insert embedding in database
        db.projectEmbeddings.update_one(
            {"projectId": body.projectId},
            {"$set": {"embedding": embedding}},
            upsert=True
        )
        print(f"Project embedding created/updated for project {project['_id']}")
        return {"success": True, "message": "Project embedding created/updated successfully"}
    except Exception as e:
        print(f"Error creating embedding for project {body.projectId}: {e}")
        return {"success": False, "error": str(e)}


#User routes
@router.post("/users/embedding")
async def create_user_embedding(body: UserEmbeddingRequestBody, db: Database = Depends(get_db)):
    try:
        #Retrieve user from database
        user = db.users.find_one({"_id": ObjectId(body.userId)})
        if not user:
            print(f"User not found: {body.userId}")
            return {"success": False, "error": "User not found"}
    
        #Create embedding for user
        user_skills_text = " ".join(user["technicalInfo"]["skills"])
        user_languages_text = " ".join(user["technicalInfo"]["languages"])
        user_skills_to_learn = " ".join(user["technicalInfo"]["skillsToLearn"])
        user_text = f"Skills: {user_skills_text}. Languages: {user_languages_text}. Skills to learn: {user_skills_to_learn}. Degree: {user['technicalInfo']['degree']}."
        embedding = create_embedding(user_text)

        #Update or insert embedding in database
        db.userEmbeddings.update_one(
            {"userId": body.userId},
            {"$set": {"embedding": embedding}},
            upsert=True
        )
        print(f"User embedding created/updated for user {user['_id']}")
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
