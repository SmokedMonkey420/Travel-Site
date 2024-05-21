import React from "react";
import "./MatchCard.css";
import CardItem from "./CardItem";

function MatchCard() {
  return (
    <div className="cards">
      <div className="match__card__container">
        <div className="match__card__wrapper">
          <ul className="match__card__items"></ul>
          <ul className="match__card__items"></ul>
        </div>
      </div>
      <div className="suggestion__card__container">
        <div className="suggestion__card__wrapper">
          <ul className="suggestion__card__items"></ul>
        </div>
      </div>
    </div>
  );
}

export default MatchCard;
