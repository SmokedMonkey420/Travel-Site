import React from "react";
import "./MatchCard.css";
import SuggestionCardItem from "./SuggestionCardItem";

function MatchCard() {
  return (
    <div className="cards">
      <div className="match__card__container">
        <div className="match__card__wrapper">
          <ul className="match__card__items"></ul>
        </div>
      </div>
      <div className="suggestion__card__container">
        <div className="suggestion__card__wrapper">
          <ul className="suggestion__card__items">
            <SuggestionCardItem
              src="/images/image2.jpg"
              name="Baguio City"
              description="Lorem ipsum"
              path="/baguio-city"
            />
            <SuggestionCardItem
              src="/images/image2.jpg"
              name="Baguio City"
              description="Lorem ipsum"
              path="/baguio-city"
            />
            <SuggestionCardItem
              src="/images/image2.jpg"
              name="Baguio City"
              description="Lorem ipsum"
              path="/baguio-city"
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MatchCard;
