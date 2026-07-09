import toast from 'react-hot-toast';
import fetch_connector from './fetchConnector';
import { setUser } from "../Redux/authSlice";
import { AUTH_API } from '../services/api';
const { SIGN_UP, SEND_OTP, LOGIN, VERIFY_OTP, ME } = AUTH_API;

export const signup = async (data, navigate) => {
    try {
        const response = await fetch_connector("POST", SEND_OTP, data);

        if (response.success) {
            toast.success("OTP sent successfully");
            console.log("data ", data);
            navigate("/otp-verify", {
                state: data,
            });
        } else {
            toast.error(response.message || "Failed to send OTP");
        }
    } catch (err) {
        toast.error(err.message);
        console.error(err);
    }
};

export const resendOtp = async (email) => {
    try {
        const response = await fetch_connector("POST", SEND_OTP, email);

        if (!response.success)
            toast.error(response.message || "Failed to send OTP");
    } catch (error) {
        toast.error(error.message);
        console.error(error);
    }
}

export const verifyOtp = (data, navigate) => async (dispatch) => {
    try {
        // 1. Verify OTP
        const verifyResponse = await fetch_connector('POST', VERIFY_OTP_API, data);
        if (!verifyResponse.success) {
            toast.error(verifyResponse.message || 'Invalid OTP');
            return Promise.reject(verifyResponse.message);
        }

        // 2. Sign up (complete registration)
        const signupResponse = await fetch_connector('POST', SIGN_UP, data);
        if (!signupResponse.success) {
            toast.error(signupResponse.message || 'Signup failed');
            return Promise.reject(signupResponse.message);
        }

        const { user, token } = signupResponse.data;
        dispatch(setUser({ user, token }));

        toast.success('Welcome to TradeGo');
        navigate('/');

        return { user, token };
    } catch (err) {
        toast.error(err.message || 'Something went wrong');
        return Promise.reject(err.message);
    }
};

export const login = (data, navigate) => async (dispatch) => {
    try {
        const response = await fetch_connector("PUT", LOGIN, data);
        if (response.success) {
            const { user } = response;

            dispatch(setUser({ user }));
            toast.success("Login done");
            navigate("/");

            return { user };
        }

        throw new Error(response.message || "Login failed");
    } catch (err) {
        toast.error(err.message || "Something went wrong");
        throw err;
    }
};

export const me = () => async (dispatch) => {
    try {
        const response = await fetch_connector('GET', ME);
        if (response.success) {
            const { user } = response;

            dispatch(setUser({ user }));
            return { user };
        }
        console.log("user not found"); 
    } catch (error) {
        toast.error(err.message || "Something went wrong");
        throw err;
    }
}
