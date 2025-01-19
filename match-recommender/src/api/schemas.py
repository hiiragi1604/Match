from pydantic import BaseModel
from typing import List, Optional

class ProjectEmbeddingRequestBody(BaseModel):
    projectId: str

class UserEmbeddingRequestBody(BaseModel):
    userId: str