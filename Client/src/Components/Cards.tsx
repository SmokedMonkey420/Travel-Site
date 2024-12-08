import React from "react";
import "./Cards.css";
import CardItem from "./CardItem";
function Cards() {
  return (
    <div className="cards">
      <h1>Popular Destinations</h1>
      <p>
        These destinations are the most recommended go-to within the country.
      </p>
      <p>Whether hearing from a friend, or reading about it online, these</p>
      <p>definitely will ring a bell!</p>
      <div className="cards__container">
        <div className="cards__wrapper">
          <ul className="cards__items">
            <CardItem
              src="images/image2.jpg"
              text="Explore the baguio with various tourist spots and adventures waiting"
              path="/services"
            />
            <CardItem
              src="images/img-2.jpg"
              text="Travel through the Islands of Bali in a Private Cruise"
              path="/services"
            />
          </ul>
          <ul className="cards__items">
            <CardItem
              src="images/img-3.jpg"
              text="Set Sail in the Atlantic Ocean visiting Uncharted Waters"
              path="/services"
            />
            <CardItem
              src="images/img-4.jpg"
              text="Experience Football on Top of the Himilayan Mountains"
              path="/products"
            />
            <CardItem
              src="images/img-8.jpg"
              text="Ride through the Sahara Desert on a guided camel tour"
              path="/sign-up"
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;
