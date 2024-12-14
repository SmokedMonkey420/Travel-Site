import React, { Children } from "react";
import { Button } from "./Button";
import "./HeroSection.css";

interface HeroSectionProps {
  title?: string; // Make title optional
  subtitle?: string; // Make subtitle optional
  backgroundImage: string;
  showButton?: boolean;
  buttonText?: string;
  buttonLink?: string;
  children?: React.ReactNode;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  backgroundImage,
  showButton = true,
  buttonText = "GET STARTED",
  buttonLink = "/get-started",
  children,
}) => {
  return (
    <div
      className="hero-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Conditionally render title and subtitle */}
      {title && <h1>{title}</h1>}
      {subtitle && <p>{subtitle}</p>}

      {/* Optional 'GET STARTED' button */}
      {showButton && (
        <div className="hero-btns">
          <Button
            className="btns"
            buttonStyle="btn--outline"
            buttonSize="btn--large"
            to={buttonLink}
          >
            {buttonText}
          </Button>
        </div>
      )}
      <div className="main-ui">{children}</div>
    </div>
  );
};

export default HeroSection;
