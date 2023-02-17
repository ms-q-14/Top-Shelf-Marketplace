import React from "react";
import "./ActiveListings.css";
import ListingCard from "../Sell/ListingCard";
import { Link } from "react-router-dom";

const ActiveListings = (data) => {
  return (
    <div className="active__listings__container">
      {data.data
        .filter((item) => !item.sold)
        .map((item) => {
          return (
            <Link
              className="link"
              to={`/product/${item._id}`}
              state={{ id: item._id }}
            >
              <ListingCard
                id={item._id}
                key={item._id}
                name={item.title}
                price={item.price}
                image={item.image}
                category={item.category}
                createdAt={item.createdAt}
              />
            </Link>
          );
        })}
    </div>
  );
};

export default ActiveListings;
