import pymongo
from pymongo.database import Database
from pymongo.collection import Collection
from src.models.project import project_schema
from src.models.user import user_schema
from src.models.projectEmbedding import project_embedding_schema
from src.models.userEmbedding import user_embedding_schema
from src.config import MONGODB_URI
from src.shared import Shared

def get_database() -> Database:
    #Get the database instance
    client = pymongo.MongoClient(MONGODB_URI)
    return client.get_database("MatchTestDB")

def init_collections(db: Database):
    #Initialize collections with schema validation
    try:
        db.command("collMod", "users", 
                  validator=user_schema, 
                  validationLevel="strict")
    except pymongo.errors.OperationFailure:
        db.create_collection("users", validator=user_schema)

    try:
        db.command("collMod", "projects", 
                  validator=project_schema, 
                  validationLevel="strict")
    except pymongo.errors.OperationFailure:
        db.create_collection("projects", validator=project_schema)

    try:
        db.command("collMod", "projectEmbeddings", 
                  validator=project_embedding_schema, 
                  validationLevel="strict")
    except pymongo.errors.OperationFailure:
        db.create_collection("projectEmbeddings", validator=project_embedding_schema)
    
    try:
        db.command("collMod", "userEmbeddings", 
                  validator=user_embedding_schema, 
                  validationLevel="strict")
    except pymongo.errors.OperationFailure:
        db.create_collection("userEmbeddings", validator=user_embedding_schema)

    Shared.project_embeddings_list = list(db.projectEmbeddings.find())
    Shared.user_embeddings_list = list(db.userEmbeddings.find())

def get_collection(db: Database, name: str) -> Collection:
    #Get a collection by name
    return db.get_collection(name) 