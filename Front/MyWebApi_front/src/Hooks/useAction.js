import {useDispatch} from "react-redux";
import {bindActionCreators} from "@reduxjs/toolkit";
import {actionCreators} from "../Store/Actions/actionsCreator.js";

export const useAction = () => {
    const Dispatch = useDispatch ();
    return bindActionCreators(actionCreators, Dispatch);
}