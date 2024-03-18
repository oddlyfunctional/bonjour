"use client";

import { StoreProvider } from "@/app/StoreProvider";
import { LeftPanel } from "@/app/[locale]/chat/LeftPanel";
import type { RootState } from "@/store";

const makeState = <T, K extends string | number>(
  items: Array<T>,
  by: (item: T) => K,
) => {
  const map = items.reduce((map: Record<string | number, T>, item) => {
    map[by(item)] = item;
    return map;
  }, {});

  const order = items.map((item) => by(item));

  return { map, order };
};

export const Main = ({
  initialState,
  children,
}: {
  initialState: RootState;
  children: React.ReactNode;
}) => {
  return (
    <StoreProvider initialState={initialState}>
      <div className="flex h-full w-1/3 flex-row">
        <LeftPanel />
      </div>
      {children}
    </StoreProvider>
  );
};
