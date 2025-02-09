import React from "react";
import { useLocation } from "react-router-dom";

const Result: React.FC = () => {
  const location = useLocation();
  const { recommendations } = location.state || { recommendations: [] };

  return (
    <div className="result-container">
      <h2>Recommended Tourist Spots</h2>
      <ul className="results__list">
        {recommendations.length > 0 ? (
          recommendations.map((item, index) => (
            <MatchCardItem
              key={index}
              text={item.name}
              image={item.image_url || "https://via.placeholder.com/150"}
            />
          ))
        ) : (
          <p>No recommendations available</p>
        )}
      </ul>
    </div>
  );
};

export default Result;
