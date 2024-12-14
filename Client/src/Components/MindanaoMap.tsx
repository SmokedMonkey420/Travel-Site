import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, Polygon } from "@react-google-maps/api";
import "./MindanaoMap.css";

const containerStyle = {
  width: "100%",
  height: "100%", // Use full height of the container div
};

const center = {
  lat: 7.1907, // Coordinates for Mindanao (central point)
  lng: 125.4553,
};

const mindanaoCoordinates = [
  { lat: 6.5, lng: 124.5 }, // Bottom-left
  { lat: 6.5, lng: 126.5 }, // Bottom-right
  { lat: 7.5, lng: 126.5 }, // Top-right
  { lat: 7.5, lng: 124.5 }, // Top-left
];

const RecommendedDestinations: React.FC = () => {
  const [mapLoaded, setMapLoaded] = useState(false);

  const handleLoad = () => {
    setMapLoaded(true);
  };

  return (
    <div className="map-container">
      <LoadScript
        googleMapsApiKey="AIzaSyD58dlQEjHo84czShQnJeu61kVmmOPLUG0"
        onLoad={handleLoad}
      >
        {mapLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={6}
          >
            <Marker position={center} />
            <Polygon
              paths={mindanaoCoordinates}
              options={{
                fillColor: "red",
                fillOpacity: 0.1,
                strokeColor: "red",
                strokeOpacity: 1,
                strokeWeight: 2,
              }}
            />
          </GoogleMap>
        ) : (
          <p>Loading map...</p>
        )}
      </LoadScript>
    </div>
  );
};

export default RecommendedDestinations;
