import random
import numpy as np
import tensorflow as tf
import torch
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from tensorflow.keras.models import load_model # type: ignore # Type: ignore

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

client = MongoClient("mongodb+srv://MonkeyBiscuit:HwBfFWnU8g7YYPvJfevf@touristspotter.dhnp9.mongodb.net/")
db = client['tourist_app_db']
collection = db['tourist_spots']
visitor_collection = db['visitor_data']

@app.route('/api/destinations-gallery', methods=['GET'])
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
    
@app.route('/api/random-destinations', methods=['GET'])
def get_random_destinations():
    # Fetch all destinations
    spots = list(collection.find({}, {"_id": 0}))  # Exclude MongoDB ID
    random.shuffle(spots)  # Shuffle the list to return random destinations
    # Return a limited number of random spots (e.g., 5)
    return jsonify(spots[:5])

if __name__ == "__main__":
    app.run(debug=True, port="5000")