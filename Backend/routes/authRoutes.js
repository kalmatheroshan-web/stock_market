import express from "express";
import { login, sendOtp, sign_up, verifyOtp } from "../controllers/authController.js";
import authMiddleware from "../middlewares/auth.js";

const authRoutes = express.Router();

authRoutes.post("/signup", sign_up);
authRoutes.post('/send-otp', sendOtp);
authRoutes.post('/verify-otp', verifyOtp);
authRoutes.put('/login', login);
authRoutes.get("/me", authMiddleware, (req, res) => {
    res.json({
        success: true,
        user: req.user,
    });
});

export default authRoutes;