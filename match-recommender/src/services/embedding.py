from sentence_transformers import SentenceTransformer
from typing import List

model = SentenceTransformer('all-MiniLM-L6-v2')

def create_embedding(text: str) -> List[float]:
    #Create vector embedding from text
    return model.encode(text).tolist() 