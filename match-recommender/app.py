from fastapi import FastAPI
from src.services.database import get_database, init_collections
from src.api.routes import router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

#CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:6969"],  # Allowed origins
    allow_credentials=True,
    allow_methods=["*"],  # Allowed methods
    allow_headers=["*"],  # Allowed headers
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

# Include the API router
app.include_router(router, prefix="/api")

@app.on_event("startup")
async def startup():
    print("Initializing database and collections...")
    # Initialize database and collections on startup
    db = get_database()
    init_collections(db)
    print("Startup complete!")

if __name__ == "__main__":
    print("Starting server on http://0.0.0.0:9696")
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9696)
   