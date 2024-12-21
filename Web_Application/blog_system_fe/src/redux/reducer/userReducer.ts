import signinReducer from "../slice/user/signinSlice";

import { combineReducers } from "@reduxjs/toolkit";

const userReducer = combineReducers({
  signin: signinReducer,
});

export default userReducer;
