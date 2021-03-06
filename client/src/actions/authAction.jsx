import axios from '../utils/axios';
import { REGISTER_SUCCESS, REGISTER_FAIL, AUTH_ERROR, USER_LOADED, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } from './types';
import setAuthToken from '../utils/setAuthToken';

//Load user

export const loadUser = () => async dispatch => {
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }
    try {
        const res = await axios.get('auth/me');

        dispatch({
            type: USER_LOADED,
            payload: res.data,
        });
    } catch (error) {
        dispatch({ type: AUTH_ERROR });
    }
};

//Register
export const register = ({ username, email, password }) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const body = JSON.stringify({ username, email, password });

    try {
        const res = await axios.post('auth/register', body, config);

        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data,
        });
        dispatch(loadUser());
    } catch (error) {
        const errors = error.response.data.errors;

        if (errors) {
            errors.forEach(error => dispatch(console.log(error.msg)));
        }

        dispatch({ type: REGISTER_FAIL });
    }
};

//Login
export const login = (email, password) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const body = JSON.stringify({ email, password });

    try {
        const res = await axios.post('auth/login', body, config);

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data,
        });

        dispatch(loadUser());
    } catch (error) {
        const errors = error.response.data.errors;

        if (errors) {
            errors.forEach(error => dispatch(console.log(error.msg)));
        }

        dispatch({ type: LOGIN_FAIL });
    }
};

export const logout = () => dispatch => {
    dispatch({ type: LOGOUT });
};
