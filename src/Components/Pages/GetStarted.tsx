import React from "react";
import HeroSection from "../HeroSection";

function GetStarted() {
  return (
    <>
      <HeroSection
        title="Where to?"
        subtitle="Let us know where you want to go, and we’ll recommend alternatives"
        backgroundImage="/images/HeroSection2.png"
        showButton={false}
        showSearchBar={true}
      />
    </>
  );
}

export default GetStarted;
