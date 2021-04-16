import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import UserReducer from "./reducers/userReducer";
import CallReducer from "./reducers/callReducer";
import UIReducer from "./reducers/uiReducer";
import EmployeeReducer from "./reducers/employeeReducer";
import CeoReducer from "./reducers/ceoReducer";


const initialState = {};

const middleware = [thunk];

const reducers = combineReducers({
  user: UserReducer,
  call: CallReducer,
  ui: UIReducer,
  employee: EmployeeReducer,
  ceo: CeoReducer
});

const store = createStore(
  reducers,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
