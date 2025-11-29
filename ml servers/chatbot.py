import asyncio
import os
import uuid
import re
from typing import Dict, List, Optional, Tuple

import openai
import httpx
from PIL import Image
import pytesseract
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

class ChatRequest(BaseModel):
    user_message: str


class ChatMessage(BaseModel):
    message: str
    conversation_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    classification_result: Optional[Dict] = None

class Chatbot:
    def __init__(self, classifier):
        self.classifier = classifier
        self.conversations = {}
        self.system_prompt = """You are a helpful and friendly railway complaint chatbot. Your goal is to understand users' complaints and gather necessary information naturally.

Key behaviors:
1. Be conversational and empathetic
2. Extract complaint details from natural conversation
3. If the complaint is clear and complete, proceed to classification
4. If details are missing, ask naturally for more information
5. Accept media (images, video) URLs when shared
6. Maintain context throughout the conversation

Remember: Users can share their complaints in any format - from detailed descriptions to casual conversation."""

    async def extract_media_urls(self, text: str) -> Dict[str, List[str]]:
        """Extract media URLs from text and categorize them"""
        url_pattern = r'https?://[^\s<>"]+|www\.[^\s<>"]+' 
        urls = re.findall(url_pattern, text)
        
        media = {
            "image_urls": [],
            "video_urls": []
        }
        
        for url in urls:
            # Simple extension-based categorization
            if any(ext in url.lower() for ext in ['.jpg', '.jpeg', '.png', '.gif']):
                media["image_urls"].append(url)
            elif any(ext in url.lower() for ext in ['.mp4', '.avi', '.mov']):
                media["video_urls"].append(url)
                
        return media

    def should_classify(self, conversation: List[Dict]) -> bool:
        """Determine if we have enough information to classify the complaint"""
        # Combine all user messages
        user_input = " ".join([msg["content"] for msg in conversation if msg["role"] == "user"])
        
        # Basic heuristics for complaint completeness
        has_problem_description = len(user_input.split()) >= 5
        has_specific_details = any(keyword in user_input.lower() for keyword in 
            ['train', 'station', 'platform', 'ticket', 'seat', 'delay', 'service'])
        
        return has_problem_description and has_specific_details

    async def process_message(self, message: str, conversation_id: Optional[str] = None) -> ChatResponse:
        # Initialize or get existing conversation
        if conversation_id not in self.conversations:
            self.conversations[conversation_id] = []
        
        conversation = self.conversations[conversation_id]
        
        # Extract any media URLs
        media_urls = await self.extract_media_urls(message)
        
        # Add user message to conversation
        conversation.append({"role": "user", "content": message})
        
        # Generate chatbot response using GPT
        messages = [
            {"role": "system", "content": self.system_prompt},
            *conversation
        ]
        
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages
        )
        
        bot_response = response.choices[0].message.content
        conversation.append({"role": "assistant", "content": bot_response})
        
        # Check if we should classify
        classification_result = None
        if self.should_classify(conversation):
            # Combine all user messages for classification
            full_text = " ".join([msg["content"] for msg in conversation if msg["role"] == "user"])
            
            try:
                classification_result = self.classifier.classify_content(
                    text=full_text,
                    images=media_urls["image_urls"] if media_urls["image_urls"] else None,
                    videos=media_urls["video_urls"] if media_urls["video_urls"] else None
                )
                
                # Add classification result to bot response
                if classification_result:
                    bot_response += f"\n\nBased on your complaint, I've classified it as: {classification_result.primary_category}"
                    if classification_result.secondary_categories:
                        bot_response += f"\nRelated categories: {', '.join(classification_result.secondary_categories)}"
                    
            except Exception as e:
                print(f"Classification error: {str(e)}")
                # Don't let classification errors affect the conversation flow
                pass

        return ChatResponse(
            response=bot_response,
            classification_result=classification_result
        )

