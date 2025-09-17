import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ai_engine import generate_tutoring_response

# =========================
# Configure logging
# =========================
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# =========================
# FastAPI App
# =========================
app = FastAPI(title="AI Tutor")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# Request & Response Models
# =========================
class TutoringRequest(BaseModel):
    subject: str
    level: str
    question: str
    language: str = "English"

class TutoringResponse(BaseModel):
    answer: str

# =========================
# Routes
# =========================
@app.post("/tutor", response_model=TutoringResponse)
async def tutor(request: TutoringRequest):
    try:
        answer = generate_tutoring_response(
            subject=request.subject,
            level=request.level,
            question=request.question,
            language=request.language
        )
        return TutoringResponse(answer=answer)
    except Exception as e:
        logger.error(f"Error in /tutor endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "Welcome to the AI Tutor API!"}

# =========================
# Run FastAPI with Uvicorn programmatically
# =========================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
