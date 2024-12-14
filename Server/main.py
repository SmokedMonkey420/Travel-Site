import numpy as np
import tensorflow as tf
import torch
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from tensorflow.keras.models import load_model
from transformers import BertTokenizer, BertModel
from sklearn.metrics.pairwise import cosine_similarity
from PIL import Image

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

client = MongoClient("mongodb+srv://MonkeyBiscuit:HwBfFWnU8g7YYPvJfevf@touristspotter.dhnp9.mongodb.net/")
db = client['tourist_app_db']
collection = db['tourist_spots']
visitor_collection = db['visitor_data']

# Load ResNet model (example using Keras)
resnet_model = load_model(r'C:\Users\Cian\Documents\Coding\Travel-Site\Server\models\resnet_tourist_spots.h5')  # Your ResNet model

# Load BERT model and tokenizer
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
bert_model = BertModel.from_pretrained('bert-base-uncased')

def get_bert_embedding(text: str):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512)
    outputs = bert_model(**inputs)
    return outputs.last_hidden_state.mean(dim=1).detach().numpy()

def get_resnet_embedding(image):
    # Preprocess image for ResNet
    image = tf.image.resize(image, (224, 224))
    image = tf.expand_dims(image, axis=0)  # Add batch dimension
    image = tf.keras.applications.resnet50.preprocess_input(image)
    
    # Extract features using ResNet model
    features = resnet_model.predict(image)
    return features

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        # Check if an image is provided
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided."}), 400
        
        # Get the image from the request
        file = request.files['image']
        
        # Read the image file as a byte stream
        img = Image.open(file.stream)
        
        # Preprocess the image to the format your model expects (for ResNet)
        img = img.resize((224, 224))  # Resize the image to the expected input size
        img_array = np.array(img)  # Convert the image to a numpy array
        img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
        img_array = img_array / 255.0  # Normalize the image (if required by your model)

        # Make a prediction using the already loaded ResNet model
        predictions = resnet_model.predict(img_array)
        
        # Process predictions (you might need to map the output to the corresponding spots)
        predicted_class = np.argmax(predictions, axis=1)
        
        # Return the result as a response
        return jsonify({"predictions": predicted_class.tolist()})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/destinations', methods=['GET'])
def get_destinations():
    spots = list(collection.find({}, {"_id": 0}))  # Exclude MongoDB ID
    return jsonify(spots)

@app.route('/store-visitor-data', methods=["POST"])
def store_visitor_data():
    """
    Store visitor ID and selected categories into MongoDB
    """
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
            # Convert ObjectId to string for JSON serialization
            visitor["_id"] = str(visitor["_id"])  # Convert _id field to string
            return jsonify(visitor), 200
        return jsonify({"message": "Visitor not found"}), 404
    except Exception as e:
        print(f"Error fetching visitor data: {e}")
        return jsonify({"error": str(e)}), 500
    
@app.route('/get-visitor-preference', methods=['GET'])
def get_visitor_preference():
    try:
        # Get visitor_id and selectedCategories from query parameters
        visitor_id = request.args.get('visitor_id')  # Getting visitor_id from query params
        if not visitor_id:
            return jsonify({"error": "Visitor ID is required"}), 400

        # Fetch the visitor document from MongoDB
        visitor = visitor_collection.find_one({"visitorId": visitor_id})
        
        if visitor:
            visitor["_id"] = str(visitor["_id"])  # Convert ObjectId to string
            
            # Assuming 'selectedCategories' is a field in the document
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
        
        # Reset the visitor's selectedCategories to an empty list
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
        
        # Delete the visitor's data
        result = visitor_collection.delete_one({"visitorId": visitor_id})
        
        if result.deleted_count > 0:
            return jsonify({"message": "Visitor data deleted successfully."}), 200
        else:
            return jsonify({"message": "Visitor not found."}), 404
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port="5000")