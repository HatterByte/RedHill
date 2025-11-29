import os
import re
import uuid
import httpx
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Response
from pydantic import BaseModel
from PIL import Image
import pytesseract
import whisper  # from openai-whisper package

class ExtractPNRRequest(BaseModel):
    text: Optional[str] = None
    image_urls: Optional[List[str]] = None
    audio_urls: Optional[List[str]] = None

app = FastAPI()

# Load the Whisper model. You can choose "tiny", "base", "small", "medium", or "large"
model = whisper.load_model("base")

def extract_pnr_from_text(text: Optional[str]) -> Optional[str]:
    """Extract a 10-digit PNR from the given text."""
    if not text:
        return None
    pnr_pattern = r'\b\d{10}\b'
    matches = re.findall(pnr_pattern, text)
    return matches[0] if matches else None

async def extract_pnr_from_image(url: str) -> Optional[str]:
    """Download the image from the given URL, run OCR, and extract PNR."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()

        temp_filename = f"temp_{uuid.uuid4().hex[:8]}.jpg"
        with open(temp_filename, "wb") as f:
            f.write(response.content)

        text = pytesseract.image_to_string(Image.open(temp_filename))
        os.remove(temp_filename)
        return extract_pnr_from_text(text)
    except Exception:
        return None

def transcribe_audio_file(file_path: str) -> Optional[str]:
    """Transcribe the local audio file using the open-source Whisper model."""
    try:
        result = model.transcribe(file_path)
        if result and "text" in result:
            return result["text"].strip()
    except Exception:
        return None
    return None

async def extract_pnr_from_audio(url: str) -> Optional[str]:
    """Download the audio from the given URL, transcribe using Whisper, and extract PNR."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()

        temp_filename = f"temp_{uuid.uuid4().hex[:8]}.wav"
        with open(temp_filename, "wb") as f:
            f.write(response.content)

        # Transcribe audio using Whisper
        text = transcribe_audio_file(temp_filename)
        os.remove(temp_filename)

        if text:
            return extract_pnr_from_text(text)
    except Exception:
        return None
    return None

@app.post("/extract_pnr")
async def extract_pnr(request: ExtractPNRRequest, response: Response):
    # 1. Check PNR in text
    if request.text:
        pnr = extract_pnr_from_text(request.text)
        if pnr:
            return {"pnr": pnr}

    # 2. Check images via OCR
    if request.image_urls:
        for img_url in request.image_urls:
            pnr = await extract_pnr_from_image(img_url)
            if pnr:
                return {"pnr": pnr}

    # 3. Check audio by transcription using local Whisper model
    if request.audio_urls:
        for audio_url in request.audio_urls:
            pnr = await extract_pnr_from_audio(audio_url)
            if pnr:
                return {"pnr": pnr}

    # If no PNR found, return 204 No Content
    response.status_code = 204
    return
