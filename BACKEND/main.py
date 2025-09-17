# backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ai_engine import generate_tutoring_response
import logging

# =========================
# Configure Logging
# =========================
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# =========================
# FastAPI App
# =========================
app = FastAPI(title="AI Tutor API", version="1.1")

# Enable CORS (⚠️ update allow_origins for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with your frontend domain in production
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
    length: str | None = "medium"  # optional: short, medium, long


# =========================
# Routes
# =========================
@app.get("/")
def root():
    return {"message": "Welcome to the AI Tutor API"}

@app.get("/health")
def health_check():
    """Quick health check to confirm API is running."""
    return {"status": "ok"}

@app.post("/tutoring")
def tutoring_endpoint(request: TutoringRequest):
    try:
        response = generate_tutoring_response(
            subject=request.subject,
            level=request.level,
            question=request.question,
            learning_style=request.learning_style,
            background=request.background,
            language=request.language,
            length=request.length
        )
        return {"response": response}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error generating tutoring response: {e}")
        raise HTTPException(status_code=502, detail="AI service is unavailable right now. Please try again later.")


# =========================
# Run Locally
# =========================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
