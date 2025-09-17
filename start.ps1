# Start FastAPI backend in background
Start-Process -NoNewWindow -FilePath "python" -ArgumentList "BACKEND\main.py"

# Wait a bit for backend to start
Start-Sleep -Seconds 5

# Start Streamlit frontend
Set-Location -Path "FRONTEND"
streamlit run app.py --server.port $env:PORT --server.address 0.0.0.0
