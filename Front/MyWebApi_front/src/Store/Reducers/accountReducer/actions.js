import axios from "axios";
import {jwtDecode} from "jwt-decode";

export const login = (credentials) => async (dispatch) => {
    const url = `${import.meta.env.VITE_API_URL}account/login`;

    try {
        const response = await axios.post(url, credentials);
        console.log("Full response.data:", response.data);

        const token = response.data.payLoad ?? response.data.payload;

        if (!token) {
            console.warn("Token not found in response", response.data);
            return;
        }

        localStorage.setItem("oauth", token);
        console.log("Token saved to localStorage:", token);

        const decodedToken = jwtDecode(token);
        delete decodedToken.aud;
        delete decodedToken.iss;
        delete decodedToken.exp;
        console.log("Decoded token:", decodedToken);

        dispatch({ type: "LOGIN", payload: decodedToken });

    } catch (error) {
        console.error("Login error:", error);
        dispatch({ type: "LOGIN_FAILURE" });
    }
};

export const googleLogin = (googleData) => async (dispatch) => {
    const url = `${import.meta.env.VITE_API_URL}account/google-login`;

    try {
        const response = await axios.post(url, googleData);
        console.log("Google login response:", response.data);

        const token = response.data.payLoad ?? response.data.payload;

        if (!token) {
            console.warn("Token not found in Google response", response.data);
            return;
        }

        localStorage.setItem("oauth", token);
        console.log("Google token saved to localStorage:", token);

        const decodedToken = jwtDecode(token);
        delete decodedToken.aud;
        delete decodedToken.iss;
        delete decodedToken.exp;
        console.log("Decoded Google token:", decodedToken);

        dispatch({ type: "LOGIN", payload: decodedToken });

    } catch (error) {
        console.error("Google login error:", error);
        dispatch({ type: "LOGIN_FAILURE" });
        throw error;
    }
};

export const logout = ()  => {
    localStorage.removeItem("oauth");
    return ({ type: "LOGOUT" });
};

export const getUserLogins = (userId) => async (dispatch) => {
    const url = `${import.meta.env.VITE_API_URL}account/user-logins?userId=${userId}`;

    try {
        const response = await axios.get(url);
        console.log("User logins response:", response.data);

        if (response.data.isSuccess) {
            dispatch({ 
                type: "GET_USER_LOGINS_SUCCESS", 
                payload: response.data.payLoad 
            });
        } else {
            dispatch({ 
                type: "GET_USER_LOGINS_FAILURE", 
                payload: response.data.message 
            });
        }

    } catch (error) {
        console.error("Get user logins error:", error);
        dispatch({ 
            type: "GET_USER_LOGINS_FAILURE", 
            payload: "Помилка отримання зовнішніх акаунтів" 
        });
    }
};

export const removeLogin = (userId, loginProvider, providerKey) => async (dispatch) => {
    const url = `${import.meta.env.VITE_API_URL}account/remove-login?userId=${userId}&loginProvider=${loginProvider}&providerKey=${providerKey}`;

    try {
        const response = await axios.delete(url);
        console.log("Remove login response:", response.data);

        if (response.data.isSuccess) {
            dispatch({ 
                type: "REMOVE_LOGIN_SUCCESS", 
                payload: { loginProvider, providerKey } 
            });
            // Оновлюємо список логінів після видалення
            dispatch(getUserLogins(userId));
        } else {
            dispatch({ 
                type: "REMOVE_LOGIN_FAILURE", 
                payload: response.data.message 
            });
        }

    } catch (error) {
        console.error("Remove login error:", error);
        dispatch({ 
            type: "REMOVE_LOGIN_FAILURE", 
            payload: "Помилка видалення зовнішнього акаунту" 
        });
    }
};
