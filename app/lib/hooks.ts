import { Socket, type Channel } from "phoenix";
import { useEffect, useRef } from "react";

export const useChannel = (
  topic: string,
  callback: (channel: Channel) => void = () => {},
) => {
  const channelRef = useRef<Channel>();

  useEffect(() => {
    // TODO: find better way to share config with client
    const socket = new Socket(
      process.env.NEXT_PUBLIC_MESSAGE_REALTIME_SERVICE_URL as string,
    );
    socket.connect();
    const channel = socket.channel(topic);
    channel.join().receive("ok", () => {
      channelRef.current = channel;
      callback(channel);
    });
    return () => socket.disconnect();
  }, []);

  return channelRef;
};
