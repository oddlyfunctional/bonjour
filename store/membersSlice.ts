import type { MemberReadModel } from "@/app/core/contexts/chat/chat";
import type { UserId } from "@/app/core/core";
import { createAppSelector } from "@/store/utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type MembersState = {
  map: Record<UserId, MemberReadModel>;
  order: Array<UserId>;
};

const initialState: MembersState = {
  map: {},
  order: [],
};

export const membersSlice = createSlice({
  name: "members",
  initialState,
  reducers: {
    memberAdded: (state, action: PayloadAction<MemberReadModel>) => {
      if (!(action.payload.userId in state.map)) {
        state.order.push(action.payload.userId);
      }
      state.map[action.payload.userId] = action.payload;
    },
  },
});

export const { memberAdded } = membersSlice.actions;
export const membersReducer = membersSlice.reducer;
export const membersSelector = membersSlice.selectSlice;
export const fullMembersSelector = createAppSelector(
  membersSelector,
  (members) => members.order.map((id) => members.map[id]),
);
