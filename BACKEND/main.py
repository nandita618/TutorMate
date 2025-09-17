# backend/main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import logging
from ai_engine import generate_tutoring_response

# =========================
# Configure Logging
# =========================
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# =========================
# FastAPI App
# =========================
app = FastAPI(title="AI STEM Tutor API", version="1.0")

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
# Root Endpoint
# =========================
@app.get("/")
def root():
    return {"message": "Welcome to AI STEM Tutor API!"}

# =========================
# Tutoring Endpoint
# =========================
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
