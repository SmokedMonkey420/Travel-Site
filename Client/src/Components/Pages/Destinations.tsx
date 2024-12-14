import { useEffect, useState } from "react";
import TouristSpotCard from "../TouristSpotCard";
import "./Destinations.css";

const DestinationsPage = () => {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/destinations"); // Replace with your API endpoint
        const data = await response.json();
        setSpots(data);
      } catch (error) {
        console.error("Error fetching tourist spots:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpots();
  }, []);

  if (loading) return <p>Loading destinations...</p>;

  return (
    <div className="destinations-page">
      <h1>Explore Destinations</h1>
      <div className="destinations-grid">
        {spots.map((spot) => (
          <TouristSpotCard
            key={spot.placeId}
            name={spot.name}
            city={spot.city}
            photo={spot.placePhoto}
            description={spot.editorialSummary || spot.captions}
          />
        ))}
      </div>
    </div>
  );
};

export default DestinationsPage;
