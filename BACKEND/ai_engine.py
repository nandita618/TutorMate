import os
import logging
from dotenv import load_dotenv
from groq import Groq

# =========================
# Configure Logging
# =========================
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# =========================
# Load Environment Variables
# =========================
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    logger.error("GROQ_API_KEY not found in environment variables.")
    raise ValueError("Missing GROQ_API_KEY. Please set it in your .env file.")

# =========================
# Initialize Groq Client
# =========================
client = Groq(api_key=GROQ_API_KEY)
FREE_MODEL_ID = "llama-3.1-8b-instant"  # Free model

# =========================
# Prompt Builder
# =========================
def _create_tutoring_prompt(subject: str, level: str, question: str,
                            learning_style: str, background: str, language: str) -> str:
    return (
        f"You are an intelligent tutor specializing in {subject} at {level} level.\n"
        f"Student Background: {background}\n"
        f"Preferred Learning Style: {learning_style}\n"
        f"Language: {language}\n\n"
        f"Student Question: {question}\n\n"
        "Instructions:\n"
        "1. Explain concepts clearly and step-by-step.\n"
        "2. Adapt explanation to student's learning style.\n"
        "3. Keep it encouraging and easy to understand.\n"
    )

# =========================
# Generate Tutoring Response
# =========================
def generate_tutoring_response(subject: str, level: str, question: str,
                               learning_style: str, background: str, language: str) -> str:
    try:
        system_message = "You are a helpful tutoring assistant."
        user_message = _create_tutoring_prompt(subject, level, question, learning_style, background, language)

        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message}
            ],
            model=FREE_MODEL_ID,
            temperature=0.7
        )

        return response.choices[0].message.content

    except Exception as e:
        logger.error(f"Error generating tutoring response: {e}")
        return f"Error: {str(e)}"

# =========================
# Test Run
# =========================
if __name__ == "__main__":
    reply = generate_tutoring_response(
        subject="Mathematics",
        level="Beginner",
        question="What is the Pythagorean theorem?",
        learning_style="Visual",
        background="Knows basic algebra",
        language="English"
    )
    print("\n=== Tutoring Response ===\n")
    print(reply)
