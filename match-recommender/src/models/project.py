from typing import List, Optional
from bson import ObjectId

# Project schema definition
project_schema = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": ["name", "description", "field"],
        "properties": {
            "name": {
                "bsonType": "string",
                "description": "Name of the project - required"
            },
            "description": {
                "bsonType": "string", 
                "description": "Project description - required"
            },
            "members": {
                "bsonType": "array",
                "description": "List of project members",
                "items": {
                    "bsonType": "object",
                    "required": ["user", "role"],
                    "properties": {
                        "user": {
                            "bsonType": "objectId",
                            "description": "Reference to User document"
                        },
                        "role": {
                            "bsonType": "string",
                            "description": "Role of the member"
                        }
                    }
                }
            },
            "desiredSkills": {
                "bsonType": "array",
                "description": "List of desired skills",
                "items": {
                    "bsonType": "string"
                }
            },
            "languages": {
                "bsonType": "array",
                "description": "List of programming languages", 
                "items": {
                    "bsonType": "string"
                }
            },
            "field": {
                "bsonType": "string",
                "description": "Project field - required"
            },
            "location": {
                "bsonType": ["string", "null"],
                "description": "Project location - optional"
            }
        }
    }
} 