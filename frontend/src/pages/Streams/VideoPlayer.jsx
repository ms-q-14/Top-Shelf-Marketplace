import videojs from "video.js";
import axios from "axios";
import React from "react";
import "video.js/dist/video-js.css";
import { Link, useLocation } from "react-router-dom";

import "./VideoPlayer.css";
import LiveStreamChat from "./LiveStreamChat";

function VideoPlayer() {
  const location = useLocation();
  const streamKey = location.state?.streamKey;
  const streamTitle = location.state?.streamTitle;
  const streamAvatar = location.state?.streamAvatar;
  const streamCategory = location.state?.streamCategory;
  const streamer = location.state?.streamer;
  const streamUri = import.meta.env.VITE_STREAM_API || "";
  console.log(streamKey);
  console.log(location);
  console.log(streamAvatar);
  console.log(streamCategory);
  console.log(streamer);
  const user = {
    id: "63abbb107c355d41eac494ef",
    name: "test",
    image:
      "https://w7.pngwing.com/pngs/608/941/png-transparent-tyrannosaurus-dino-t-rex-google-chrome-jumping-dinosaur-dinosaur-game-angle-white-thumbnail.png",
  };
  const [videoData, setVideoData] = React.useState({
    stream: true,
    videoJsOptions: {
      autoplay: false,
      controls: true,
      sources: [
        {
          src: `${streamUri}/live/${streamKey}/index.m3u8`,
          type: "application/x-mpegURL",
        },
      ],
      fluid: true,
    },
  });

  console.log(user.id);

  let videoNode = React.useRef(null);

  React.useEffect(() => {
    if (videoData.stream) {
      let player = videojs(
        videoNode.current,
        videoData.videoJsOptions,
        function onPlayerReady() {
          console.log("onPlayerReady", this);
        }
      );
    }
  }, [videoData]);

  return (
    <div className="auction__stream__container">
      <div className="auction__list">Auction List</div>
      <div className="row">
        <div className="col-xs-12 col-sm-12 col-md-10 col-lg-8 mx-auto mt-5">
          {videoData.stream ? (
            <div data-vjs-player>
              <video
                ref={videoNode}
                className="video-js vjs-big-play-centered"
              />
            </div>
          ) : (
            "Loading..."
          )}
          <div className="auction__button__information">
            <div className="auction__information__container">
              <div>
                <div className="auction__cirle">
                  <img className="auction__circle__img" src={streamAvatar} />
                </div>
              </div>
              <div className="auction__information">
                <div className="auction__username">{streamer}</div>
                <div className="auction__title">{streamTitle}</div>
                <div className="auction__category">{streamCategory}</div>
              </div>
            </div>
            <button>Follow</button>
          </div>
        </div>
      </div>
      <div className="auction__chat">
        <LiveStreamChat />
      </div>
    </div>
  );
}

export default VideoPlayer;
