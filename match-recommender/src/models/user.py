from typing import List, Optional
from bson import ObjectId

# User schema definition
user_schema = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": ["name", "email"],
        "properties": {
            "name": {
                "bsonType": "string",
                "description": "User's name - required"
            },
            "email": {
                "bsonType": "string",
                "description": "User's email - required"
            },
            "skills": {
                "bsonType": "array",
                "description": "List of user's skills",
                "items": {
                    "bsonType": "string"
                }
            },
            "interests": {
                "bsonType": "array",
                "description": "List of user's interests",
                "items": {
                    "bsonType": "string"
                }
            },
            "pastProjects": {
                "bsonType": "array",
                "items": {
                    "bsonType": "object",
                    "required": ["title", "description"],
                    "properties": {
                        "title": {
                            "bsonType": "string",
                            "description": "Project title - required"
                        },
                        "description": {
                            "bsonType": "string",
                            "description": "Project description - required"
                        },
                        "techUsed": {
                            "bsonType": "array",
                            "items": {
                                "bsonType": "string"
                            }
                        },
                        "link": {
                            "bsonType": ["string", "null"],
                            "description": "Project link - optional"
                        }
                    }
                }
            }
        }
    }
} 