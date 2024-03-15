import type { AppDispatch, AppStore, RootState } from "@/store";
import { Socket, type Channel } from "phoenix";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";

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

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
