import {configureStore} from "@reduxjs/toolkit";
import rootReducer from "./Reducers/Index.js";

const store = configureStore({
    reducer: rootReducer,
});

export default store;