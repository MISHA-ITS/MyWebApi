const initialState = {
    user: null,
    isAuth: false,
}

const accountReducer = (state = initialState, action) => {
    switch (action.type) {
        case "LOGIN":
            return {...state, user: action.payload, isAuth: true};
        case "LOGOUT":
            return {...state, user: null, isAuth: false};
        default:
            return state;
    }
}

export default accountReducer;