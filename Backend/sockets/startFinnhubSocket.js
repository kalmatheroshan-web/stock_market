const { WebSocketServer } = require("ws");

const UPDATE_INTERVAL = 500; // 500ms for smooth updates

// Initial stock data with realistic prices and volatility
const stocks = {
    AAPL: { 
        price: 178.50, 
        volatility: 0.15,
        trend: 0.02,
        volume: 1250000,
        name: "Apple Inc."
    },
    TSLA: { 
        price: 245.60, 
        volatility: 0.35,
        trend: -0.01,
        volume: 890000,
        name: "Tesla Inc."
    },
    NVDA: { 
        price: 875.40, 
        volatility: 0.50,
        trend: 0.05,
        volume: 1500000,
        name: "NVIDIA Corporation"
    },
    MSFT: { 
        price: 415.20, 
        volatility: 0.12,
        trend: 0.03,
        volume: 980000,
        name: "Microsoft Corporation"
    },
    GOOGL: { 
        price: 142.80, 
        volatility: 0.18,
        trend: -0.02,
        volume: 760000,
        name: "Alphabet Inc."
    },
    AMZN: { 
        price: 185.30, 
        volatility: 0.22,
        trend: 0.01,
        volume: 820000,
        name: "Amazon.com Inc."
    },
    META: { 
        price: 512.90, 
        volatility: 0.28,
        trend: 0.04,
        volume: 650000,
        name: "Meta Platforms Inc."
    },
    NFLX: { 
        price: 625.30, 
        volatility: 0.32,
        trend: -0.03,
        volume: 540000,
        name: "Netflix Inc."
    }
};

// Track price history for realistic movement
const priceHistory = {};
Object.keys(stocks).forEach(symbol => {
    priceHistory[symbol] = [stocks[symbol].price];
});

// Generate realistic market movement
function generatePriceUpdate(symbol, stock) {
    // Random walk with momentum
    const momentum = Math.random() * 0.3 + 0.7; // 0.7 to 1.0
    const randomShock = (Math.random() - 0.5) * stock.volatility * 0.5;
    const trendComponent = stock.trend * 0.3;
    const noise = (Math.random() - 0.5) * 0.2;
    
    // Calculate percentage change
    const changePercent = (trendComponent + randomShock + noise) / 100;
    const newPrice = stock.price * (1 + changePercent);
    
    // Add some mean reversion
    const meanReversion = (178.50 - newPrice) * 0.001; // Slight pull to mean
    
    let finalPrice = newPrice + meanReversion;
    
    // Ensure price doesn't go negative
    finalPrice = Math.max(5, finalPrice);
    
    // Round to 2 decimal places
    finalPrice = parseFloat(finalPrice.toFixed(2));
    
    // Update price history
    priceHistory[symbol].push(finalPrice);
    if (priceHistory[symbol].length > 100) {
        priceHistory[symbol].shift();
    }
    
    // Calculate change from previous price
    const previousPrice = priceHistory[symbol][priceHistory[symbol].length - 2] || stock.price;
    const change = finalPrice - previousPrice;
    const changePercentDisplay = parseFloat(((change / previousPrice) * 100).toFixed(2));
    
    // Update stock object
    stock.price = finalPrice;
    stock.change = parseFloat(change.toFixed(2));
    stock.changePercent = changePercentDisplay;
    
    // Add some random volume variation
    stock.volume = Math.floor(stock.volume * (0.95 + Math.random() * 0.1));
    
    return stock;
}

// Generate price alerts occasionally
function generatePriceAlert(symbol, price, changePercent) {
    const alerts = [];
    
    // Significant movement alert
    if (Math.abs(changePercent) > 3) {
        alerts.push({
            symbol,
            type: changePercent > 0 ? "SURGE" : "DROP",
            message: `${symbol} ${changePercent > 0 ? '🚀 surged' : '📉 dropped'} ${Math.abs(changePercent)}% to $${price}`,
            severity: Math.abs(changePercent) > 5 ? "HIGH" : "MEDIUM"
        });
    }
    
    // Price milestone alerts
    if (price > 1000 && priceHistory[symbol][priceHistory[symbol].length - 2] < 1000) {
        alerts.push({
            symbol,
            type: "MILESTONE",
            message: `${symbol} crossed $1000! 🎯`,
            severity: "HIGH"
        });
    }
    
    return alerts;
}

