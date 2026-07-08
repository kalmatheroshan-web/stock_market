
import express from "express";
import { sign_up } from "../controllers/authController.js";

const authRoutes = express.Router();

authRoutes.post("/signup", sign_up);

export default authRoutes;