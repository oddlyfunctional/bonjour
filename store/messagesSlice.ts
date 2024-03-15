import type { Message } from "@/app/core/contexts/chat/message";
import type { MessageId } from "@/app/core/core";
import type { RootState } from "@/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type MessagesState = {
  map: Record<MessageId, Message>;
  order: Array<MessageId>;
};

const initialState: MessagesState = {
  map: {},
  order: [],
};

const addMessage = (state: MessagesState, message: Message) => {
  state.map[message.id] = message;
  state.order.push(message.id);
  state.order.sort((a, b) => {
    const dateA = state.map[a]?.sentAt?.getTime() || 0;
    const dateB = state.map[b]?.sentAt?.getTime() || 0;

    return dateA - dateB;
  });
};

export const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    messageSent: (state, action: PayloadAction<Message>) => {
      addMessage(state, action.payload);
    },
    messageReceived: (state, action: PayloadAction<Message>) => {
      if (action.payload.id in state.map) {
        state.map[action.payload.id] = action.payload;
      } else {
        addMessage(state, action.payload);
      }
    },
  },
});

export const { messageSent, messageReceived } = messagesSlice.actions;
export const messagesSelector = messagesSlice.selectSlice;
export const fullMessagesSelector = (state: RootState) =>
  state.messages.order.map((id) => state.messages.map[id]);
export const messagesReducer = messagesSlice.reducer;
