import { combineReducers } from "redux";
import { reducerAuth } from "./reducers/Reducers.Auth";

export const rootReducer = combineReducers({
  reducerAuth,
});