class ChatbotCLI:
    def __init__(self):
        # Set your OpenAI API key here
        openai.api_key = os.getenv("OPENAI_API_KEY")
        
        # Initialize the chatbot with no initial conversation
        self.chatbot = Chatbot(None)
        # Unique ID for the user conversation
        self.conversation_id = str(uuid.uuid4())
        # Server URL for classification
        self.server_url = "http://0.0.0.0:9017"
        
        # Media links and related tracking
        self.media_links = {
            "image_urls": [],
            "video_urls": [],
            "audio_urls": []
        }
        self.pnr_images = set()  # Track images that yielded PNR
        self.complaint_registered = False
        self.pnr_found = None
        self.tried_pnr_extraction = False
        self.last_result = None
        
        # State variables for waiting for PNR
        self.waiting_for_pnr = False
        self.pnr_attempts = 0  # Count how many times user fails to provide PNR

    def extract_pnr(self, text: str) -> Optional[str]:
        """Extract PNR number from text (looking for a 10-digit number)."""
        pnr_pattern = r'\b\d{10}\b'
        matches = re.findall(pnr_pattern, text)
        return matches[0] if matches else None

    async def extract_pnr_from_image(self, image_path: str, image_url: str = None) -> Optional[str]:
        """Extract PNR from an image by OCR."""
        try:
            text = pytesseract.image_to_string(Image.open(image_path))
            pnr = self.extract_pnr(text)
            if pnr and image_url:
                self.pnr_images.add(image_url)  # Record the image source of PNR
            return pnr
        except Exception:
            return None

    async def check_pnr_in_all_sources(self, conversation_text: str) -> Tuple[Optional[str], str]:
        """Check all sources (text, audio, images) for PNR."""
        if self.tried_pnr_extraction:
            return self.pnr_found, "already_checked"

        self.tried_pnr_extraction = True
        
        # Check conversation text
        pnr = self.extract_pnr(conversation_text)
        if pnr:
            self.pnr_found = pnr
            return pnr, "text"

        # Check audio transcription if available
        if self.last_result and 'transcribed_texts' in self.last_result:
            for transcript in self.last_result['transcribed_texts']:
                pnr = self.extract_pnr(transcript)
                if pnr:
                    self.pnr_found = pnr
                    return pnr, "audio"

        # Check images
        async with httpx.AsyncClient() as client:
            for img_url in self.media_links["image_urls"]:
                try:
                    response = await client.get(img_url)
                    if response.status_code == 200:
                        temp_path = f"temp_image_{uuid.uuid4().hex[:8]}.jpg"
                        with open(temp_path, 'wb') as f:
                            f.write(response.content)
                        pnr = await self.extract_pnr_from_image(temp_path, img_url)
                        os.remove(temp_path)
                        if pnr:
                            self.pnr_found = pnr
                            return pnr, "image"
                except Exception:
                    pass

        return None, "not_found"

    async def classify_with_server(self, text: str) -> Dict:
        """Send complaint details to the external server for classification."""
        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                filtered_images = [url for url in self.media_links["image_urls"] 
                                   if url not in self.pnr_images]
                
                payload = {
                    "text": text,
                    "image_urls": filtered_images,
                    "video_urls": self.media_links["video_urls"],
                    "audio_urls": self.media_links["audio_urls"]
                    
                }
                print(self.media_links["audio_urls"])
                
                response = await client.post(
                    f"{self.server_url}/classify_complaint",
                    json=payload
                )
                response.raise_for_status()
                return response.json()
            except Exception:
                return {}

    def categorize_media_url(self, url: str) -> Optional[str]:
        url_lower = url.lower()
        print(url_lower)
        # Image formats
        if any(ext in url_lower for ext in ['.jpg', '.jpeg', '.png', '.gif', '.bmp']):
            return "image_urls"
        # Video formats (include .webm here if you want to treat webm as video)
        if any(ext in url_lower for ext in ['.mp4', '.avi', '.mov', '.mkv']):
            return "video_urls"
        # Audio formats (add .webm here if you'd like to treat webm as audio)
        if any(ext in url_lower for ext in ['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.webm']):
            return "audio_urls"
        return None


    def extract_and_categorize_urls(self, message: str) -> bool:
        """Extract URLs from the user message and categorize them."""
        url_pattern = r'https?://[^\s<>"]+|www\.[^\s<>"]+'
        urls = re.findall(url_pattern, message)
        
        urls_found = False
        for url in urls:
            media_type = self.categorize_media_url(url)
            if media_type and url not in self.media_links[media_type]:
                self.media_links[media_type].append(url)
                urls_found = True
        return urls_found

    def format_complaint_details(self, result: Dict) -> str:
        """Format complaint details for output."""
        details = []
        if result.get('category'):
            details.append(f"Category: {result['category']}")
        if result.get('subcategory'):
            details.append(f"Subcategory: {result['subcategory']}")
        if result.get('severity'):
            details.append(f"Severity Level: {result['severity']}")
        if result.get('reason'):
            details.append(f"Details: {result['reason']}")
        
        if result.get('transcribed_texts'):
            details.append("\nTranscribed Audio Evidence:")
            for text in result['transcribed_texts']:
                details.append(f"- {text}")
                
        return "\n".join(details)

    async def finalize_complaint_without_pnr(self) -> str:
        """Finalize complaint registration without a PNR after multiple failed attempts."""
        response_text = []
        pnr = None
        complaint_id = f"COMP-{uuid.uuid4().hex[:8]}"
        response_text.append("I understand your complaint. Let me help you register it.")
        response_text.append("✓ Complaint Successfully Registered!")
        response_text.append(f"Complaint ID: {complaint_id}")

        if pnr:
            response_text.append(f"PNR: {pnr}")

        response_text.append("Complaint Details:")
        response_text.append(self.format_complaint_details(self.last_result))

        filtered_image_count = len([img for img in self.media_links["image_urls"] if img not in self.pnr_images])
        if filtered_image_count or self.media_links["video_urls"] or self.media_links["audio_urls"]:
            response_text.append("Evidence Attached:")
            if filtered_image_count:
                response_text.append(f"Images: {filtered_image_count}")
            if self.media_links["video_urls"]:
                response_text.append(f"Videos: {len(self.media_links['video_urls'])}")
            if self.media_links["audio_urls"]:
                response_text.append(f"Audio Files: {len(self.media_links['audio_urls'])}")

        status_message = "Your complaint has been logged and will be processed. "
        status_message += "You can track its status using the Complaint ID."
        response_text.append(status_message)

        response_text.append("Is there anything else you would like to know about your complaint?")
        self.complaint_registered = True
        self.waiting_for_pnr = False
        self.pnr_attempts = 0
        return "\n".join(response_text)

    async def handle_pnr_input(self, user_message: str) -> str:
        """Handle user input when we are waiting for a PNR."""
        response_text = []
        
        # If user wants to skip
        if user_message.lower().strip() == "skip":
            return await self.finalize_complaint_without_pnr()

        # Try extracting PNR directly from user message
        pnr = self.extract_pnr(user_message)
        if pnr:
            # We have a valid PNR now
            complaint_id = f"COMP-{uuid.uuid4().hex[:8]}"
            response_text.append("I understand your complaint. Let me help you register it.")
            response_text.append("✓ Complaint Successfully Registered!")
            response_text.append(f"Complaint ID: {complaint_id}")
            response_text.append(f"PNR: {pnr}")

            response_text.append("Complaint Details:")
            response_text.append(self.format_complaint_details(self.last_result))

            filtered_image_count = len([img for img in self.media_links["image_urls"] if img not in self.pnr_images])
            if filtered_image_count or self.media_links["video_urls"] or self.media_links["audio_urls"]:
                response_text.append("Evidence Attached:")
                if filtered_image_count:
                    response_text.append(f"Images: {filtered_image_count}")
                if self.media_links["video_urls"]:
                    response_text.append(f"Videos: {len(self.media_links['video_urls'])}")
                if self.media_links["audio_urls"]:
                    response_text.append(f"Audio Files: {len(self.media_links['audio_urls'])}")

            status_message = "Your complaint has been logged and will be processed. "
            status_message += "You can track its status using the Complaint ID and PNR."
            response_text.append(status_message)

            response_text.append("Is there anything else you would like to know about your complaint?")
            self.complaint_registered = True
            self.waiting_for_pnr = False
            self.pnr_attempts = 0
            return "\n".join(response_text)

        # If not a direct PNR, maybe user provided a URL with evidence
        has_new_media = self.extract_and_categorize_urls(user_message)
        if has_new_media:
            # Check if we can extract PNR again now
            conversation = self.chatbot.conversations.get(self.conversation_id, [])
            full_text = " ".join([msg["content"] for msg in conversation if msg["role"] == "user"]) + " " + user_message
            pnr, source = await self.check_pnr_in_all_sources(full_text)
            if pnr:
                # Register now with PNR
                complaint_id = f"COMP-{uuid.uuid4().hex[:8]}"
                response_text.append("I understand your complaint. Let me help you register it.")
                response_text.append("✓ Complaint Successfully Registered!")
                response_text.append(f"Complaint ID: {complaint_id}")
                response_text.append(f"PNR: {pnr}")

                response_text.append("Complaint Details:")
                response_text.append(self.format_complaint_details(self.last_result))

                filtered_image_count = len([img for img in self.media_links["image_urls"] if img not in self.pnr_images])
                if filtered_image_count or self.media_links["video_urls"] or self.media_links["audio_urls"]:
                    response_text.append("Evidence Attached:")
                    if filtered_image_count:
                        response_text.append(f"Images: {filtered_image_count}")
                    if self.media_links["video_urls"]:
                        response_text.append(f"Videos: {len(self.media_links['video_urls'])}")
                    if self.media_links["audio_urls"]:
                        response_text.append(f"Audio Files: {len(self.media_links['audio_urls'])}")

                status_message = "Your complaint has been logged and will be processed. "
                status_message += "You can track its status using the Complaint ID and PNR."
                response_text.append(status_message)

                response_text.append("Is there anything else you would like to know about your complaint?")
                self.complaint_registered = True
                self.waiting_for_pnr = False
                self.pnr_attempts = 0
                return "\n".join(response_text)

        # If we got here, we still don't have PNR and user didn't skip
        self.pnr_attempts += 1
        if self.pnr_attempts > 2:  # After 2 failed attempts, just proceed without PNR
            return await self.finalize_complaint_without_pnr()

        response_text.append("I didn't find a valid PNR in your response.")
        response_text.append("Please provide a 10-digit PNR number, a media link containing it, or type 'skip' to proceed without a PNR.")
        return "\n".join(response_text)

    async def process_user_message(self, user_message: str) -> str:
        """Process a single user message and return the assistant's response as text."""

        # Handle exit commands
        if user_message.lower() in ['quit', 'exit', 'bye']:
            return "Thank you for using the Railway Complaint Assistant. Goodbye!"

        # If we are waiting for PNR, handle that first
        if self.waiting_for_pnr:
            return await self.handle_pnr_input(user_message)

        response_text = []
        has_new_media = self.extract_and_categorize_urls(user_message)

        # Check if there's a PNR in newly added media
        if has_new_media and not self.pnr_found:
            conversation = self.chatbot.conversations.get(self.conversation_id, [])
            full_text = " ".join([msg["content"] for msg in conversation if msg["role"] == "user"]) + " " + user_message
            pnr, source = await self.check_pnr_in_all_sources(full_text)
            if pnr and source == "image":
                response_text.append(f"Found PNR: {pnr}")
                response_text.append("Please describe your complaint or issue.")
                return "\n".join(response_text)

        # Prepare full conversation text for classification
        conversation = self.chatbot.conversations.get(self.conversation_id, [])
        full_text = " ".join([msg["content"] for msg in conversation if msg["role"] == "user"]) + " " + user_message

        # If complaint already registered, just continue the conversation
        if self.complaint_registered:
            resp = await self.chatbot.process_message(
                message=user_message,
                conversation_id=self.conversation_id
            )
            return resp.response

        # If no complaint yet, try classification
        if (len(conversation) >= 1 or has_new_media) and not self.complaint_registered:
            result = await self.classify_with_server(full_text)
            if result and result.get('confidence', 0) > 0.7:
                self.last_result = result

                # Check if PNR found; if not, ask user
                if not self.pnr_found:
                    pnr, source = await self.check_pnr_in_all_sources(full_text)
                    if not pnr:
                        # Ask for PNR and set waiting_for_pnr flag
                        self.waiting_for_pnr = True
                        self.pnr_attempts = 0
                        response_text.append("To complete your complaint registration, please provide your 10-digit PNR number.")
                        response_text.append("You can send the PNR directly, or provide an image/audio URL containing it, or type 'skip'.")
                        return "\n".join(response_text)
                else:
                    # We have PNR, register complaint
                    pnr = self.pnr_found
                    complaint_id = f"COMP-{uuid.uuid4().hex[:8]}"
                    response_text.append("I understand your complaint. Let me help you register it.")
                    response_text.append("✓ Complaint Successfully Registered!")
                    response_text.append(f"Complaint ID: {complaint_id}")
                    if pnr:
                        response_text.append(f"PNR: {pnr}")

                    response_text.append("Complaint Details:")
                    response_text.append(self.format_complaint_details(result))

                    filtered_image_count = len([img for img in self.media_links["image_urls"] if img not in self.pnr_images])
                    if filtered_image_count or self.media_links["video_urls"] or self.media_links["audio_urls"]:
                        response_text.append("Evidence Attached:")
                        if filtered_image_count:
                            response_text.append(f"Images: {filtered_image_count}")
                        if self.media_links["video_urls"]:
                            response_text.append(f"Videos: {len(self.media_links['video_urls'])}")
                        if self.media_links["audio_urls"]:
                            response_text.append(f"Audio Files: {len(self.media_links['audio_urls'])}")

                    status_message = "Your complaint has been logged and will be processed. "
                    status_message += f"You can track its status using the Complaint ID and PNR."
                    response_text.append(status_message)

                    response_text.append("Is there anything else you would like to know about your complaint?")
                    self.complaint_registered = True
                    return "\n".join(response_text)

        # If no complaint classified yet, just proceed with normal conversation
        resp = await self.chatbot.process_message(
            message=user_message,
            conversation_id=self.conversation_id
        )
        return resp.response


from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow requests from all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a single global instance of ChatbotCLI for stateful conversations
chatbot_cli = ChatbotCLI()

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    user_message = request.user_message.strip()
    if not user_message:
        raise HTTPException(status_code=400, detail="Empty user_message is not allowed.")
    try:
        response = await chatbot_cli.process_user_message(user_message)
        return {"assistant_response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
