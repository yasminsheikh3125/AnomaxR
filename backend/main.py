from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File
from fastapi.staticfiles import StaticFiles
import shutil
import os

from anomaly_system import detect_anomalies

app = FastAPI()

#  CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

#  Upload folder
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

#  Static files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.get("/")
def home():
    return {"message": "API is working 🚀"}


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):

    # Save uploaded file
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Run model
    result = detect_anomalies(file_path)

    #  Base URL (keep consistent)
    BASE_URL = "https://anomaxr.onrender.com"

    #  Fix ALL URLs (including nested)
    def convert_paths(obj):
        if isinstance(obj, dict):
            return {k: convert_paths(v) for k, v in obj.items()}
        elif isinstance(obj, str) and obj.startswith("/uploads"):
            return BASE_URL + obj
        else:
            return obj

    result = convert_paths(result)

    return result
@app.api_route("/health", methods=["GET", "HEAD"])
def health():
    return {"status": "ok"}