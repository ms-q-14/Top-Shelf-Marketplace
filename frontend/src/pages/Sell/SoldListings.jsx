import React from "react";
import "./SoldListings.css";
import ListingCard from "../Sell/ListingCard";

function SoldListings(data) {
  return (
    <div className="active__listings__container">
      {data.data
        .filter((item) => item.sold)
        .map((item) => {
          return (
            <ListingCard
              key={item._id}
              name={item.title}
              price={item.price}
              image={item.image}
              category={item.category}
              sold={item.sold}
            />
          );
        })}
    </div>
  );
}

export default SoldListings;
