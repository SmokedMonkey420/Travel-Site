import HeroSection from "../HeroSection";
import UserPreferences from "../UserPreferences";
import RecommendedDestinations from "../RecommendedDestinations";
import Map from "../MindanaoMap";

function Home() {
  return (
    <>
      <HeroSection
        backgroundImage="/images/HeroSection.png"
        showButton={false}
        showSearchBar={true}
      >
        <UserPreferences /> <RecommendedDestinations /> <Map />
      </HeroSection>
    </>
  );
}

export default Home;
