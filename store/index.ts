import { chatsReducer, type ChatsState } from "@/store/chatsSlice";
import {
  currentUserReducer,
  type CurrentUserState,
} from "@/store/currentUserSlice";
import { drawerReducer, type DrawerState } from "@/store/drawerSlice";
import { membersReducer, type MembersState } from "@/store/membersSlice";
import { messagesReducer, type MessagesState } from "@/store/messagesSlice";
import { configureStore } from "@reduxjs/toolkit";

export type RootState = {
  currentUser: CurrentUserState;
  chats: ChatsState;
  messages: MessagesState;
  members: MembersState;
  drawer: DrawerState;
};

export const makeStore = (preloadedState?: RootState) => {
  return configureStore({
    reducer: {
      currentUser: currentUserReducer,
      chats: chatsReducer,
      messages: messagesReducer,
      members: membersReducer,
      drawer: drawerReducer,
    },
    preloadedState,
  });
};

export const makeListState = <T, K extends string | number>(
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

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
