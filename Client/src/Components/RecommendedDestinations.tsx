import React, { useState, useEffect } from "react";
import TouristSpotCard from "./TouristSpotCard";
import "./RecommendedDestinations.css";

export default function RecommendedDestinations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/random-destinations"
        );
        const data = await response.json();
        setRecommendations(data);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) return <p>Loading destinations...</p>;

  return (
    <div className="recommendation-container">
      <h2>Recommended Destinations</h2>
      <div className="recommendation-list">
        {recommendations.length > 0 ? (
          recommendations.map((spot) => (
            <div className="recommendation-item" key={spot.placeId}>
              <TouristSpotCard
                name={spot.name}
                city={spot.city}
                photo={spot.placePhoto}
                description={spot.editorialSummary || spot.captions}
              />
            </div>
          ))
        ) : (
          <p>No recommendations available.</p>
        )}
      </div>
    </div>
  );
}
