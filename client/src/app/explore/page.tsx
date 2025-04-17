import Carousel from "@/components/carousel";
import Services from "@/components/explore-services";

function Explore() {
  return (
    <main className="w-full flex flex-col items-center justify-center">
      <Carousel />
      <Services />
    </main>
  );
}

export default Explore;
