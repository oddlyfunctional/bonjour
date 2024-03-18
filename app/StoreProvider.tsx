"use client";
import { makeStore, type AppStore, type RootState } from "@/store";
import { useRef } from "react";
import { Provider } from "react-redux";

export const StoreProvider = ({
  children,
  initialState,
}: {
  children: React.ReactNode;
  initialState?: RootState;
}) => {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore(initialState);
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
};
