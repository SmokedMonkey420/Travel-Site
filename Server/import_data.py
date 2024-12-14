import pandas as pd
from pymongo import MongoClient

# Connect to MongoDB Atlas
client = MongoClient("mongodb+srv://MonkeyBiscuit:HwBfFWnU8g7YYPvJfevf@touristspotter.dhnp9.mongodb.net/")
db = client['tourist_app_db']
tourist_spots_collection = db['tourist_spots']

# Read CSV
csv_file = "combined_with_captions.csv"
data = pd.read_csv(csv_file)

# Inspect data to ensure fields map correctly
print(data.head())  # Debugging step

# Map only the necessary fields
for index, row in data.iterrows():
    tourist_spots_collection.insert_one({
        "placeId": row["Place ID"],
        "name": row["Name"],
        "city": row["City"],
        "editorialSummary": row["Editorial Summary"],
        "captions": row["Caption"],
        "placePhoto": row["Place Photo URL"],
        "rating": row["Rating"],
    })

print("Data inserted into MongoDB successfully")
