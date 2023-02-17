import React from "react";
import AuctionCategories from "./AuctionCategories";
import "./index.css";
import AuctionCategoriesData from "./AuctionCategoriesData";
import AuctionStreamCard from "./AuctionStreamCard";
import { Link, useLocation } from "react-router-dom";
import { getExpressBaseURI } from "../../utils/constants";

function Auctions() {
  const [activeTab, setActiveTab] = React.useState(0);
  const [streamData, setStreamData] = React.useState([]);

  const categoryCards = AuctionCategoriesData.map((card) => {
    return (
      <AuctionCategories
        key={card._id}
        category={card.category}
        image={card.image}
      />
    );
  });

  const handleClick = (event, index) => {
    setActiveTab(index);
  };

  React.useEffect(() => {
    async function fetchStreamData() {
      const response = await fetch(`${getExpressBaseURI()}/api/stream`, {
        method: "GET",
        credentials: "include",
      });
      const json = await response.json();
      console.log(json);

      if (!response.ok) {
        setStreamData([]);
        console.error(response.error);
      }

      if (response.ok) {
        setStreamData(json.streams);
      }
    }
    fetchStreamData();
  }, []);

  const streamCards = streamData.map((stream) => {
    return (
      <Link
        className="link"
        to={"/stream"}
        state={{
          streamKey: stream.streamKey,
          streamTitle: stream.streamName,
          streamAvatar: stream.streamAvatar,
          streamCategory: stream.streamCategory,
          streamer: stream.streamerName,
        }}
      >
        <AuctionStreamCard
          className="auction__list__card"
          key={stream.id}
          id={stream._id}
          streamKey={stream.streamKey}
          title={stream.streamName}
          category={stream.streamCategory}
          avatar={stream.streamAvatar}
          name={stream.streamerName}
        />
      </Link>
    );
  });

  console.log(streamCards);

  return (
    <>
      <div className="auctions__blurb">Discover new creators and genres!</div>
      <div className="auctions__tabs">
        <div className="auctions__tabs__header">
          <div
            className={`auctions__tabs__tab ${
              activeTab === 0 ? "auctions__tabs__tab--active" : ""
            }`}
            onClick={(event) => handleClick(event, 0)}
          >
            Categories
          </div>
          <div
            className={`auctions__tabs__tab ${
              activeTab === 1 ? "auctions__tabs__tab--active" : ""
            }`}
            onClick={(event) => handleClick(event, 1)}
          >
            Live Channels
          </div>
        </div>
        {activeTab === 0 && (
          <div className="auctions__tabs__panel">
            <section className="auction__category__cards">
              {categoryCards}
            </section>
          </div>
        )}
        {activeTab === 1 && (
          <div className="auctions__tabs__panel">
            <section className="auction__live__channels">{streamCards}</section>
          </div>
        )}
      </div>
    </>
  );
}

export default Auctions;
