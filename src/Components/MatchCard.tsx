import React, { useState, useEffect } from "react";
import "./MatchCard.css";
import MatchCardItem from "./MatchCardItem"; // Import MatchCardItem instead of MatchCard
import SuggestionCardItem from "./SuggestionCardItem";
import { Button } from "./Button";

function MatchCard() {
  const [submittedData, setSubmittedData] = useState(null);
  useEffect(() => {
    // Retrieve submitted data from localStorage
    const data = localStorage.getItem("submittedData");
    if (data) {
      setSubmittedData(JSON.parse(data));
    }
  }, []);

  return (
    <div className="result__cards">
      <div className="match__card__container">
        <div className="match__card__wrapper">
          <ul className="match__card__items">
            <MatchCardItem
              text={submittedData ? submittedData.text : ""}
              image={submittedData ? submittedData.imageURL : ""}
            />
          </ul>
        </div>
      </div>
      <h1>Here are our other recommended spots!</h1>
      <div className="suggestion__card__container">
        <div className="suggestion__card__wrapper">
          <ul className="suggestion__card__items">
            <SuggestionCardItem
              src="/images/image2.jpg"
              name="Baguio City"
              description="Baguio, on the Philippines’ Luzon island, is a mountain town of universities and resorts. Called the “City of Pines,” it’s particularly popular in summer due to unusually cooler weather."
              path="/baguio-city"
            />
            <SuggestionCardItem
              src="/images/image2.jpg"
              name="Baguio City"
              description="Baguio, on the Philippines’ Luzon island, is a mountain town of universities and resorts. Called the “City of Pines,” it’s particularly popular in summer due to unusually cooler weather."
              path="/baguio-city"
            />
            <SuggestionCardItem
              src="/images/image2.jpg"
              name="Baguio City"
              description="Baguio, on the Philippines’ Luzon island, is a mountain town of universities and resorts. Called the “City of Pines,” it’s particularly popular in summer due to unusually cooler weather."
              path="/baguio-city"
            />
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
