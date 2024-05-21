import React, { useState } from "react";
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
  onSearch?: (query: string) => void;
  onFileUpload?: (file: File) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  backgroundImage,
  showButton = true,
  showSearchBar = false,
  showLoadingBar = false,
  onSearch,
  onFileUpload,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
    navigate("/result", { state: { searchQuery, file } });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      if (onFileUpload) {
        onFileUpload(selectedFile);
      }
    }
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
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <label htmlFor="search-input">
            <i
              className="fa-solid fa-magnifying-glass"
              onClick={handleSearchSubmit}
            />
          </label>
          <input
            type="file"
            id="file-input"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
      )}
      {showLoadingBar && <LoadingBar />}
    </div>
  );
};

export default HeroSection;
