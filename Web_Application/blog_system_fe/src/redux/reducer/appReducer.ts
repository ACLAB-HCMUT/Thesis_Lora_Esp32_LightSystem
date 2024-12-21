import socketReducer from "../slice/app/socketSlice";

import { combineReducers } from "@reduxjs/toolkit";

const appReducer = combineReducers({
  socket: socketReducer,
});

export default appReducer;
