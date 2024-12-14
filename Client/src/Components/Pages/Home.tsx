import "../../App.css";
import HeroSection from "../HeroSection";
import Popup from "../Popup";

function Home() {
  return (
    <>
      <HeroSection
        title="TouristSpotter"
        subtitle="A Tourist Destination Recommender System"
        backgroundImage="/images/HeroSection.png"
      />
      <Popup />
    </>
  );
}

export default Home;
