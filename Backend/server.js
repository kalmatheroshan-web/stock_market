import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/mongodb.js";

import authRoutes from "./routes/authRoutes.js";
import stockRoutes from "./routes/stockRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";

import setupSocket from "./sockets/socketServer.js";
import startFinnhubSocket from "./sockets/startFinnhubSocket.js";

dotenv.config();

// Connect Database
connectDB();

const app = express();
const server = http.createServer(app);

// ----- Middleware -----
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
    cors({
        origin: process.env.CLIENT_URL, // your frontend origin
        credentials: true,               // required for cookies
    })
);

// Optional: log incoming cookies for debugging
app.use((req, res, next) => {
    console.log('Cookie header:', req.headers.cookie); // should show token after proxy
    next();
});

// ----- Socket.IO -----
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
    },
});

// ----- Routes -----
app.use("/api/auth", authRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/portfolio", portfolioRoutes);

// Health Check
app.get("/", (req, res) => {
    res.json({ success: true, message: "Stock Market API Running 🚀" });
});

// ----- Socket Setup -----
setupSocket(io);
startFinnhubSocket(io);

// ----- Start Server -----
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});