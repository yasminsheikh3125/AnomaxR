from fastapi import FastAPI, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

import shutil
import os

from anomaly_system import detect_anomalies

app = FastAPI()

# -------------------- CORS --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- Upload Folder --------------------
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# -------------------- Static Files --------------------
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# -------------------- Home --------------------
@app.get("/")
def home():
    return {"message": "API is working."}

# -------------------- Health Check --------------------
@app.api_route("/health", methods=["GET", "HEAD"])
def health():
    return {"status": "ok"}

# -------------------- Upload API (FAST ⚡) --------------------
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "message": "File uploaded successfully",
        "file_path": file_path
    }

# -------------------- Analyze API (HEAVY 🤖) --------------------
@app.post("/analyze")
def analyze(file_path: str):
    result = detect_anomalies(file_path)

    BASE_URL = "https://anomaxr.onrender.com"

    # Convert local paths to public URLs
    def convert_paths(obj):
        if isinstance(obj, dict):
            return {k: convert_paths(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [convert_paths(i) for i in obj]
        elif isinstance(obj, str) and obj.startswith("/uploads"):
            return BASE_URL + obj
        else:
            return obj

    result = convert_paths(result)

    return result