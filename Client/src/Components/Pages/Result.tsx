import HeroSection from "../HeroSection";
import MatchCard from "../MatchCard";

function Result() {
  return (
    <>
      <HeroSection
        title="Where to?"
        subtitle="Let us know where you want to go, and we’ll recommend alternatives"
        backgroundImage="/images/HeroSection2.png"
        showButton={false}
        showSearchBar={false}
        showLoadingBar={true}
      />
      <MatchCard />
    </>
  );
}

export default Result;
