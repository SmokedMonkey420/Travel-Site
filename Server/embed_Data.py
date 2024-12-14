import numpy as np
from pymongo import MongoClient
from transformers import BertTokenizer, BertModel
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.preprocessing.image import img_to_array
import requests
from PIL import Image
import torch
from io import BytesIO


# Initialize BERT tokenizer and model
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
bert_model = BertModel.from_pretrained('bert-base-uncased')

# Initialize ResNet50 model (pre-trained weights with pooling)
resnet_model = ResNet50(weights='imagenet', include_top=False, pooling='avg')


# Function to generate BERT embeddings for text
def get_text_embedding(text):
    """Generates embeddings for text using BERT."""
    try:
        tokens = tokenizer(text, return_tensors='pt', truncation=True, max_length=128)
        with torch.no_grad():
            output = bert_model(**tokens)
        # Return CLS token embedding
        return output.last_hidden_state[:, 0, :].numpy()
    except Exception as e:
        print(f"Error during text embedding for text '{text}': {e}")
        return None


# Function to compute ResNet50 embeddings for an image URL
def get_image_embedding(image_url):
    """
    Handles image decoding, resizing, normalization, and generates ResNet50 embeddings
    from a valid image URL.
    """
    try:
        print(f"[INFO] Fetching image from URL: {image_url}")
        
        # Fetch the image from the URL
        response = requests.get(image_url)
        
        if response.status_code != 200:
            print(f"[ERROR] Failed to fetch image. HTTP response code: {response.status_code}")
            return None

        # Decode the image
        image = Image.open(BytesIO(response.content)).convert('RGB')
        image = image.resize((224, 224))  # Resize to ResNet50's expected input
        image = img_to_array(image) / 255.0  # Normalize pixel values between 0 and 1
        image = np.expand_dims(image, axis=0)  # ResNet50 expects batch dimension

        # Generate ResNet50 embedding
        embedding = resnet_model.predict(image)
        print(f"[INFO] Successfully computed image embedding for {image_url}")
        return embedding
    except Exception as e:
        print(f"[ERROR] Could not process image at {image_url}: {e}")
        return None


# MongoDB connection
client = MongoClient("mongodb+srv://MonkeyBiscuit:HwBfFWnU8g7YYPvJfevf@touristspotter.dhnp9.mongodb.net/")
db = client['tourist_app_db']
collection = db['tourist_spots']


# Fetch data, generate embeddings, and save back to MongoDB
def process_and_store_embeddings():
    try:
        # Query the entire collection
        cursor = collection.find({})  # Get all documents in the collection
        for doc in cursor:
            try:
                # Ensure we are ONLY using image URLs for embeddings
                image_url = doc.get('placePhoto', None)  # Corrected to match your database key
                if not image_url:
                    print(f"[WARNING] No valid image URL for document: {doc.get('placeId')}")
                    continue

                # Generate combined text embedding from editorial summary + caption
                editorial_summary = doc.get('editorialSummary', '') or ""
                caption = doc.get('caption', '') or ""
                combined_text = f"{editorial_summary} {caption}"

                # Text embedding
                text_embedding = get_text_embedding(combined_text)
                if text_embedding is None:
                    print(f"[ERROR] Skipping text embedding for Place ID '{doc.get('placeId')}'")
                    continue

                # Image embedding
                image_embedding = get_image_embedding(image_url)
                if image_embedding is None:
                    print(f"[ERROR] Image embedding failed for image URL '{image_url}'")
                    image_embedding = []

                # Prepare the update payload
                update_data = {
                "text_embedding": text_embedding.flatten().tolist(),  # Ensure embeddings are simple lists
                  "image_embedding": image_embedding[0].tolist() if image_embedding and len(image_embedding) > 0 else []
            }

                # Save back to MongoDB
                collection.update_one(
                    {"placeId": doc["placeId"]},
                    {"$set": update_data},
                    upsert=True
                )
                print(f"[SUCCESS] Processed and saved embeddings for Place ID: {doc['placeId']}")
            except Exception as e:
                print(f"[ERROR] Failed to process document with Place ID '{doc.get('placeId')}': {e}")

    except Exception as e:
        print(f"[ERROR] Failed to query MongoDB: {e}")


if __name__ == "__main__":
    print("[INFO] Starting the embedding process...")
    process_and_store_embeddings()
    print("[INFO] Embedding process completed.")
