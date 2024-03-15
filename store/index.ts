import { chatReducer, type ChatState } from "@/store/chatSlice";
import { membersReducer, type MembersState } from "@/store/membersSlice";
import { messagesReducer, type MessagesState } from "@/store/messagesSlice";
import { configureStore } from "@reduxjs/toolkit";

export type RootState = {
  chat: ChatState;
  messages: MessagesState;
  members: MembersState;
};

export const makeStore = (preloadedState?: RootState) => {
  return configureStore({
    reducer: {
      chat: chatReducer,
      messages: messagesReducer,
      members: membersReducer,
    },
    preloadedState,
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
