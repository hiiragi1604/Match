from typing import List, Optional
from bson import ObjectId

# User embedding schema definition
user_embedding_schema = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": ["userId", "embedding"],
        "properties": {
            "userId": {
                "bsonType": "objectId",
                "description": "Reference to User document"
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
