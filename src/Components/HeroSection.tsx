import React from "react";
import "../App.css";
import { Button } from "./Button";
import "./HeroSection.css";

function HeroSection() {
  return (
    <div className="hero-container">
      <h1>TouristSpotter</h1>
      <p>A Tourist Destination Recommender System</p>
      <div className="hero-btns">
        <Button
          className="btns"
          buttonStyle="btn--outline"
          buttonSize="btn--large"
          to="/get-started"
        >
          GET STARTED
        </Button>
      </div>
    </div>
  );
}

export default HeroSection;
