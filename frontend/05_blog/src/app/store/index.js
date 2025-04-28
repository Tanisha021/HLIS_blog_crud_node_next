import { configureStore } from "@reduxjs/toolkit";

import BlogReducer from "@/app/store/slices/BlogSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      blog: BlogReducer,
    },
  });
}