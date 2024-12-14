import React, { useState, useEffect } from "react";
import TouristSpotCard from "./TouristSpotCard";
import "./RecommendedDestinations.css";

// Placeholder data representing collaborative filtering recommendations
const recommendedDestinations = [
  {
    id: 1,
    name: "Mount Apo",
    city: "Davao",
    placePhoto: "/images/mount-apo.jpg",
    description:
      "A majestic mountain known for its hiking trails and wildlife.",
  },
  {
    id: 2,
    name: "Samal Island",
    city: "Davao",
    placePhoto: "/images/samal-island.jpg",
    description: "Famous for its beautiful beaches and resorts.",
  },
  {
    id: 3,
    name: "Lake Sebu",
    city: "South Cotabato",
    placePhoto: "/images/lake-sebu.jpg",
    description: "A serene destination with stunning lakes and waterfalls.",
  },
  {
    id: 4,
    name: "Davao City",
    city: "Davao",
    placePhoto: "/images/davao-city.jpg",
    description:
      "A vibrant city known for its diverse culture and natural beauty.",
  },
  {
    id: 5,
    name: "Siargao Island",
    city: "Surigao del Norte",
    placePhoto: "/images/siargao.jpg",
    description: "A tropical island popular for surfing and beaches.",
  },
];

export default function RecommendedDestinations() {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/recommendations"
        ); // Replace with your actual recommendations endpoint
        const data = await response.json();
        setRecommendations(data);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchRecommendations();
  }, []); // Empty dependency array ensures the request is made only once on component mount

  return (
    <div className="recommendation-container">
      <h2>Recommended Destinations</h2>
      <div className="recommendation-list">
        {recommendations.length > 0 ? (
          recommendations.map((spot) => (
            <TouristSpotCard
              key={spot.placeId}
              name={spot.name}
              city={spot.city}
              photo={spot.placePhoto}
              description={spot.description || spot.editorialSummary}
            />
          ))
        ) : (
          <p>No recommendations available.</p>
        )}
      </div>
    </div>
  );
}
