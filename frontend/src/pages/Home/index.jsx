import React from "react";
import CarouselMulti from "./Carousel";
import Auctions from "./Auctions";
import FeaturedProducts from "./FeaturedProducts";
function Home() {
  return (
    <div>
      <CarouselMulti />
      <Auctions />
      <FeaturedProducts />
    </div>
  );
}

export default Home;
