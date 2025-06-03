import Carousel from "@/components/carousel";
import Services from "@/components/explore-services";
import TopDestinations from "@/components/top-destinations";
import HandpickedTrips from "@/components/handpicked-trips";

function Explore() {
  return (
    <main className="w-full flex flex-col items-center justify-center">
      <Carousel />
      <TopDestinations />
      <Services />
      <HandpickedTrips />
    </main>
  );
}

export default Explore;
