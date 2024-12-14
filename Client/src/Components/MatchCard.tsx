import { useState, useEffect } from "react";
import "./MatchCard.css";
import RecommendationCard from "./RecommendationCard"; // Import the new RecommendationCard component
import { Button } from "./Button";

function MatchCard() {
  const [submittedData, setSubmittedData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    // Retrieve submitted data from localStorage
    const data = localStorage.getItem("submittedData");
    if (data) {
      setSubmittedData(JSON.parse(data));
    }

    // Retrieve recommendations from localStorage or state (or API call)
    const recs = localStorage.getItem("recommendations");
    if (recs) {
      setRecommendations(JSON.parse(recs));
    }
  }, []);

  return (
    <div className="result__cards">
      <div className="match__card__container">
        <div className="match__card__wrapper">
          <ul className="match__card__items">
            <MatchCardItem
              text={submittedData ? submittedData.text : ""}
              image={submittedData ? submittedData.image : ""}
            />
          </ul>
        </div>
      </div>

      <h1>Here are our other recommended spots!</h1>
      <div className="suggestion__card__container">
        <div className="suggestion__card__wrapper">
          <ul className="suggestion__card__items">
            {/* Dynamically render the recommendations */}
            {recommendations.length > 0 ? (
              recommendations.map((rec, index) => (
                <RecommendationCard
                  key={index}
                  src={rec.image || "/images/default.jpg"} // Use a default image if none is available
                  name={rec.name}
                  description={rec.description}
                  path={`/place/${rec.placeId}`} // Dynamically generate the link based on the Place ID
                />
              ))
            ) : (
              <p>No recommendations available.</p>
            )}
          </ul>
          <div className="matchcard-btn">
            <Button
              className="btns--viewmore"
              buttonStyle="btn--outline"
              buttonSize="btn--large"
              to="/more-spots"
            >
              View More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MatchCard;
