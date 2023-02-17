import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./index.css";
import { toast } from "react-toastify";
import ListingCard from "../Sell/ListingCard";
import { getExpressBaseURI } from "../../utils/constants";

function IndividualProduct() {
  const location = useLocation();
  const [data, setData] = useState([]);
  const [categoryName, setCategoryName] = React.useState(null);
  const productId = location.state?.id;

  const product = {
    _id: data._id,
    title: data.title,
    price: data.price,
    image: data.image,
  };
  console.log(product);
  const headers = { "Content-Type": "application/json" };

  const handleAddCart = async () => {
    try {
      const response = await fetch(`${getExpressBaseURI()}/api/cart/add`, {
        method: "POST",
        body: JSON.stringify(product),
        headers,
        credentials: "include",
      });
      const json = await response.json();
      console.log("added to cart");
      toast.success(
        ({ closeToast }) => (
          <div>
            <div>Product added to cart!</div>
            <ListingCard
              id={data._id}
              key={data._id}
              name={data.title}
              price={data.price}
              image={data.image}
            />
          </div>
        ),
        {
          autoClose: 3000,
          style: {
            width: "500px",
            height: "300px",
          },
        }
      );
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `${getExpressBaseURI()}/api/product/${productId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const json = await response.json();
        console.log(json.product);

        if (!response.ok) {
          setData([]);
          console.error(response.error);
        }

        if (response.ok) {
          setData(json.product);
        }
      } catch (err) {
        console.log(err);
        //add toast
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      <>
        <div className="individual__product__container">
          <div className="individual__product__content">
            <div className="individual__product__image__container">
              <img
                src={data.image}
                className="individual__product__image"
              ></img>
            </div>
          </div>

          <div className="individual__product__purchase__container">
            <h3 className="individual__product__title">{data.title}</h3>
            <Link
              className="link"
              to={`/product?category=${data.category}&page=1`}
            >
              <h3 className="individual__product__category">{data.category}</h3>
            </Link>
            <div className="individual__product__description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </div>
            <div className="individual__product__price">${data.price}</div>
            <div className="individual__product__button__container">
              <button
                onClick={handleAddCart}
                className="individual__product__cart__button"
              >
                Add to Cart
              </button>
              <Link className="link" to={"/sell"}>
                <button className="individual__product__sell__button">
                  Sell similar item
                </button>
              </Link>
            </div>
          </div>
        </div>
      </>
    </div>
  );
}

export default IndividualProduct;
