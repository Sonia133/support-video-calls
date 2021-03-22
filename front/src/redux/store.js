import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import AuthReducer from "./reducers/authReducer";

const initialState = {};

const middleware = [thunk];

const reducers = combineReducers({
  user: AuthReducer,
});

const store = createStore(
  reducers,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
