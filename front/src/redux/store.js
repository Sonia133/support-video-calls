import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import UserReducer from "./reducers/userReducer";
import CallReducer from "./reducers/callReducer";
import UIReducer from "./reducers/uiReducer";
import EmployeeReducer from "./reducers/employeeReducer";
import CeoReducer from "./reducers/ceoReducer";
import GameReducer from "./reducers/gameReducer";

const initialState = {};

const middleware = [thunk];

const reducers = combineReducers({
  user: UserReducer,
  call: CallReducer,
  ui: UIReducer,
  employee: EmployeeReducer,
  ceo: CeoReducer,
  game: GameReducer
});

const store = createStore(
  reducers,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
