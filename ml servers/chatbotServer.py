# run_server.py

import uvicorn
import os
from fastapi.middleware.cors import CORSMiddleware

# Import the FastAPI app from your server file
from chatbot import app  # Assuming your previous code is in server.py

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

def main():
    """Run the FastAPI server"""
    # Get port from environment variable or use default
    port = int(os.getenv("PORT", 9050))
    
    # Configure uvicorn
    config = uvicorn.Config(
        app=app,
        host="0.0.0.0",
        port=port,
        reload=True,  # Enable auto-reload during development
        workers=1,    # Number of worker processes
        log_level="info"
    )
    
    # Create and run the server
    server = uvicorn.Server(config)
    server.run()

if __name__ == "__main__":
    main()