import React from "react";
import "../../App.css";
import HeroSection from "../HeroSection";
import Cards from "../Cards";
import Footer from "../Footer";

function Home() {
  return (
    <>
      <HeroSection
        title="TouristSpotter"
        subtitle="A Tourist Destination Recommender System"
        backgroundImage="/images/HeroSection1.png"
      />
      <Cards />
      <Footer />
    </>
  );
}

export default Home;
