import React from "react";
import "./item.css";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { toast } from "react-toastify";
import { getExpressBaseURI } from "../../utils/constants";

const Item = (props) => {
  const headers = { "Content-Type": "application/json" };

  const handleRemoveCart = async () => {
    try {
      const response = await fetch(`${getExpressBaseURI()}/api/cart/remove`, {
        method: "POST",
        body: JSON.stringify({ _id: props.id }),
        headers,
        credentials: "include",
      });
      const json = await response.json();
      console.log("added to cart");
      toast("Product removed from cart!");
      props.setCartData(json.cart);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      <div className="cart__item__container">
        <div className="cart__image__content">
          <img
            src={props.image}
            alt="cart__image"
            className="cart__image"
          ></img>
          <div className="cart__item__content">
            <div className="cart__item__name">{props.name}</div>
            <div className="cart__item__category">{props.category}</div>
            <div className="cart__item__price">${props.price}</div>
          </div>
        </div>
        <i
          className="bi bi-bag-x remove__item__icon"
          id="remove_icon"
          onClick={handleRemoveCart}
        />
      </div>
    </>
  );
};

export default Item;
