import WebSocket from "ws";
require('dotenv').config();

const API_KEY = process.env.FINNHUB_API_KEY;

const ws = new WebSocket(`wss://ws.finnhub.io?token=${API_KEY}`);

ws.on("open", () => {
    console.log("Connected");

    ws.send(JSON.stringify({
        type: "subscribe",
        symbol: "AAPL"
    }));
});

ws.on("message", (data) => {
    console.log(JSON.parse(data.toString()));
});

ws.on("close", () => {
    console.log("Disconnected");
});

ws.on("error", (err) => {
    console.error(err);
});