import type { Chat } from "@/app/core/contexts/chat/chat";
import type { ChatId } from "@/app/core/core";
import type { RootState } from "@/store";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ChatsState = {
  map: Record<ChatId, Chat>;
  order: Array<ChatId>;
  currentChat: ChatId | null;
};
const initialState: ChatsState = {
  map: {},
  order: [],
  currentChat: null,
};

export const chatsSlice = createSlice({
  name: "chats",
  reducers: {
    updateChat: (state, action: PayloadAction<Chat>) => {
      state.map[action.payload.id] = action.payload;
    },
  },
  initialState,
});

export const { updateChat } = chatsSlice.actions;
export const chatsReducer = chatsSlice.reducer;
export const chatsSelector = chatsSlice.selectSlice;
export const fullChatsSelector = (state: RootState) =>
  state.chats.order.map((id) => state.chats.map[id]);
export const currentChatSelector = (state: RootState) =>
  (state.chats.currentChat && state.chats.map[state.chats.currentChat]) || null;
