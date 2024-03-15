import type { Chat } from "@/app/core/contexts/chat/chat";
import { createSlice } from "@reduxjs/toolkit";

export type ChatState = Chat;
// The actual initial state will be provided by the server,
// this is only to make the types match.
const initialState: ChatState = null as any;

export const chatSlice = createSlice({
  name: "chat",
  reducers: {},
  initialState,
});

export const chatReducer = chatSlice.reducer;
export const chatSelector = chatSlice.selectSlice;
