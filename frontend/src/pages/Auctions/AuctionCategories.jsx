import React from "react";
import "./AuctionCategories.css";

function AuctionCategories(props) {
  return (
    <div className="auction__category__container">
      <img className="auction__category__image" src={props.image} />
      <div className="auction__category__title">{props.category}</div>
    </div>
  );
}

export default AuctionCategories;
