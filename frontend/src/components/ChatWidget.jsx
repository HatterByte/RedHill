import React, { useState, useRef, useEffect } from "react";
import { Send, Image, Paperclip, Mic, X, MessageCircle, Minimize2 } from 'lucide-react';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CHAT_API_URL = import.meta.env.VITE_BASE_URL;

const ChatWidget = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw error;
    }
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setMediaPreview({
            type: "image",
            url: e.target.result,
            file: file,
          });
        };
        reader.readAsDataURL(file);
      } else {
        setMediaPreview({
          type: "file",
          name: file.name,
          size: file.size,
          file: file,
        });
      }
    } catch (error) {
      console.error("Error handling file:", error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        setMediaPreview({
          type: "audio",
          url: URL.createObjectURL(audioBlob),
          file: audioBlob,
        });
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const clearMediaPreview = () => {
    setMediaPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() && !mediaPreview) return;

    let cloudinaryUrl = null;
    if (mediaPreview) {
      try {
        cloudinaryUrl = await uploadToCloudinary(mediaPreview.file);
      } catch (error) {
        console.error("Error uploading media:", error);
        return;
      }
    }

    const newUserMessage = {
      role: "user",
      content: inputMessage.trim(),
      media: cloudinaryUrl
        ? {
            type: mediaPreview.type,
            url: cloudinaryUrl,
            name: mediaPreview.name,
          }
        : null,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputMessage("");
    setMediaPreview(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${CHAT_API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage.trim(),
          mediaUrl: cloudinaryUrl,
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
          media: data.media,
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageContent = (message) => {
    return (
      <div className="space-y-2">
        {message.content && <div>{message.content}</div>}
        {message.media && (
          <div className="mt-2">
            {message.media.type === "image" && (
              <img
                src={message.media.url}
                alt="Shared image"
                className="max-w-full rounded-lg max-h-48 object-contain"
              />
            )}
            {message.media.type === "file" && (
              <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded">
                <Paperclip className="w-4 h-4" />
                <span className="text-sm">{message.media.name}</span>
              </div>
            )}
            {message.media.type === "audio" && (
              <audio controls className="w-full">
                <source src={message.media.url} type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
            )}
          </div>
        )}
      </div>
    );
  };

  // Add this new function to handle incoming messages
  const handleNewMessage = (message) => {
    setMessages(prev => [...prev, message]);
    if (!isExpanded) {
      setUnreadCount(prev => prev + 1);
    }
  };

  // Modify the return statement to include collapse/expand functionality
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isExpanded ? (
        // Collapsed state - show floating button with unread count
        <button
          onClick={() => {
            setIsExpanded(true);
            setUnreadCount(0);
          }}
          className="bg-[#5E0022] text-white p-4 rounded-full shadow-lg hover:bg-[#600000] transition-all duration-300 relative"
        >
          <MessageCircle className="w-6 h-6" />
          {unreadCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </div>
          )}
        </button>
      ) : (
        // Expanded state - show full chat widget
        <div className="w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col animate-slide-up">
          {/* Header */}
          <div className="p-4 bg-[#5E0022] text-white rounded-t-lg flex justify-between items-center">
            <h3 className="text-lg font-semibold">Railmadad Assistant</h3>
            <button 
              onClick={() => setIsExpanded(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.role === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-[#5E0022] text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {renderMessageContent(message)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-left mb-4">
                <div className="inline-block p-3 rounded-lg bg-gray-100">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Media Preview */}
          {mediaPreview && (
            <div className="px-4 py-2 border-t">
              <div className="relative inline-block">
                {mediaPreview.type === 'image' && (
                  <img 
                    src={mediaPreview.url} 
                    alt="Preview" 
                    className="h-20 w-auto rounded"
                  />
                )}
                {mediaPreview.type === 'file' && (
                  <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded">
                    <Paperclip className="w-4 h-4" />
                    <span className="text-sm">{mediaPreview.name}</span>
                  </div>
                )}
                {mediaPreview.type === 'audio' && (
                  <audio controls className="h-10">
                    <source src={mediaPreview.url} type="audio/wav" />
                  </audio>
                )}
                <button
                  onClick={clearMediaPreview}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-[#5E0022]"
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-[#5E0022] rounded-lg hover:bg-red-50"
              >
                <Image className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-2 rounded-lg ${
                  isRecording 
                    ? 'text-red-600 hover:bg-red-50' 
                    : 'text-[#5E0022] hover:bg-red-50'
                }`}
              >
                <Mic className="w-5 h-5" />
              </button>
              <button
                type="submit"
                disabled={isLoading || (!inputMessage.trim() && !mediaPreview)}
                className="p-2 bg-[#5E0022] text-white rounded-lg hover:bg-[#600000] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

// Add these styles to your CSS
const styles = `
@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}
`;

export default ChatWidget;