function startFinnhubSocket(io) {
    const wss = new WebSocketServer({ port: 8080 });

    console.log("🚀 Stock WebSocket running at ws://localhost:8080");
    console.log("📊 Tracking stocks with realistic simulation");
    console.log("📈 Symbols: " + Object.keys(stocks).join(", "));

    let updateCount = 0;
    let alerts = [];

    // Simulate market movement
    setInterval(() => {
        updateCount++;
        
        // Update all stocks
        Object.entries(stocks).forEach(([symbol, stock]) => {
            const updatedStock = generatePriceUpdate(symbol, stock);
            stocks[symbol] = updatedStock;
            
            // Check for alerts
            const newAlerts = generatePriceAlert(symbol, updatedStock.price, updatedStock.changePercent);
            alerts.push(...newAlerts);
            
            // Keep only recent alerts
            if (alerts.length > 50) {
                alerts = alerts.slice(-50);
            }
        });

        // Prepare market data
        const marketData = {
            timestamp: Date.now(),
            updateCount,
            stocks: Object.fromEntries(
                Object.entries(stocks).map(([symbol, data]) => [
                    symbol,
                    {
                        price: data.price,
                        change: data.change || 0,
                        changePercent: data.changePercent || 0,
                        volume: data.volume,
                        name: data.name,
                    }
                ])
            ),
            alerts: alerts.slice(-5), // Send last 5 alerts
        };

        // Broadcast to all WebSocket clients
        wss.clients.forEach((client) => {
            if (client.readyState === client.OPEN) {
                // Send full market update
                client.send(JSON.stringify({
                    type: "market-update",
                    ...marketData,
                }));

                // Send specific updates for subscribed stocks
                if (client.subscriptions && client.subscriptions.size > 0) {
                    client.subscriptions.forEach((symbol) => {
                        if (stocks[symbol]) {
                            client.send(JSON.stringify({
                                type: "trade",
                                symbol,
                                price: stocks[symbol].price,
                                change: stocks[symbol].change || 0,
                                changePercent: stocks[symbol].changePercent || 0,
                                volume: stocks[symbol].volume,
                                timestamp: Date.now(),
                            }));
                        }
                    });
                }
            }
        });

        // Also emit via Socket.io if available
        if (io) {
            io.emit("market-updates", marketData);
        }

    }, UPDATE_INTERVAL);

    // WebSocket connection handler
    wss.on("connection", (ws) => {
        console.log("✅ Client connected");
        console.log(`📡 Active clients: ${wss.clients.size}`);

        ws.subscriptions = new Set();

        // Send initial data
        const initialData = {
            type: "connected",
            message: "Connected successfully",
            timestamp: Date.now(),
            stocks: Object.fromEntries(
                Object.entries(stocks).map(([symbol, data]) => [
                    symbol,
                    {
                        price: data.price,
                        change: data.change || 0,
                        changePercent: data.changePercent || 0,
                        volume: data.volume,
                        name: data.name,
                    }
                ])
            ),
            alerts: alerts.slice(-5),
        };

        ws.send(JSON.stringify(initialData));

        ws.on("message", (message) => {
            try {
                const data = JSON.parse(message);

                switch (data.action) {
                    case "subscribe":
                        const symbol = data.symbol.toUpperCase();
                        if (!stocks[symbol]) {
                            return ws.send(JSON.stringify({
                                type: "error",
                                message: `Unknown symbol: ${symbol}`,
                            }));
                        }

                        ws.subscriptions.add(symbol);

                        // Send current data for the subscribed symbol
                        ws.send(JSON.stringify({
                            type: "subscribed",
                            symbol: symbol,
                            price: stocks[symbol].price,
                            change: stocks[symbol].change || 0,
                            changePercent: stocks[symbol].changePercent || 0,
                            volume: stocks[symbol].volume,
                            data: stocks[symbol],
                        }));
                        break;

                    case "unsubscribe":
                        ws.subscriptions.delete(data.symbol.toUpperCase());
                        ws.send(JSON.stringify({
                            type: "unsubscribed",
                            symbol: data.symbol,
                        }));
                        break;

                    case "subscribeMany":
                        const validSymbols = [];
                        data.symbols.forEach((sym) => {
                            const symbol = sym.toUpperCase();
                            if (stocks[symbol]) {
                                ws.subscriptions.add(symbol);
                                validSymbols.push(symbol);
                            }
                        });

                        ws.send(JSON.stringify({
                            type: "subscribed",
                            symbols: validSymbols,
                            data: Object.fromEntries(
                                validSymbols.map(sym => [
                                    sym,
                                    {
                                        price: stocks[sym].price,
                                        change: stocks[sym].change || 0,
                                        changePercent: stocks[sym].changePercent || 0,
                                        volume: stocks[sym].volume,
                                    }
                                ])
                            ),
                        }));
                        break;

                    case "getAll":
                        ws.send(JSON.stringify({
                            type: "all-data",
                            data: Object.fromEntries(
                                Object.entries(stocks).map(([symbol, data]) => [
                                    symbol,
                                    {
                                        price: data.price,
                                        change: data.change || 0,
                                        changePercent: data.changePercent || 0,
                                        volume: data.volume,
                                        name: data.name,
                                    }
                                ])
                            ),
                            timestamp: Date.now(),
                        }));
                        break;

                    case "getHistory":
                        const historySymbol = data.symbol.toUpperCase();
                        if (!stocks[historySymbol]) {
                            return ws.send(JSON.stringify({
                                type: "error",
                                message: `Unknown symbol: ${historySymbol}`,
                            }));
                        }
                        ws.send(JSON.stringify({
                            type: "history",
                            symbol: historySymbol,
                            history: priceHistory[historySymbol] || [],
                        }));
                        break;

                    default:
                        ws.send(JSON.stringify({
                            type: "error",
                            message: "Unknown action. Available: subscribe, unsubscribe, subscribeMany, getAll, getHistory",
                        }));
                }
            } catch (error) {
                ws.send(JSON.stringify({
                    type: "error",
                    message: "Invalid JSON payload",
                }));
            }
        });

        ws.on("close", () => {
            console.log("❌ Client disconnected");
            console.log(`📡 Active clients: ${wss.clients.size}`);
        });

        ws.on("error", (err) => {
            console.error("WebSocket Error:", err.message);
        });
    });

    // Error handling for the WebSocket server
    wss.on("error", (error) => {
        console.error("WebSocket Server Error:", error.message);
    });

    console.log("✅ Stock simulator started with realistic market behavior");
    console.log("📊 Features: price updates, volume simulation, price alerts, history tracking");

    return wss;
}

module.exports = startFinnhubSocket;