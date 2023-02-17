import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import React from "react";

function Streams() {
  const [streamData, setStreamData] = React.useState([]);

  React.useEffect(
    {
      // getLiveStreams() {
      //   axios.get("http://127.0.0.1:8888/api/streams").then((res) => {
      //     let streams = res.data;
      //     if (typeof (streams["live"] !== "undefined")) {
      //       getStreamsInfo(streams["live"]);
      //     }
      //   });
      // },
      // getStreamsInfo(live_streams) {
      //   axios
      //     .get("/streams/info", {
      //       params: {
      //         streams: live_streams,
      //       },
      //     })
      //     .then((res) => {
      //       setStreamData(
      //         {
      //           live_streams: res.data,
      //         },
      //         () => {
      //           console.log(this.state);
      //         }
      //       );
      //     });
      // },
    },
    []
  );

  // let streams = streamData.map((stream, index) => {
  //   return (
  //     <div className="stream col-xs-12 col-sm-12 col-md-3 col-lg-4" key={index}>
  //       <span className="live-label">LIVE</span>
  //       <Link to={"/stream/" + stream.username}>
  //         <div className="stream-thumbnail">
  //           <img src={"/thumbnails/" + stream.stream_key + ".png"} />
  //         </div>
  //       </Link>

  //       <span className="username">
  //         <Link to={"/stream/" + stream.username}>{stream.username}</Link>
  //       </span>
  //     </div>
  //   );
  // });
  return (
    <div>
      hello
      {/* <div className="container mt-5">
        <h4>Live Streams</h4>
        <hr className="my-4" />

        <div className="streams row">{streams}</div>
      </div> */}
    </div>
  );
}

export default Streams;
