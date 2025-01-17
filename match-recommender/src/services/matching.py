import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from typing import Tuple, Union, List

def top_k_matches(
    search_embedding: np.ndarray, 
    embeddings: np.ndarray, 
    k: int = 10,
    threshold: float = 0.0
) -> Tuple[np.ndarray, np.ndarray]:
    
    # Ensure inputs are numpy arrays with correct shape
    search_embedding = np.asarray(search_embedding).reshape(1, -1)
    embeddings = np.asarray(embeddings)
    
    # Validate input dimensions
    if search_embedding.shape[1] != embeddings.shape[1]:
        raise ValueError(
            f"Embedding dimensions don't match: {search_embedding.shape[1]} vs {embeddings.shape[1]}"
        )
    
    # Adjust k if it's larger than the number of embeddings
    k = min(k, embeddings.shape[0])
    
    # Calculate cosine similarity
    similarity_scores = cosine_similarity(search_embedding, embeddings)[0]  # Flatten result
    
    # Filter by threshold and get top k
    valid_indices = np.where(similarity_scores >= threshold)[0]
    if len(valid_indices) == 0:
        return np.array([]), np.array([])
        
    # Sort valid indices by score
    sorted_indices = valid_indices[np.argsort(similarity_scores[valid_indices])[::-1]]
    top_k_indices = sorted_indices[:k]
    top_k_scores = similarity_scores[top_k_indices]
    
    return top_k_indices, top_k_scores

