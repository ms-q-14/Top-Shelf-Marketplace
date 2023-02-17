import React, { useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import ActiveListings from "./ActiveListings";
import "./SellTabs.css";
import SoldListings from "./SoldListings";
import FeaturedCard from "../Home/FeaturedCard";
import { getExpressBaseURI } from "../../utils/constants";

function SellTabs() {
  const [data, setData] = React.useState([]);
  const [activeTab, setActiveTab] = React.useState(0);
  const handleClick = (event, index) => {
    setActiveTab(index);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")).user;

    const userId = user.id;

    console.log(userId);

    async function fetchData() {
      const response = await fetch(
        `${getExpressBaseURI()}/api/product/user/${userId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const json = await response.json();
      console.log(json);

      if (!response.ok) {
        setData([]);
        console.error(response.error);
      }

      if (response.ok) {
        setData(json.products);
      }
    }
    fetchData();
  }, []);

  const activeListedItems = <ActiveListings data={data} />;
  const soldListedItems = <SoldListings data={data} />;

  return (
    <div className="sell__tabs">
      <div className="sell__tabs__header">
        <div
          className={`sell__tabs__tab ${
            activeTab === 0 ? "sell__tabs__tab--active" : ""
          }`}
          onClick={(event) => handleClick(event, 0)}
        >
          Active Listings
        </div>
        <div
          className={`sell__tabs__tab ${
            activeTab === 1 ? "sell__tabs__tab--active" : ""
          }`}
          onClick={(event) => handleClick(event, 1)}
        >
          Sold
        </div>
      </div>
      {activeTab === 0 && (
        <div className="sell__tabs__panel">{activeListedItems}</div>
      )}
      {activeTab === 1 && (
        <div className="sell__tabs__panel">{soldListedItems}</div>
      )}
    </div>
  );
}

export default SellTabs;
