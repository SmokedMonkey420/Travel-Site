// ParentComponent.tsx
import React from "react";
import HeroSection from "./HeroSection";
import MatchCardItem from "./MatchCardItem";

function ParentComponent() {
  const handleSearchData = (searchText: string, imageFile: string) => {
    // Handle the data here if needed
    console.log("Received search text:", searchText);
    console.log("Received image file:", imageFile);
  };

  return (
    <div>
      <HeroSection onSearchData={handleSearchData} />
      <MatchCardItem />
    </div>
  );
}

export default ParentComponent;
