import React from "react";
import "./AuctionCard.css";

function AuctionCard(props) {
  return (
    <>
      <div className={`auction_card ${props.className}`}>
        <div className="auction_preview">
          <img className="auction_card__image" src={props.coverImg} />
        </div>
        <div className="auction_host_data">
          <div className="host_img">
            <img src={props.hostImg} />
          </div>
          <div className="auction_desc">
            <p className="auction_title">{props.title}</p>
            <p className="host">{props.host}</p>
            <p className="category">{props.category}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default AuctionCard;
