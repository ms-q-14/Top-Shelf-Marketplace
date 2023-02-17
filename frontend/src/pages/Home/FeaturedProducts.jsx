import React from "react";
import "./FeaturedProducts.css";
import FeaturedCard from "./FeaturedCard";
import FeaturedData from "./FeaturedData";
import { Link } from "react-router-dom";
import { getExpressBaseURI } from "../../utils/constants";

function FeaturedProducts() {
  const [featuredData, setFeaturedData] = React.useState([]);

  React.useEffect(() => {
    async function fetchFeaturedData() {
      const response = await fetch(
        `${getExpressBaseURI()}/api/product?limit=100`,
        {
          method: "GET",
        }
      );
      const json = await response.json();
      console.log(json);

      if (!response.ok) {
        setFeaturedData([]);
        console.error(response.error);
      }

      if (response.ok) {
        setFeaturedData(json.products);
      }
    }
    fetchFeaturedData();
  }, []);

  //Replace FeaturedData with featuredData when backend is fixed to allow items to be pulled from DB
  const shuffledFeaturedData = featuredData.sort(() => Math.random() - 0.5);
  const featuredProductcards = shuffledFeaturedData.slice(0, 6).map((item) => {
    return (
      <Link
        className="link"
        to={`/product/${item._id}`}
        state={{ id: item._id }}
      >
        <FeaturedCard
          key={item._id}
          name={item.title}
          image={item.image}
          price={item.price}
        />
      </Link>
    );
  });

  return (
    <>
      <div className="featured">
        <a href="/auctions" className="featured__green">
          Featured Products
        </a>
        <span> Trending </span>
      </div>
      <section className="featured_list">{featuredProductcards}</section>
    </>
  );
}

export default FeaturedProducts;
