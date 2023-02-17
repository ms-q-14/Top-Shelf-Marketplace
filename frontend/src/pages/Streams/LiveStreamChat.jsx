import React, { useState, useEffect } from "react";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  VirtualizedMessageList,
  Window,
  MessageList,
  Message,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
// import "./LiveStreamChat.css";

const useClient = ({ apiKey, userData, tokenOrProvider }) => {
  const [chatClient, setChatClient] = useState(null);

  useEffect(() => {
    const client = new StreamChat(apiKey);
    // prevents application from setting stale client (user changed, for example)
    let didUserConnectInterrupt = false;

    const connectionPromise = client
      .connectUser(userData, tokenOrProvider)
      .then(() => {
        if (!didUserConnectInterrupt) setChatClient(client);
      });

    return () => {
      didUserConnectInterrupt = true;
      setChatClient(null);
      // wait for connection to finish before initiating closing sequence
      connectionPromise
        .then(() => client.disconnectUser())
        .then(() => {
          console.log("connection closed");
        });
    };
  }, [apiKey, userData.id, tokenOrProvider]);

  return chatClient;
};

const userToken =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiZGFtcC1ib2F0LTYifQ.mwF7vcf453wtXDBVBrzFUmeAF8bxYUw3xefz61YtMps";

const user = {
  id: "damp-boat-6",
  name: "damp-boat-6",
  image: "https://getstream.io/random_png/?id=damp-boat-6&name=damp-boat-6",
};

const LiveStreamChat = () => {
  const chatClient = useClient({
    apiKey: "mnkayw9b9yek",
    userData: user,
    tokenOrProvider: userToken,
  });

  const [channel, setChannel] = useState(undefined);

  useEffect(() => {
    if (!chatClient || channel) return;

    const spaceChannel = chatClient.channel("messaging", "spacex", {
      image: "https://goo.gl/Zefkbx",
      name: "SpaceX launch discussion",
    });

    setChannel(spaceChannel);
  }, [chatClient]);

  if (!chatClient) return null;

  return (
    <div style={{ height: "100%" }}>
      <Chat client={chatClient} theme="str-chat__theme-dark">
        <Channel channel={channel}>
          <Window>
            <ChannelHeader live />
            <VirtualizedMessageList />
            <MessageInput focus />
          </Window>
        </Channel>
      </Chat>
    </div>
  );
};

export default LiveStreamChat;
