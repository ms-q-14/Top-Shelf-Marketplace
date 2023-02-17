import React, { useEffect } from "react";
import PaymentForm from "./StripeForm";
import "./index.css";
import Item from "./Item";
import addBasket from "../../../public/images/add_basket.png";
import { getExpressBaseURI } from "../../utils/constants";

function Cart() {
  const [cartData, setCartData] = React.useState([]);
  const [cartProducts, setCartProducts] = React.useState();
  const [total, setTotal] = React.useState(0);

  React.useEffect(() => {
    async function fetchCartData() {
      const response = await fetch(`${getExpressBaseURI()}/api/cart`, {
        method: "GET",
        credentials: "include",
      });
      const json = await response.json();
      console.log(json);

      if (!response.ok) {
        setCartData([]);
        console.error(response.error);
      }

      if (response.ok) {
        setCartData(json.cart);
        console.log(cartData);
      }
    }
    fetchCartData();
  }, []);

  useEffect(() => {
    var totalCart = cartData?.reduce((acc, product) => {
      return acc + product.price;
    }, 0);
    setTotal(totalCart);
    if (cartData.length === 0) {
      const cartProd = (
        <div className="cart__empty">
          <img
            src={addBasket}
            alt="add_basket"
            className="cart__empty__image"
          />
          <h1 className="cart__empty__text">Your cart is empty</h1>
        </div>
      );
      setCartProducts(cartProd);
    } else {
      const cartProd = cartData?.map((product) => {
        return (
          <Item
            id={product._id}
            key={product._id}
            name={product.title}
            price={product.price}
            image={product.image}
            category={product.category}
            setCartData={setCartData}
          />
        );
      });
      setCartProducts(cartProd);
    }
  }, [cartData]);

  return (
    <div className="cart">
      <h1 className="cart__title">Cart</h1>
      <div className="cart__container">
        <div className="cart__items">{cartProducts} </div>
        <div className="cart__payment__form">
          <PaymentForm total={total} />
        </div>
      </div>
    </div>
  );
}

export default Cart;
