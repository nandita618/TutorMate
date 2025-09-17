import streamlit as st
import requests
import threading
import time

# ==============================
# Start FastAPI backend automatically
# ==============================
def start_backend():
    import main  # This runs uvicorn inside main.py

# Start backend in a separate daemon thread
backend_thread = threading.Thread(target=start_backend, daemon=True)
backend_thread.start()

# Give backend a moment to start
time.sleep(2)

# ==============================
# Backend URL
# ==============================
BASE_URL = "http://127.0.0.1:8000"

st.set_page_config(page_title="AI Tutor", layout="wide")
st.title("🤖 AI Tutor Platform (STEM)")

# ==============================
# Language selection
# ==============================
languages = [
    "English", "Hindi", "Bengali", "Tamil", "Telugu",
    "Kannada", "Marathi", "Gujarati", "Punjabi", "Malayalam", "Urdu",
    "Odia"  # Added Oriya language
]
language = st.selectbox("🌐 Choose Language", languages)

# ==============================
# STEM Structure
# ==============================
STEM_STRUCTURE = {
    "Science": {
        "Physics": [
            "Mechanics", "Thermodynamics", "Waves and Sound",
            "Light and Optics", "Electricity and Magnetism",
            "Modern Physics", "Fluid Mechanics"
        ],
        "Chemistry": [
            "Atomic Structure", "Periodic Table", "Chemical Bonding",
            "Stoichiometry", "Thermochemistry", "Solutions and Mixtures",
            "Acids, Bases, and Salts", "Organic Chemistry Basics",
            "Chemical Kinetics", "Electrochemistry"
        ],
        "Biology": [
            "Cell Biology", "Genetics and Evolution", "Human Anatomy and Physiology",
            "Plant Biology", "Microbiology", "Ecology and Environment",
            "Biotechnology Basics"
        ]
    },
    "Technology": {
        "Computer Science / IT": [
            "Programming Fundamentals", "Data Structures and Algorithms",
            "Database Management Systems", "Networking Basics",
            "Cybersecurity Fundamentals", "AI & Machine Learning",
            "Web Development Basics", "Software Development Life Cycle"
        ],
        "Engineering Basics": [
            "Electrical Circuits", "Mechanical Systems", "Robotics Basics",
            "Electronics and Sensors", "Control Systems"
        ]
    },
    "Engineering": {
        "Mechanical Engineering": [
            "Mechanics of Materials", "Thermodynamics", "Fluid Mechanics",
            "Manufacturing Processes", "Machine Design"
        ],
        "Electrical Engineering": [
            "Circuit Theory", "Electromagnetics", "Digital Electronics",
            "Control Systems", "Power Systems"
        ],
        "Civil Engineering": [
            "Structural Analysis", "Surveying", "Construction Materials",
            "Geotechnical Engineering", "Transportation Engineering"
        ]
    },
    "Mathematics": {
        "Mathematics": [
            "Algebra", "Geometry", "Trigonometry", "Calculus",
            "Probability & Statistics", "Linear Algebra",
            "Differential Equations", "Number Theory", "Vectors and Matrices"
        ]
    }
}

# ==============================
# Dropdown Selection
# ==============================
st.sidebar.header("📚 Select Your Topic")

subject = st.sidebar.selectbox("Choose Subject", list(STEM_STRUCTURE.keys()))
sub_subject = st.sidebar.selectbox("Choose Sub-Subject", list(STEM_STRUCTURE[subject].keys()))
chapter = st.sidebar.selectbox("Choose Chapter", STEM_STRUCTURE[subject][sub_subject])

st.markdown(f"### 📘 {subject} → {sub_subject} → {chapter}")

# ==============================
# Tutoring Section
# ==============================
st.subheader("Ask a Question")
question = st.text_area(
    "Enter your question here...",
    key=f"{subject}_{sub_subject}_{chapter}_question"
)

if st.button("💡 Get AI Help"):
    if not question.strip():
        st.warning("Please enter a question to get help.")
    else:
        payload = {
            "subject": f"{subject} - {sub_subject} - {chapter}",
            "level": "Beginner",
            "question": question,
            "language": language
        }
        try:
            res = requests.post(f"{BASE_URL}/tutor", json=payload)
            st.success(res.json()["answer"])
        except Exception as e:
            st.error(f"Error: {e}")
