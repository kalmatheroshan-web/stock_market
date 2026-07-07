import { useEffect, useRef, useState } from "react";
import { createChart, CandlestickSeries } from "lightweight-charts";
import { useLocation, Link } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown, BarChart3, Activity, DollarSign, Clock, Zap, Shield, Globe } from "lucide-react";

function StockDetails() {
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);
    const candlestickSeriesRef = useRef(null);
    const ws = useRef(null);

    const location = useLocation();
    const stock = location.state || { symbol: 'AAPL', price: 178.50 };

    const [price, setPrice] = useState(stock?.price || 0);
    const [previousPrice, setPreviousPrice] = useState(stock?.price || 0);
    const [sessionHigh, setSessionHigh] = useState(stock?.price || 0);
    const [sessionLow, setSessionLow] = useState(stock?.price || 0);
    const [isConnected, setIsConnected] = useState(false);
    const [volume, setVolume] = useState(0);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const currentCandleRef = useRef(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: Math.min(480, window.innerHeight - 380),
            layout: {
                background: { color: "transparent" },
                textColor: "#d4c5b8",
            },
            grid: {
                vertLines: { color: "rgba(255, 140, 0, 0.06)" },
                horzLines: { color: "rgba(255, 140, 0, 0.06)" },
            },
            crosshair: {
                mode: 1,
                vertLine: {
                    labelBackgroundColor: "#1a1410",
                    color: "rgba(255, 140, 0, 0.3)",
                    width: 1,
                },
                horzLine: {
                    labelBackgroundColor: "#1a1410",
                    color: "rgba(255, 140, 0, 0.3)",
                    width: 1,
                },
            },
            rightPriceScale: {
                borderColor: "rgba(255, 140, 0, 0.1)",
                autoScale: true,
                scaleMargins: {
                    top: 0.1,
                    bottom: 0.1,
                },
            },
            timeScale: {
                borderColor: "rgba(255, 140, 0, 0.1)",
                timeVisible: true,
                secondsVisible: true,
                tickMarkFormatter: (time) => {
                    const date = new Date(time * 1000);
                    return date.toLocaleTimeString();
                },
            },
        });
        chartRef.current = chart;

        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: "#ff8c00",
            downColor: "#ff4500",
            borderVisible: false,
            wickUpColor: "#ff8c00",
            wickDownColor: "#ff4500",
            borderColor: "#ff8c00",
        });

        candlestickSeriesRef.current = candlestickSeries;

        let baseTime = Math.floor(Date.now() / 1000) - 300;
        let historicalData = [];
        let startingPrice = stock?.price || 178.50;

        for (let i = 0; i < 150; i++) {
            let open = startingPrice + (Math.random() - 0.5) * 0.8;
            let close = open + (Math.random() - 0.5) * 0.8;
            let high = Math.max(open, close) + Math.random() * 0.6;
            let low = Math.min(open, close) - Math.random() * 0.6;

            historicalData.push({
                time: baseTime + (i * 2),
                open: open,
                high: high,
                low: low,
                close: close,
            });
            startingPrice = close;
        }
        candlestickSeries.setData(historicalData);

        const allHighs = historicalData.map(c => c.high);
        const allLows = historicalData.map(c => c.low);
        setSessionHigh(Math.max(...allHighs));
        setSessionLow(Math.min(...allLows));
        currentCandleRef.current = { ...historicalData[historicalData.length - 1] };

        let reconnectAttempts = 0;
        const maxReconnectAttempts = 5;

        const connectWebSocket = () => {
            try {
                ws.current = new WebSocket("ws://localhost:8080");

                ws.current.onopen = () => {
                    setIsConnected(true);
                    reconnectAttempts = 0;
                    ws.current.send(JSON.stringify({
                        action: "subscribe",
                        symbol: stock.symbol
                    }));
                };

                ws.current.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);

                        switch (data.type) {
                            case "subscribed":
                                setPrice(data.price);
                                setPreviousPrice(data.price);
                                break;

                            case "trade":
                                const tradePrice = data.price;
                                setPrice((currentPrice) => {
                                    setPreviousPrice(currentPrice);
                                    return tradePrice;
                                });
                                setVolume(data.volume || 0);
                                setLastUpdate(new Date());

                                const unixTimestamp = Math.floor(Date.now() / 1000);
                                const candleInterval = 5;
                                const standardizedTime = Math.floor(unixTimestamp / candleInterval) * candleInterval;

                                if (currentCandleRef.current && standardizedTime === currentCandleRef.current.time) {
                                    currentCandleRef.current.high = Math.max(currentCandleRef.current.high, tradePrice);
                                    currentCandleRef.current.low = Math.min(currentCandleRef.current.low, tradePrice);
                                    currentCandleRef.current.close = tradePrice;
                                } else {
                                    currentCandleRef.current = {
                                        time: standardizedTime,
                                        open: tradePrice,
                                        high: tradePrice,
                                        low: tradePrice,
                                        close: tradePrice,
                                    };
                                }

                                setSessionHigh(prev => Math.max(prev, currentCandleRef.current.high));
                                setSessionLow(prev => prev === 0 ? currentCandleRef.current.low : Math.min(prev, currentCandleRef.current.low));

                                if (candlestickSeriesRef.current) {
                                    candlestickSeriesRef.current.update(currentCandleRef.current);
                                }
                                break;

                            case "market-update":
                                if (data.stocks && data.stocks[stock.symbol]) {
                                    const stockData = data.stocks[stock.symbol];
                                    setPrice(stockData.price);
                                    setPreviousPrice(prev => prev || stockData.price);
                                    setVolume(stockData.volume || 0);
                                    setLastUpdate(new Date());
                                }
                                break;

                            default:
                                if (data.price) {
                                    setPrice(data.price);
                                    setLastUpdate(new Date());
                                }
                        }
                    } catch (error) {
                        console.error("Error processing message:", error);
                    }
                };

                ws.current.onclose = () => {
                    setIsConnected(false);
                    if (reconnectAttempts < maxReconnectAttempts) {
                        reconnectAttempts++;
                        setTimeout(connectWebSocket, 2000 * reconnectAttempts);
                    }
                };

                ws.current.onerror = (error) => {
                    console.error("WebSocket error:", error);
                    ws.current?.close();
                };
            } catch (error) {
                console.error("Failed to connect:", error);
            }
        };

        connectWebSocket();

        const handleResize = () => {
            if (chartContainerRef.current) {
                const newHeight = Math.min(480, window.innerHeight - 380);
                chart.resize(chartContainerRef.current.clientWidth, newHeight);
            }
        };
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            if (ws.current) {
                if (ws.current.readyState === WebSocket.OPEN) {
                    ws.current.send(JSON.stringify({
                        action: "unsubscribe",
                        symbol: stock.symbol
                    }));
                }
                ws.current.close();
            }
            if (chart) {
                chart.remove();
            }
        };
    }, [stock.symbol]);

    const priceDiff = price - previousPrice;
    const isPositive = priceDiff >= 0;
    const priceChangePercent = previousPrice === 0 ? 0 : (priceDiff / previousPrice) * 100;

    return (
        <div className="min-h-screen w-full bg-[#0a0807] text-white">
            {/* Single subtle background glow */}
            <div className="fixed inset-0 bg-gradient-to-br from-[#1a1410] via-[#0a0807] to-[#0d0b0a] pointer-events-none" />
            <div className="fixed top-[-30%] right-[-20%] w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-30%] left-[-20%] w-[400px] h-[400px] bg-orange-600/3 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6">
                {/* Top Navigation Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 py-2 sm:py-3 border-b border-orange-500/10 mb-4 sm:mb-6">
                    <Link to="/" className="flex items-center gap-1.5 sm:gap-2 text-orange-400/50 hover:text-orange-300 transition-all group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs sm:text-sm font-medium">Back</span>
                    </Link>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-1.5">
                            <span className={`inline-block w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
                            <span className="text-[10px] sm:text-xs text-orange-400/40 font-medium">
                                {isConnected ? 'Live' : 'Offline'}
                            </span>
                        </div>
                        <div className="w-px h-4 bg-orange-500/10" />
                        <div className="flex items-center gap-1 text-[10px] sm:text-xs text-orange-400/30">
                            <Clock className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                            <span className="hidden xs:inline">{lastUpdate.toLocaleTimeString()}</span>
                        </div>
                    </div>
                </div>

                {/* Stock Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-full 
                                      bg-gradient-to-br from-orange-500/20 to-orange-600/10 
                                      border border-orange-500/20">
                            <TrendingUp className="w-5 h-5 sm:w-7 sm:h-7 text-orange-400" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight 
                                           bg-gradient-to-r from-orange-200 via-orange-300 to-orange-400 
                                           bg-clip-text text-transparent">
                                {stock.symbol || 'AAPL'}
                            </h1>
                            <p className="text-orange-400/30 text-[10px] sm:text-sm mt-0.5">
                                {stock.name || 'Apple Inc.'} · NASDAQ
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-6">
                        <div className="text-right">
                            <div className="flex items-center gap-2 sm:gap-3 justify-end">
                                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-mono font-bold 
                                               bg-gradient-to-r from-orange-300 to-orange-500 
                                               bg-clip-text text-transparent">
                                    ${price ? price.toFixed(2) : "0.00"}
                                </h2>
                            </div>
                            <div className={`flex items-center justify-end gap-1 sm:gap-2 text-sm sm:text-base font-semibold mt-0.5 
                                           ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                <span className="text-base sm:text-lg">
                                    {isPositive ? '▲' : '▼'}
                                </span>
                                <span>{Math.abs(priceDiff).toFixed(2)}</span>
                                <span className="text-xs sm:text-sm opacity-70">
                                    ({Math.abs(priceChangePercent).toFixed(2)}%)
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
                    <div className="p-2.5 sm:p-4 rounded-xl bg-[#1a1410]/50 border border-orange-500/10">
                        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-orange-400/40 font-medium tracking-wider uppercase">
                            <DollarSign className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                            Open
                        </div>
                        <p className="text-base sm:text-2xl font-mono font-bold text-orange-200/80 mt-1">
                            ${currentCandleRef.current?.open ? currentCandleRef.current.open.toFixed(2) : price.toFixed(2)}
                        </p>
                    </div>

                    <div className="p-2.5 sm:p-4 rounded-xl bg-[#1a1410]/50 border border-orange-500/10">
                        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-orange-400/40 font-medium tracking-wider uppercase">
                            <TrendingUp className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                            High
                        </div>
                        <p className="text-base sm:text-2xl font-mono font-bold text-green-400 mt-1">
                            ${sessionHigh ? sessionHigh.toFixed(2) : price.toFixed(2)}
                        </p>
                    </div>

                    <div className="p-2.5 sm:p-4 rounded-xl bg-[#1a1410]/50 border border-orange-500/10">
                        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-orange-400/40 font-medium tracking-wider uppercase">
                            <TrendingDown className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                            Low
                        </div>
                        <p className="text-base sm:text-2xl font-mono font-bold text-red-400 mt-1">
                            ${sessionLow ? sessionLow.toFixed(2) : price.toFixed(2)}
                        </p>
                    </div>

                    <div className="p-2.5 sm:p-4 rounded-xl bg-[#1a1410]/50 border border-orange-500/10">
                        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-orange-400/40 font-medium tracking-wider uppercase">
                            <BarChart3 className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                            Volume
                        </div>
                        <p className="text-base sm:text-2xl font-mono font-bold text-orange-300/80 mt-1">
                            {volume ? volume.toLocaleString() : '1.2M'}
                        </p>
                    </div>
                </div>

                {/* Chart Container */}
                <div className="relative rounded-2xl overflow-hidden bg-[#0a0807] border border-orange-500/10">
                    <div ref={chartContainerRef} className="w-full" style={{ height: '420px', minHeight: '300px' }} />

                    {/* Chart Overlay */}
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                        <div className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-[#0a0807]/80 backdrop-blur-sm border border-orange-500/10">
                            <Zap className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-orange-400/50" />
                            <span className="text-[8px] sm:text-[10px] text-orange-400/30 font-mono tracking-wider">REAL-TIME</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Info */}
                <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-orange-500/10 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-orange-400/30">
                        <span className="flex items-center gap-1">
                            <Activity className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                            <span className="hidden xs:inline">Real-time</span>
                        </span>
                        <span className="w-px h-3 sm:h-4 bg-orange-500/10" />
                        <span className="hidden xs:inline">Updated: {lastUpdate.toLocaleTimeString()}</span>
                        <span className="w-px h-3 sm:h-4 bg-orange-500/10" />
                        <span className="flex items-center gap-1">
                            <Shield className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                            <span className="hidden xs:inline">Encrypted</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-[8px] sm:text-[10px] text-orange-400/20 font-mono tracking-widest">
                        <span>✦ WEBSOCKET</span>
                        <span className="w-px h-3 bg-orange-500/10" />
                        <span className="flex items-center gap-1">
                            <Globe className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                            <span className="hidden xs:inline">LIVE</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StockDetails;