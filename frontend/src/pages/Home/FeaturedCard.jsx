import React from "react";
import "./FeaturedCard.css";
function FeaturedCard(props) {
  return (
    <>
      <div className="featuredCard">
        <div className="featuredImage-wrapper">
          <img
            src={props.image}
            alt="featured-img"
            className="featuredImage"
          ></img>
        </div>

        <div className="featuredCard__content">
          <h3 className="featuredName">{props.name}</h3>
          <div className="displayStack__1">
            <div className="featuredPrice">${props.price}</div>
          </div>
        </div>
      </div>
    </>
  );
}
export default FeaturedCard;
