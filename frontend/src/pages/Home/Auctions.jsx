import React from "react";
import "./Auctions.css";
import AuctionCard from "./AuctionCard";
import auctionData from "./auctionData";

function Auctions() {
  const auctionCards = auctionData.map((item) => {
    return (
      <AuctionCard
        className="auction__list__card"
        key={item.id}
        coverImg={item.coverImg}
        hostImg={item.hostImg}
        title={item.title}
        host={item.host}
        category={item.category}
      />
    );
  });

  return (
    <>
      <div className="liveAuctions">
        <a href="/auctions" className="liveAuctions__green">
          Live Auctions
        </a>
        <span> we think you'll like</span>
      </div>
      <section className="auction_list">{auctionCards}</section>
    </>
  );
}

export default Auctions;
