#!/bin/bash

# Start FastAPI backend in background
uvicorn BACKEND.main:app --host 0.0.0.0 --port 8000 &

# Wait a few seconds for backend to start
sleep 5

# Start Streamlit frontend
cd FRONTEND
streamlit run app.py --server.port $PORT --server.address 0.0.0.0
