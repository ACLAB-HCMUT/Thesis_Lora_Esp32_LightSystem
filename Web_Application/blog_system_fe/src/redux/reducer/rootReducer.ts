import userReducer from "./userReducer";
import appReducer from "./appReducer";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  user: userReducer,
  app: appReducer,
});

export default rootReducer;
