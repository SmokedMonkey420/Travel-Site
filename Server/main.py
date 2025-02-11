import tensorflow as tf
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.applications.resnet50 import preprocess_input
from tensorflow.keras.preprocessing import image
from transformers import BertTokenizer, BertModel
import numpy as np
import requests
from PIL import Image
from io import BytesIO
from pymongo import MongoClient
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.metrics.pairwise import cosine_similarity
import random

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

client = MongoClient("mongodb+srv://MonkeyBiscuit:HwBfFWnU8g7YYPvJfevf@touristspotter.dhnp9.mongodb.net/")
db = client['tourist_app_db']
collection = db['tourist_spots']
visitor_collection = db['visitor_data']

# Load pre-trained ResNet50 model
model = ResNet50(weights='imagenet', include_top=False, pooling='avg')

# Initialize BERT model for text features
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
bert_model = BertModel.from_pretrained('bert-base-uncased')

# Function for extracting image features
def extract_features(img_url):
    response = requests.get(img_url)
    img = Image.open(BytesIO(response.content)).convert('RGB')
    img = img.resize((224, 224))
    img_data = image.img_to_array(img)
    img_data = np.expand_dims(img_data, axis=0)
    img_data = preprocess_input(img_data)
    features = model.predict(img_data)
    return features.flatten()

# Function for extracting text features using BERT
def extract_text_features(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512)
    outputs = bert_model(**inputs)
    return outputs.last_hidden_state.mean(dim=1).detach().numpy().squeeze()

# Function for extracting features based on query type
def extract_features_for_query(query):
    if query.startswith("http"):
        return extract_features(query)
    return extract_text_features(query)

# Calculate similarities and retrieve similar documents
def get_similar_documents(query_features, query_type='image', top_n=5):
    query_features = np.array(query_features).reshape(1, -1)
    all_docs = list(collection.find({}, {'_id': 1, 'name': 1, 'text_features': 1, 'image_features': 1, 'placePhoto': 1}))
    
    similarities = []
    for doc in all_docs:
        if query_type == 'text':
            doc_features = np.array(doc.get('text_features', []))
        else:  # image query
            doc_features = np.array(doc.get('image_features', []))
        
        if doc_features.size == 0:  # Skip if no features are available
            continue
        
        similarity = cosine_similarity(query_features, doc_features.reshape(1, -1))
        similarities.append((doc, similarity[0][0]))
    
    similarities.sort(key=lambda x: x[1], reverse=True)
    return similarities[:top_n]

@app.route('/api/destinations-gallery', methods=['GET'])
def get_destinations():
    spots = list(collection.find({}, {"_id": 0}))  # Exclude MongoDB ID
    return jsonify(spots)

@app.route('/store-visitor-data', methods=["POST"])
def store_visitor_data():
    try:
        data = request.get_json()
        visitor_id = data.get("visitorId")
        selected_categories = data.get("selectedCategories")
        if not visitor_id or not selected_categories:
            return jsonify({"error": "Missing data"}), 400
        # Insert into MongoDB
        result = visitor_collection.insert_one({
            "visitorId": visitor_id,
            "selectedCategories": selected_categories,
        })
        return jsonify({"message": "Data stored successfully", "id": str(result.inserted_id)}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/get-visitor-data/<visitor_id>', methods=["GET"])
def get_visitor_data(visitor_id):
    try:
        visitor = visitor_collection.find_one({"visitorId": visitor_id})
        if visitor:
            visitor["_id"] = str(visitor["_id"])  # Convert ObjectId to string
            return jsonify(visitor), 200
        return jsonify({"message": "Visitor not found"}), 404
    except Exception as e:
        print(f"Error fetching visitor data: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/get-visitor-preference', methods=['GET'])
def get_visitor_preference():
    try:
        visitor_id = request.args.get('visitor_id')
        if not visitor_id:
            return jsonify({"error": "Visitor ID is required"}), 400
        visitor = visitor_collection.find_one({"visitorId": visitor_id})
        if visitor:
            visitor["_id"] = str(visitor["_id"])  # Convert ObjectId to string
            selected_categories = visitor.get("selectedCategories", [])
            return jsonify({
                "visitorId": visitor["visitorId"],
                "selectedCategories": selected_categories
            }), 200
        return jsonify({"message": "Visitor not found"}), 404
    except Exception as e:
        print(f"Error fetching visitor data: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/reset-preferences', methods=['POST'])
def reset_preferences():
    try:
        data = request.get_json()
        visitor_id = data.get('visitorId')
        if not visitor_id:
            return jsonify({"error": "Visitor ID is required"}), 400
        result = visitor_collection.update_one(
            {"visitorId": visitor_id},
            {"$set": {"selectedCategories": []}}
        )
        if result.modified_count > 0:
            return jsonify({"message": "Preferences reset successfully."}), 200
        else:
            return jsonify({"message": "No preferences to reset or visitor not found."}), 404
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/delete-visitor-data', methods=['POST'])
def delete_visitor_data():
    try:
        data = request.get_json()
        visitor_id = data.get('visitorId')
        if not visitor_id:
            return jsonify({"error": "Visitor ID is required"}), 400
        result = visitor_collection.delete_one({"visitorId": visitor_id})
        if result.deleted_count > 0:
            return jsonify({"message": "Visitor data deleted successfully."}), 200
        else:
            return jsonify({"message": "Visitor not found."}), 404
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/random-destinations', methods=['GET'])
def get_random_destinations():
    spots = list(collection.find({}, {"_id": 0}))  # Exclude MongoDB ID
    random.shuffle(spots)  # Shuffle the list to return random destinations
    return jsonify(spots[:5])  # Return a limited number of random spots (e.g., 5)

# Define Flask API endpoint for recommendations
@app.route('/api/recommendations', methods=['POST'])
def recommendations():
    data = request.form
    image_file = request.files.get('image')
    text_query = data.get('query')

    if image_file:
        img = Image.open(image_file).convert('RGB')
        img = img.resize((224, 224))
        img_data = image.img_to_array(img)
        img_data = np.expand_dims(img_data, axis=0)
        img_data = preprocess_input(img_data)
        query_features = model.predict(img_data).flatten()
        query_type = 'image'
    elif text_query:
        query_features = extract_text_features(text_query)
        query_type = 'text'
    else:
        return jsonify({"error": "No query provided!"}), 400

    similar_docs = get_similar_documents(query_features, query_type)
    response = [{"name": doc[0]['name'], "similarity": doc[1], "photo": doc[0]['placePhoto']} for doc in similar_docs]
    return jsonify(response), 200

if __name__ == "__main__":
    app.run(debug=True, port=5000)