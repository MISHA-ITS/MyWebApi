import {combineReducers} from "@reduxjs/toolkit";
import accountReducer from "./accountReducer/index.js";

const rootReducer = combineReducers ({
    account: accountReducer,
});

export default rootReducer;