import { combineReducers } from "redux";
import authhentication from "./authentication";

const rootReducer = combineReducers({
  credentials: authhentication,
});

export default rootReducer;
