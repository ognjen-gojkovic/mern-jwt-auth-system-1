import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { rootReducer } from "./rootReducer";
import { composeWithDevTools } from "redux-devtools-extension";

const middlewares = [thunk];

export const reduxStore = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middlewares))
);
