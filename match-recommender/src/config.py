import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb+srv://projectMatchDev:EisJJsIDWamEv9R9@projectmatch.veqcm.mongodb.net/MatchTestDB?retryWrites=true&w=majority&appName=ProjectMatch") 