const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/mongodb");

const authRoutes = require("./routes/authRoutes");
const stockRoutes = require("./routes/stockRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes");
const portfolioRoutes = require('./routes/portfolioRoutes');

const setupSocket = require("./sockets/socketServer");
const startFinnhubSocket = require('./sockets/startFinnhubSocket');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Connect Database
connectDB();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/portfolio", portfolioRoutes);

// Health Check
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Stock Market API Running 🚀",
    });
});

// Socket.IO
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
    },
});

// Setup Socket.IO
setupSocket(io);

// Start Finnhub WebSocket
startFinnhubSocket(io);

// Start Server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});