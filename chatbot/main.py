from fastapi import FastAPI
from .routes import router

app = FastAPI(title="Chatbot Service")

# Include router
app.include_router(router)
