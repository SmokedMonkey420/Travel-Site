import React from "react";
import CardItem from "./CardItem";
import "./Cards.css";

function Cards() {
  return (
    <div className="Cards">
      <h1>Popular Destinations</h1>
      <p>
        These destinations are the most recommended go-to within the country.
        Whether hearing from a friend, or reading about it online, these
        definitely will ring a bell!
      </p>
      <div className="cards__container">
        <div className="cards__wrapper">
          <ul className="cards__items">
            <CardItem />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;
