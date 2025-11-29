import torch
from transformers import ViTFeatureExtractor, ViTModel
from PIL import Image
import numpy as np
import faiss
import json
import logging
from datetime import datetime
import os
import cv2
from typing import List, Dict, Union, Optional
from dataclasses import dataclass
from tqdm import tqdm

@dataclass
class SimilarityResult:
    """Data class for storing similarity search results"""
    image_path: str
    description: str
    similarity_score: float

class VideoProcessor:
    @staticmethod
    def extract_key_frames(video_path: str, max_frames: int = 5) -> List[str]:
        """Extract key frames from a video"""
        os.makedirs('temp_frames', exist_ok=True)
        cap = cv2.VideoCapture(video_path)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        frame_interval = max(1, total_frames // max_frames)
        
        key_frames = []
        for i in range(0, total_frames, frame_interval):
            cap.set(cv2.CAP_PROP_POS_FRAMES, i)
            ret, frame = cap.read()
            if ret:
                frame_path = f'temp_frames/frame_{i}.jpg'
                cv2.imwrite(frame_path, frame)
                key_frames.append(frame_path)
                if len(key_frames) == max_frames:
                    break
        
        cap.release()
        return key_frames

class SimilarityFinder:
    def __init__(
        self,
        data_path: str,
        model_name: str = "google/vit-base-patch16-224",
        device: Optional[str] = None,
        index_method: str = "cosine"
    ):
        self.setup_device(device)
        self.setup_model(model_name)
        self.index_method = index_method
        self.load_data(data_path)
        
    def setup_device(self, device: Optional[str] = None) -> None:
        if device:
            self.device = device
        else:
            self.device = "cuda" if torch.cuda.is_available() else "cpu"
            
    def setup_model(self, model_name: str) -> None:
        self.feature_extractor = ViTFeatureExtractor.from_pretrained(model_name)
        self.model = ViTModel.from_pretrained(model_name)
        self.model.to(self.device)
        self.model.eval()
            
    def extract_features(self, image_path: str) -> np.ndarray:
        with Image.open(image_path) as img:
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            inputs = self.feature_extractor(img, return_tensors="pt").to(self.device)
            
            with torch.no_grad():
                outputs = self.model(**inputs)
                features = outputs.last_hidden_state[:, 0].cpu().numpy()
            
            if self.index_method == "cosine":
                features = features / np.linalg.norm(features)
                
            return features.flatten()
                
    def load_data(self, data_path: str) -> None:
        if not os.path.exists(data_path):
            self.data = []
            with open(data_path, 'w') as f:
                json.dump(self.data, f)
        else:
            with open(data_path, 'r') as f:
                self.data = json.load(f)
        
        self.embeddings = []
        valid_entries = []
        
        for item in tqdm(self.data, desc="Processing images"):
            image_path = item.get('image_path', '')
            if os.path.exists(image_path):
                try:
                    features = self.extract_features(image_path)
                    self.embeddings.append(features)
                    valid_entries.append(item)
                except Exception:
                    continue
        
        self.data = valid_entries
        
        if self.embeddings:
            self.embeddings = np.stack(self.embeddings)
            
            if self.index_method == "cosine":
                self.index = faiss.IndexFlatIP(self.embeddings.shape[1])
            else:
                self.index = faiss.IndexFlatL2(self.embeddings.shape[1])
                
            self.index.add(self.embeddings.astype('float32'))
            
    def find_similar_images(
        self,
        image_path: str,
        k: int = 5,
        threshold: Optional[float] = None
    ) -> List[Dict[str, Union[str, float]]]:
        query_features = self.extract_features(image_path)
        
        distances, indices = self.index.search(
            query_features.reshape(1, -1).astype('float32'), k
        )
        
        results = []
        for idx, dist in zip(indices[0], distances[0]):
            if idx >= len(self.data):
                continue
                
            if self.index_method == "cosine":
                score = float(dist)
            else:
                score = float(1 - dist/100)
                
            if threshold is not None and score < threshold:
                continue
                
            results.append({
                "description": self.data[idx].get('caption', ''),
                "similarity_score": round(score, 3)
            })
        
        return results

    def find_similar_content(
        self,
        images: Optional[List[str]] = None,
        videos: Optional[List[str]] = None,
        k: int = 5,
        threshold: float = 0.5
    ) -> List[Dict[str, Union[str, float]]]:
        all_results = []
        
        # Process images
        if images:
            for image_path in images:
                results = self.find_similar_images(image_path, k, threshold)
                all_results.extend(results)
        
        # Process videos
        if videos:
            for video_path in videos:
                frames = VideoProcessor.extract_key_frames(video_path)
                for frame in frames:
                    results = self.find_similar_images(frame, k, threshold)
                    all_results.extend(results)
                # Cleanup frames
                for frame in frames:
                    os.remove(frame)
        
        return all_results

def main():
    # Initialize finder
    finder = SimilarityFinder(
        data_path="data2.json",
        model_name="google/vit-base-patch16-224"
    )
    
    # Example usage
    image_paths = ["Testfile/F1hbkXxWwAANi41.jpeg"]
    video_paths = ["Testfile/toilet_2024121102689.mp4"]
    
    # Get similar content
    results = finder.find_similar_content(
    images=image_paths,
        k=5,
        threshold=0.5
    )
    
    # Print results
    print(json.dumps(results, indent=2))

if __name__ == "__main__":
    main()