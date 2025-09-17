import streamlit as st
import requests
import os
from dotenv import load_dotenv

# =========================
# Load Environment Variables
# =========================
load_dotenv()
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")

# Debug Info - shows current backend URL
st.sidebar.info(f"🔗 Using Backend URL: {BACKEND_URL}")

# =========================
# STEM Sections -> Subjects -> Chapters
# =========================
STEM_STRUCTURE = {
    "S": {  # Science
        "Physics": ["Mechanics", "Thermodynamics", "Waves and Sound", "Light and Optics",
                    "Electricity and Magnetism", "Modern Physics", "Fluid Mechanics"],
        "Chemistry": ["Atomic Structure", "Periodic Table", "Chemical Bonding", "Stoichiometry",
                      "Thermochemistry", "Solutions and Mixtures", "Acids, Bases, and Salts",
                      "Organic Chemistry Basics", "Chemical Kinetics", "Electrochemistry"],
        "Biology": ["Cell Biology", "Genetics and Evolution", "Human Anatomy and Physiology",
                    "Plant Biology", "Microbiology", "Ecology and Environment", "Biotechnology Basics"]
    },
    "T": {  # Technology
        "Computer Science": ["Programming Fundamentals", "Data Structures and Algorithms",
                             "Database Management Systems", "Networking Basics",
                             "Cybersecurity Fundamentals", "AI & Machine Learning",
                             "Web Development Basics", "Software Development Life Cycle"]
    },
    "E": {  # Engineering
        "Mechanical Engineering": ["Mechanics of Materials", "Thermodynamics", "Fluid Mechanics",
                                   "Manufacturing Processes", "Machine Design"],
        "Electrical Engineering": ["Circuit Theory", "Electromagnetics", "Digital Electronics",
                                   "Control Systems", "Power Systems"],
        "Civil Engineering": ["Structural Analysis", "Surveying", "Construction Materials",
                              "Geotechnical Engineering", "Transportation Engineering"]
    },
    "M": {  # Mathematics
        "Mathematics": ["Algebra", "Geometry", "Trigonometry", "Calculus", "Probability & Statistics",
                        "Linear Algebra", "Differential Equations", "Number Theory", "Vectors and Matrices"]
    }
}

# =========================
# Languages & Levels
# =========================
LANGUAGES = ["English", "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam", "Bengali",
             "Marathi", "Gujarati", "Odia", "Punjabi", "Assamese", "Maithili",
             "Santali", "Konkani", "Manipuri", "Urdu", "Dogri"]

LEVELS = ["Beginner", "Intermediate", "Advanced"]

# =========================
# Streamlit Page Config
# =========================
st.set_page_config(page_title="AI STEM Tutor", page_icon="🧠", layout="wide")
st.title("🧠 AI STEM Tutor")
st.markdown("Get multilingual STEM chapter summaries with step-by-step explanations. "
            "You can also ask custom questions and download summaries as text files.")

# =========================
# Sidebar: Selection
# =========================
with st.sidebar:
    st.header("Select Options")
    
    # STEM Section
    stem_section = st.selectbox("STEM Section", ["S - Science", "T - Technology", "E - Engineering", "M - Mathematics"])
    section_key = stem_section.split(" - ")[0]
    
    # Subject
    subjects = list(STEM_STRUCTURE[section_key].keys())
    subject = st.selectbox("Subject", subjects)
    
    # Chapter
    chapters = STEM_STRUCTURE[section_key][subject]
    chapter = st.selectbox("Chapter / Topic", chapters)
    
    # Level & Language
    level = st.selectbox("Level", LEVELS)
    language = st.selectbox("Preferred Language", LANGUAGES)

# =========================
# Main Area: Tabs
# =========================
tabs = st.tabs(["📘 Instructions", "📄 Chapter Summary", "✏️ Ask Your Question"])

with tabs[0]:
    st.subheader("How to Use")
    st.markdown("""
    1. Select **STEM Section → Subject → Chapter** from the sidebar.  
    2. Choose your **Level** and **Language**.  
    3. Get a **chapter summary** or ask your **custom question**.  
    4. You can **download the chapter summary** as a text file.
    """)

with tabs[1]:
    if st.button("Generate Chapter Summary"):
        with st.spinner("Generating chapter summary..."):
            try:
                payload = {
                    "subject": subject,
                    "level": level,
                    "question": chapter,  # Chapter summary request
                    "learning_style": "Text-based",
                    "background": "",
                    "language": language
                }

                response = requests.post(f"{BACKEND_URL}/tutoring", json=payload)

                if response.status_code == 200:
                    summary_text = response.json().get("response", "")
                    
                    with st.expander("📄 Click to view chapter summary", expanded=True):
                        st.write(summary_text)
                    
                    # Download button
                    st.download_button(
                        label="💾 Download Chapter Summary",
                        data=summary_text,
                        file_name=f"{subject}_{chapter}_summary.txt",
                        mime="text/plain"
                    )
                else:
                    st.error(f"Error {response.status_code}: {response.text}")

            except Exception as e:
                st.error(f"An error occurred: {str(e)}")

with tabs[2]:
    user_question = st.text_area("Type your custom question here:",
                                 placeholder="E.g., Explain Pythagoras theorem with an example")
    if st.button("Ask Tutor About Your Question"):
        if not user_question.strip():
            st.warning("Please enter a question!")
        else:
            with st.spinner("Generating response for your question..."):
                try:
                    payload = {
                        "subject": subject,
                        "level": level,
                        "question": user_question,
                        "learning_style": "Text-based",
                        "background": "",
                        "language": language
                    }

                    response = requests.post(f"{BACKEND_URL}/tutoring", json=payload)

                    if response.status_code == 200:
                        tutor_reply = response.json().get("response", "")
                        with st.expander("📝 Click to view your tutor response", expanded=True):
                            st.write(f"📝 Tutor Response:\n{tutor_reply}")
                    else:
                        st.error(f"Error {response.status_code}: {response.text}")

                except Exception as e:
                    st.error(f"An error occurred: {str(e)}")
