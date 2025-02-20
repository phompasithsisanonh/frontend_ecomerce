import { combineReducers } from "redux";
import homeReducer from "./reducers/homeReducers";
import authReducer from "./reducers/authReducer";
import cardReducer from "./reducers/cardReducer";
import  paymentReducer  from "./reducers/paymentReducer";
import  orderReducer  from "./reducers/orderReducer";

const rootReducer = combineReducers({
  home: homeReducer,
  auth: authReducer,
  card: cardReducer,
  payment:paymentReducer,
  order:orderReducer
});
export default rootReducer;
