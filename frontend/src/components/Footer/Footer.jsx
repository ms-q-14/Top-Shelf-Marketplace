import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <div className="footer">
      <div className="top">
        <div className="item">
          <h1>Categories</h1>
          <span className="linkItem">Trading Card Games</span>
          <span className="linkItem">Comics</span>
          <span className="linkItem">Sports</span>
          <span className="linkItem">Figurines</span>
        </div>
        <div className="item">
          <h1>Links</h1>
          <span className="linkItem">
            <Link className="link" to="/about">
              About
            </Link>
          </span>
          <span className="linkItem">
            <Link className="link" to="/sell">
              Sell
            </Link>
          </span>
          <span className="linkItem">
            <Link className="link" to="/auctions">
              Auctions
            </Link>
          </span>
        </div>
        <div className="item">
          <h1>About</h1>
          <span>
            Welcome to our mock online store! Please note that all items listed
            for sale on this site are for display purposes only and are not
            actually available for purchase. This store is intended as a
            demonstration of our design and software engineering capabilities,
            and is not a real retail outlet.
          </span>
        </div>
        <div className="item">
          <h1>Contact</h1>
          <span>Idk what to put here make sameh use his brain</span>
        </div>
      </div>
      <div className="bottom">
        <div className="left">
          <span className="logo">
            <Link className="link" to="/">
              {" "}
              <img className="logo" src="/images/logo.png" />
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Footer;
