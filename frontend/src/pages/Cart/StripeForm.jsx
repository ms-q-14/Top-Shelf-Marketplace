import React, { useState, useEffect } from "react";
import {
  CardElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(
  "pk_test_51MMimhIiPc5x4PoKngHfdFocgh2ENIT9rQlbvNHMWvsLx3zjFNlWcZO8GdKOhLDkuU7OegEZQOOrHpPPgHKcIBhA00VDNQwJ9e"
);
import "./StripeForm.css";
import shopping_cart from "../../../public/images/shopping_cart.png";
import { getExpressBaseURI } from "../../utils/constants";

const CARD_OPTIONS = {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "#c4f0ff",
      color: "#fff",
      fontWeight: 900,

      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": { color: "#fce883" },
      "::placeholder": { color: "#87bbfd" },
    },
    invalid: {
      iconColor: "#ffc7ee",
      color: "#ffc7ee",
    },
  },
};

function CheckoutForm({ total }) {
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState("");
  const stripe = useStripe();
  const elements = useElements();

  // const handleChange = async (event) => {
  //   // Listen for changes in the CardElement
  //   // and display any errors as the customer types their card details
  //   setDisabled(event.empty);
  //   setError(event.error ? event.error.message : "");
  // };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setProcessing(true);

    // const payload = await stripe.confirmCardPayment(clientSecret, {
    //   payment_method: {
    //     card: elements.getElement(CardElement),
    //   },
    // });

    // if (payload.error) {
    //   setError(`Payment failed ${payload.error.message}`);
    //   setProcessing(false);
    // } else {
    //   setError(null);
    //   setProcessing(false);
    //   setSucceeded(true);
    // }
    const { token, error } = await stripe.createToken(
      elements.getElement(CardElement)
    );
    const headers = { "Content-Type": "application/json" };
    const response = await fetch(`${getExpressBaseURI()}/api/cart/checkout`, {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify({ token }),
    });
    console.log(token);
  };

  return (
    <form className="payment__form__container" onSubmit={handleSubmit}>
      <span className="payment__form__total">{`Total : $${total}`}</span>
      <img src={shopping_cart} alt="shopping_cart" className="shopping_cart" />

      {/* <div className="input__inline">
        <input
          type="text"
          placeholder="Address"
          className="checkout__address"
        />
        <input type="text" placeholder="Name" className="checkout__address" />
      </div> */}

      <CardElement id="card-element" options={CARD_OPTIONS} />
      <button type="submit" id="submit">
        Pay now
      </button>
    </form>
  );
}

const PaymentForm = ({ total }) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm total={total} />
  </Elements>
);

export default PaymentForm;
