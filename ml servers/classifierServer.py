import os
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import httpx
import aiofiles
import openai
import uvicorn
from dataclasses import asdict
import whisper
import torch
from multimodalClassifier import IntentBasedMultimodalClassifier  # Import from your file

# Create upload directories
os.makedirs("uploaded_images", exist_ok=True)
os.makedirs("uploaded_videos", exist_ok=True)
os.makedirs("uploaded_audio", exist_ok=True)

app = FastAPI(title="Railway Complaint Classification API")

class ComplaintRequest(BaseModel):
    text: Optional[str] = None
    image_urls: Optional[List[str]] = None
    video_urls: Optional[List[str]] = None
    audio_urls: Optional[List[str]] = None

# Initialize Whisper model at startup
@app.on_event("startup")
async def startup_event():
    global classifier, whisper_model
    
    # Initialize classifier
    openai.api_key = os.getenv("OPENAI_API_KEY")
    classifier = IntentBasedMultimodalClassifier(
        openai_api_key=openai.api_key,
        similarity_data_path="data2.json"
    )
    
    # Initialize Whisper model
    print("Loading Whisper model...")
    device = "cuda" if torch.cuda.is_available() else "cpu"
    whisper_model = whisper.load_model("medium", device=device)
    print(f"Whisper model loaded on {device}")

async def download_file(url: str, folder: str) -> str:
    """Download a file from URL and save it locally"""
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail=f"Failed to download file from {url}")
        
        filename = os.path.join(folder, os.path.basename(url))
        if not filename.strip():
            filename = os.path.join(folder, f"file_{hash(url)}")
        
        async with aiofiles.open(filename, 'wb') as f:
            await f.write(response.content)
        
        return filename

def transcribe_audio(audio_path: str) -> str:
    """Transcribe audio file using local Whisper model"""
    try:
        # Transcribe audio
        result = whisper_model.transcribe(
            audio_path,
            language="en",  # You can change this or make it auto-detect
            fp16=torch.cuda.is_available()  # Use fp16 if using GPU
        )
        return result["text"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Audio transcription failed: {str(e)}")

@app.post("/classify_complaint")
async def classify_complaint(complaint: ComplaintRequest):
    processed_files = []
    combined_text = complaint.text or ""
    transcribed_texts = []  # Store individual transcriptions
    
    # Process audio files first
    if complaint.audio_urls:
        for url in complaint.audio_urls:
            try:
                audio_path = await download_file(url, "uploaded_audio")
                processed_files.append(audio_path)
                # Transcribe audio and add to text
                audio_text = transcribe_audio(audio_path)
                transcribed_texts.append(audio_text)
                combined_text += " " + audio_text
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Failed to process audio {url}: {str(e)}")
    
    # Process images
    image_paths = []
    if complaint.image_urls:
        for url in complaint.image_urls:
            try:
                filepath = await download_file(url, "uploaded_images")
                image_paths.append(filepath)
                processed_files.append(filepath)
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Failed to process image {url}: {str(e)}")
    
    # Process videos
    video_paths = []
    if complaint.video_urls:
        for url in complaint.video_urls:
            try:
                filepath = await download_file(url, "uploaded_videos")
                video_paths.append(filepath)
                processed_files.append(filepath)
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Failed to process video {url}: {str(e)}")
    
    # Classify the complaint
    try:
        result = classifier.classify_content(
            text=combined_text,
            images=image_paths if image_paths else None,
            videos=video_paths if video_paths else None
        )
        
        result_dict = asdict(result)
        result_dict['processed_files'] = processed_files
        result_dict['transcribed_texts'] = transcribed_texts  # Individual transcriptions
        result_dict['combined_text'] = combined_text  # Combined text used for classification
        
        return result_dict
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Classification failed: {str(e)}")

# Add a simple health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "whisper_model_loaded": whisper_model is not None,
        "classifier_loaded": classifier is not None,
        "gpu_available": torch.cuda.is_available()
    }

if __name__ == "__main__":
    uvicorn.run("server3:app", host="0.0.0.0", port=9017, reload=True)