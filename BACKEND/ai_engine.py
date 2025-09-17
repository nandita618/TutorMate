from langchain_google_genai import ChatGoogleGenerativeAI 
from dotenv import load_dotenv
import os
import logging

# =========================
# Configure logging
# =========================
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# =========================
# Load environment variables
# =========================
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    logger.error("GOOGLE_API_KEY not found in environment variables.")
    raise ValueError("Missing GOOGLE_API_KEY. Please set it in your .env file.")

# =========================
# LLM Initialization
# =========================
def get_llm():
    model_name = "gemini-2.0-flash"
    try:
        logger.info(f"Initializing Gemini model: {model_name}")
        return ChatGoogleGenerativeAI(
            model=model_name,
            temperature=0.7,
            google_api_key=GOOGLE_API_KEY
        )
    except Exception as e:
        logger.error(f"Error initializing Gemini LLM: {str(e)}")
        raise Exception(f"Failed to initialize Gemini model: {str(e)}")

# =========================
# Tutoring Prompt
# =========================
def _create_tutoring_prompt(subject, level, question, language):
    prompt = (
        "You are an intelligent tutoring assistant.\n"
        "Explain the student's question clearly, step-by-step.\n\n"
        f"Subject: {subject}\n"
        f"Level: {level}\n"
        f"Language: {language}\n"
        f"Question: {question}\n\n"
        "Provide a clear, supportive, and educational response."
    )
    return prompt

def generate_tutoring_response(subject, level, question, language):
    try:
        llm = get_llm()
        message = _create_tutoring_prompt(subject, level, question, language)
        response = llm.invoke(message)
        return response.content
    except Exception as e:
        logger.error(f"Error generating tutoring response: {str(e)}")
        raise Exception(f"Failed to generate tutoring response: {str(e)}")
