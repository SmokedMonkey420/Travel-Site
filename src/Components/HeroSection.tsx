import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { Button } from "./Button";
import "./HeroSection.css";
import LoadingBar from "./LoadingBar";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  showButton?: boolean;
  showSearchBar?: boolean;
  showLoadingBar?: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  backgroundImage,
  showButton = true,
  showSearchBar = false,
  showLoadingBar = false,
}) => {
  const navigate = useNavigate();
  const handleSearchSubmit = () => {
    navigate("/result");
  };

  return (
    <div
      className="hero-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <h1>{title}</h1>
      <p>{subtitle}</p>
      {showButton && (
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
      )}
      {showSearchBar && !showLoadingBar && (
        <div className="hero-search">
          <label htmlFor="file-input">
            <i className="fa-solid fa-paperclip" />
          </label>
          <input
            type="text"
            placeholder="Upload an image or describe a place..."
          />
          <label htmlFor="search-input" onClick={handleSearchSubmit}>
            <i className="fa-solid fa-magnifying-glass" />
          </label>
          <input type="file" id="file-input" style={{ display: "none" }} />
        </div>
      )}
      {showLoadingBar && <LoadingBar />}
    </div>
  );
};

export default HeroSection;
