import React from "react";
import "./AuctionStreamCard.css";
import { getExpressBaseURI } from "../../utils/constants";
function AuctionStreamCard(props) {
  return (
    <>
      <div className={`auction_stream_card ${props.className}`}>
        <div className="auction_stream_preview">
          <img
            className="auction_stream_card__image"
            src={`${getExpressBaseURI()}/api/stream/image/${props.streamKey}`}
          />
        </div>
        <div className="auction_stream_host_data">
          <div className="stream__profile__cirle">
            <img className="stream__profile__circle__img" src={props.avatar} />
          </div>
          <div className="auction_stream_desc">
            <p className="auction_stream_title">{props.title}</p>
            <p className="stream_host">{props.name}</p>
            <p className="stream_category">{props.category}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default AuctionStreamCard;
