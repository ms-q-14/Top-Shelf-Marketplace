import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./Carousel.css";

function CarouselMulti() {
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 4000, min: 0 },
      items: 1,
    },
  };
  return (
    <div className="carousel">
      {" "}
      <Carousel
        slidesToShow={1}
        swipeable={false}
        draggable={false}
        showDots={true}
        responsive={responsive}
        ssr={true} // means to render carousel on server-side.
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={3000}
        keyBoardControl={true}
        customTransition="all 1 ease-in-out"
        transitionDuration={1000}
        containerClass="carousel-container"
        removeArrowOnDeviceType={["tablet", "mobile"]}
        dotListClass="custom-dot-list-style"
      >
        <div id="carouselImg">
          <img src="https://sm.ign.com/t/ign_ap/feature/t/the-25-bes/the-25-best-pc-games-to-play-right-now_wn7p.1280.jpg" />
        </div>
        <div id="carouselImg">
          <img src="https://cdn.ttgtmedia.com/visuals/ComputerWeekly/Hero%20Images/Coca-Cola-8oz-glass-bottles-PR.png" />
        </div>
        <div id="carouselImg">
          <img src="https://images-ext-2.discordapp.net/external/lQ0yo0Rzuat9oIQa83JCXX9p5MQolzwrU9PzmIechz8/https/img.lovepik.com/background/20211021/large/lovepik-coloured-star-banners-background-image_400142473.jpg" />
        </div>
        <div id="carouselImg">
          <img src="https://images-ext-2.discordapp.net/external/dqG4YKwb5Zu5X6yES8PJR2ISz00VI5Q5_Nxvbku13RE/https/pbs.twimg.com/media/DTgNOyTVoAAMhwo.jpg" />
        </div>
      </Carousel>
    </div>
  );
}

export default CarouselMulti;
