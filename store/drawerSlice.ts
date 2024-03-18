import type { Profile } from "@/app/core/contexts/account/profile";
import type { Chat } from "@/app/core/contexts/chat/chat";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type DrawerContent =
  | null
  | { _tag: "Profile"; profile: Profile }
  | { _tag: "NewChat" }
  | { _tag: "EditChat"; chat: Chat };
export type DrawerState = {
  open: boolean;
  content: DrawerContent;
};

const initialState: DrawerState = {
  open: false,
  content: null,
};

export const drawerSlice = createSlice({
  name: "drawer",
  reducers: {
    open: (state, payload: PayloadAction<DrawerContent>) => {
      state.content = payload.payload;
      state.open = true;
    },
    close: (state) => {
      state.content = null;
      state.open = false;
    },
  },
  initialState,
});

export const { open, close } = drawerSlice.actions;
export const drawerReducer = drawerSlice.reducer;
export const drawerSelector = drawerSlice.selectSlice;
