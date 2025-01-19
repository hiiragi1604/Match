from typing import List, Optional
from bson import ObjectId

# Project embedding schema definition
project_embedding_schema = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": ["projectId", "embedding"],
        "properties": {
            "projectId": {
                "bsonType": "objectId",
                "description": "Reference to Project document"
            },
            "embedding": {
                "bsonType": "array",
                "description": "Embedding vector",
                "items": {
                    "bsonType": "double",
                    "description": "Embedding vector element"
                }
            }
        }
    }
}
