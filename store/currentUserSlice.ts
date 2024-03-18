import type { Account } from "@/app/core/contexts/account/account";
import type { Profile } from "@/app/core/contexts/account/profile";
import type { Option } from "@/app/lib/option";
import { createSlice } from "@reduxjs/toolkit";

export type CurrentUserState = {
  account: Account;
  profile: Option<Profile>;
};
// this is populated with SSR
const initialState: CurrentUserState = null as any;
export const currentUserSlice = createSlice({
  name: "currentUser",
  reducers: {},
  initialState,
});

export const currentUserReducer = currentUserSlice.reducer;
export const currentUserSelector = currentUserSlice.selectSlice;
