import Carousel from "@/components/carousel";
import Services from "@/components/explore-services";
import TopDestinations from "@/components/top-destinations";
import HandpickedTrips from "@/components/handpicked-trips";
import GenerateYourOwnItinerary from "@/components/generateYourOwnItinerary";
import MoodSuggestionCard from "@/components/moodSuggestion";

function Explore() {
  return (
    <main className="w-full flex flex-col items-center justify-center">
      <Carousel />
      <TopDestinations />
      <Services />
      <HandpickedTrips />
      <GenerateYourOwnItinerary/>
    </main>
  );
}

export default Explore;
