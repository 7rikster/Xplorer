import Carousel from "@/components/carousel";
import Services from "@/components/explore-services";
import TopDestinations from "@/components/top-destinations";

function Explore() {
  return (
    <main className="w-full flex flex-col items-center justify-center">
      <Carousel />
      <Services />
      <TopDestinations />
    </main>
  );
}

export default Explore;
