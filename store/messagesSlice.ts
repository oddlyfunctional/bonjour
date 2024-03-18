import type { Message } from "@/app/core/contexts/chat/message";
import type { ChatId, MessageId } from "@/app/core/core";
import { createAppSelector } from "@/store/utils";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type MessagesState = Record<
  ChatId,
  {
    map: Record<MessageId, Message>;
    order: Array<MessageId>;
  }
>;

const initialState: MessagesState = {};

const addMessage = (state: MessagesState, message: Message) => {
  const chat = state[message.chatId] || { map: {}, order: [] };
  chat.map[message.id] = message;
  chat.order.push(message.id);
  chat.order.sort((a, b) => {
    const dateA = chat.map[a]?.sentAt || 0;
    const dateB = chat.map[b]?.sentAt || 0;

    return dateA - dateB;
  });
  state[message.chatId] = chat;
};

export const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    messageSent: (state, action: PayloadAction<Message>) => {
      addMessage(state, action.payload);
    },
    messageReceived: (state, action: PayloadAction<Message>) => {
      const { id, chatId } = action.payload;
      if (chatId in state && id in state[chatId].map) {
        state[chatId].map[action.payload.id] = action.payload;
      } else {
        addMessage(state, action.payload);
      }
    },
  },
});

export const { messageSent, messageReceived } = messagesSlice.actions;
export const messagesSelector = messagesSlice.selectSlice;
export const chatMessagesSelector = (chatId: ChatId) =>
  createAppSelector(
    messagesSelector,
    (messages) =>
      messages[chatId]?.order?.map((id) => messages[chatId].map[id]) || [],
  );
export const messagesReducer = messagesSlice.reducer;
