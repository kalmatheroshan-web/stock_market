const BASE_URL = import.meta.env.VITE_BASE_URL;

export const AUTH_API = {
    SIGN_UP: `${BASE_URL}/api/auth/signup`,
    ME: `${BASE_URL}/api/auth/me`,
    LOGIN: `${BASE_URL}/api/auth/login`,
    LOGOUT: `${BASE_URL}/api/auth/logout`,
    SEND_OTP: `${BASE_URL}/api/auth/send-otp`,
    VERIFY_OTP: `${BASE_URL}/api/auth/verify-otp`,
    VERIFY_EMAIL: `${BASE_URL}/api/auth/verify-email`,
    RESEND_VERIFICATION: `${BASE_URL}/api/auth/resend-verification`,
    FORGOT_PASSWORD: `${BASE_URL}/api/auth/forgot-password`,
    RESET_PASSWORD: `${BASE_URL}/api/auth/reset-password`,
    CHANGE_PASSWORD: `${BASE_URL}/api/auth/change-password`,
    GET_PROFILE: `${BASE_URL}/api/auth/profile`,
    UPDATE_PROFILE: `${BASE_URL}/api/auth/profile`,
};