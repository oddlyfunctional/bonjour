import type { RootState } from "@/store";
import { createSelector } from "@reduxjs/toolkit";

export const createAppSelector = createSelector.withTypes<RootState>();
