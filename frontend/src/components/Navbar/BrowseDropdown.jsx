import React from "react";
import "./BrowseDropdown.css";
import { Link } from "react-router-dom";
function BrowseDropdown() {
  return (
    <div className="browse__dropdown__container">
      <div className="browse__dropdown">
        <div className="Trading Cards">
          <Link className="link" to="/product?category=TCG&page=1">
            Trading Cards
          </Link>
        </div>
        <div className="Comic Books">
          <Link className="link" to="/product?category=Comics&page=1">
            Comic Books
          </Link>
        </div>
        <div className="Sports">
          <Link className="link" to="/product?category=Sports&page=1">
            Sports
          </Link>
        </div>
        <div className="Figurines">
          <Link className="link" to="/product?category=Figurines&page=1">
            Figurines
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BrowseDropdown;
