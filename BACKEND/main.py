from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import logging
from ai_engine import generate_tutoring_response

# =========================
# Logging Setup
# =========================
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# =========================
# FastAPI App Setup
# =========================
app = FastAPI(title="AI Tutor API", version="1.0")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to specific frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# Pydantic Model
# =========================
class TutoringRequest(BaseModel):
    subject: str
    level: str
    question: str
    learning_style: str
    background: str
    language: str
    length: str = "medium"   # ✅ new optional field with default


# =========================
# Routes
# =========================
@app.get("/")
def root():
    return {"message": "Welcome to AI Tutor API"}

@app.post("/tutoring")
def tutoring(request: TutoringRequest):
    try:
        response = generate_tutoring_response(
            subject=request.subject,
            level=request.level,
            question=request.question,
            learning_style=request.learning_style,
            background=request.background,
            language=request.language,
            length=request.length  # ✅ pass new param
        )
        return {"response": response}
    except Exception as e:
        logger.error(f"Error in /tutoring endpoint: {e}")
        return {"error": str(e)}
