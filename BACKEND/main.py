# backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ai_engine import generate_tutoring_response  # Make sure ai_agent.py is in the same folder
import logging

# =========================
# Configure Logging
# =========================
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# =========================
# FastAPI App
# =========================
app = FastAPI(title="AI Tutor API", version="1.0")

# Enable CORS (adjust for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # replace "*" with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# Request Model
# =========================
class TutoringRequest(BaseModel):
    subject: str
    level: str
    question: str
    learning_style: str
    background: str
    language: str

# =========================
# Routes
# =========================
@app.get("/")
def root():
    return {"message": "Welcome to the AI Tutor API"}

@app.post("/tutoring")
def tutoring_endpoint(request: TutoringRequest):
    try:
        response = generate_tutoring_response(
            subject=request.subject,
            level=request.level,
            question=request.question,
            learning_style=request.learning_style,
            background=request.background,
            language=request.language
        )
        return {"response": response}
    except Exception as e:
        logger.error(f"Error generating tutoring response: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# =========================
# Run Test Locally
# =========================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
