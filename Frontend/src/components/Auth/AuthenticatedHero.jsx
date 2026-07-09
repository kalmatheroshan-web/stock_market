import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    TrendingUp, TrendingDown, Wallet, BarChart3,
    ArrowRight, Zap, Shield, Clock, DollarSign,
    Award, Users, ChevronRight, Sparkles, Plus,
    Minus, Eye, Star, Gift, Bell, Search,
    Filter, Settings, Share2
} from 'lucide-react';
import {
    LineChart, Line, Area, XAxis, YAxis, Tooltip,
    ResponsiveContainer, AreaChart, CartesianGrid,
} from 'recharts';

// ─── Animated Counter ──────────────────────────────────────────────────────
const useCountUp = (target, duration = 2000) => {
    const [count, setCount] = React.useState(0);
    React.useEffect(() => {
        if (target === 0) return;
        let startTime = null;
        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
            else setCount(target);
        };
        requestAnimationFrame(animate);
    }, [target, duration]);
    return count;
};

// ─── Mock data for portfolio chart ────────────────────────────────────────
const generatePortfolioData = () => {
    const data = [];
    let value = 20000;
    for (let i = 0; i < 30; i++) {
        value += (Math.random() - 0.5) * 800;
        value = Math.max(value, 15000);
        data.push({ time: i, value: Math.round(value) });
    }
    return data;
};

const portfolioData = generatePortfolioData();

// ─── Mock ticker data ──────────────────────────────────────────────────────
const tickerData = [
    { symbol: 'AAPL', price: 178.50, change: 1.2, volume: 42.5 },
    { symbol: 'TSLA', price: 245.20, change: -0.8, volume: 18.3 },
    { symbol: 'GOOGL', price: 141.80, change: 0.5, volume: 22.1 },
    { symbol: 'MSFT', price: 378.90, change: 2.1, volume: 35.7 },
    { symbol: 'AMZN', price: 185.30, change: -0.3, volume: 28.9 },
];

const AuthenticatedHero = ({ user }) => {
    // ─── User stats ──────────────────────────────────────────────────────────
    const stats = useMemo(() => ({
        portfolioValue: 24580.50,
        dailyPnL: 342.20,
        winRate: 68,
        totalTrades: 142,
        activePositions: 8,
        availableBalance: 12340.75,
    }), []);

    const portfolioValue = useCountUp(stats.portfolioValue);
    const dailyPnL = useCountUp(Math.abs(stats.dailyPnL));
    const winRate = useCountUp(stats.winRate);
    const isPositive = stats.dailyPnL >= 0;

    // ─── Quick actions ──────────────────────────────────────────────────────
    const actions = [
        { label: 'Trade', icon: TrendingUp, href: '/trade', color: 'orange' },
        { label: 'Deposit', icon: Wallet, href: '/deposit', color: 'blue' },
        { label: 'Portfolio', icon: BarChart3, href: '/portfolio', color: 'purple' },
        { label: 'Watchlist', icon: Eye, href: '/watchlist', color: 'green' },
    ];

    return (
        <section className="relative pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* ─── Premium Background Layers ───────────────────────────────────── */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a0807] via-[#1a1410] to-[#0a0807] pointer-events-none" />
            <div className="absolute top-[-40%] right-[-20%] w-[800px] h-[800px] bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent rounded-full blur-[180px] pointer-events-none" />
            <div className="absolute bottom-[-40%] left-[-20%] w-[700px] h-[700px] bg-gradient-to-tr from-orange-600/5 via-pink-500/5 to-transparent rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-orange-400/2 rounded-full blur-[250px] pointer-events-none" />

            {/* ─── Subtle Noise Texture ────────────────────────────────────────── */}
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc0IiBudW1PY3RhdmVzPSIzIiAvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNmKSIgb3BhY2l0eT0iMC4xIiAvPjwvc3ZnPg==')] bg-repeat" />

            <div className="relative max-w-7xl mx-auto">
                {/* ─── Top Bar ────────────────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-wrap items-start sm:items-center justify-between gap-3 mb-6 sm:mb-10"
                >
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight truncate">
                                Welcome back,{' '}
                                <span className="bg-gradient-to-r from-orange-200 via-orange-300 to-orange-400 bg-clip-text text-transparent">
                                    {user?.name || 'Trader'}
                                </span>
                            </h1>
                            <div className="flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-green-500/10 border border-green-500/20 backdrop-blur-sm flex-shrink-0">
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                <span className="text-[9px] sm:text-[10px] font-medium text-green-400/80 tracking-wider">LIVE</span>
                            </div>
                        </div>
                        <p className="text-orange-400/30 text-xs sm:text-sm mt-0.5 flex flex-wrap items-center gap-1 sm:gap-2">
                            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                            <span className="hidden xs:inline w-px h-3 bg-orange-500/10" />
                            <span className="flex items-center gap-1">
                                <span className={`inline-block w-1.5 h-1.5 rounded-full ${new Date().getHours() >= 9 && new Date().getHours() < 16 ? 'bg-green-400' : 'bg-red-400'}`} />
                                <span className="hidden xs:inline">Market {new Date().getHours() >= 9 && new Date().getHours() < 16 ? 'Open' : 'Closed'}</span>
                            </span>
                        </p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                        <button className="relative p-1.5 sm:p-2 rounded-full bg-[#1a1410]/50 border border-orange-500/10 hover:border-orange-500/30 transition-all hover:shadow-lg hover:shadow-orange-500/10">
                            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400/40 hover:text-orange-300 transition-colors" />
                            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full text-[7px] sm:text-[8px] font-bold text-[#0a0807] flex items-center justify-center">3</span>
                        </button>
                        <div className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-[#1a1410]/50 border border-orange-500/10 backdrop-blur-sm">
                            <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-400/40" />
                            <span className="text-[9px] sm:text-[10px] text-orange-400/30 font-medium tracking-wider">SECURE</span>
                        </div>
                    </div>
                </motion.div>

                {/* ─── Main Grid ──────────────────────────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                    {/* Left Column (2/3 width) */}
                    <div className="lg:col-span-2 space-y-4 md:space-y-6">
                        {/* Portfolio Card with Chart */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                            className="relative p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#1a1410]/80 to-[#0a0807]/80 backdrop-blur-2xl border border-orange-500/10 hover:border-orange-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10 overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                            <div className="flex flex-wrap items-start justify-between gap-3 mb-4 sm:mb-6">
                                <div>
                                    <div className="flex items-center gap-2 text-orange-400/40 text-[10px] sm:text-xs font-medium tracking-wider uppercase">
                                        <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        Total Portfolio Value
                                    </div>
                                    <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mt-1">
                                        <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-200/90 font-mono tracking-tight">
                                            ${portfolioValue.toLocaleString()}
                                        </span>
                                        <div className={`flex items-center gap-1 text-xs sm:text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                            {isPositive ? <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" /> : <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />}
                                            <span>{isPositive ? '+' : '-'}${dailyPnL.toFixed(2)}</span>
                                            <span className="text-orange-400/30 text-[10px] sm:text-xs">today</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    <button className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-[10px] sm:text-xs text-orange-300/70 hover:bg-orange-500/20 transition-all flex items-center gap-1">
                                        <Filter className="w-3 h-3" />
                                        <span>1W</span>
                                    </button>
                                    <button className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-orange-500/5 border border-orange-500/10 text-[10px] sm:text-xs text-orange-400/40 hover:bg-orange-500/10 transition-all flex items-center gap-1">
                                        <Filter className="w-3 h-3" />
                                        <span>1M</span>
                                    </button>
                                </div>
                            </div>

                            {/* ─── Mini Chart ────────────────────────────────────────────── */}
                            <div className="h-24 sm:h-32 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={portfolioData}>
                                        <defs>
                                            <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#fb923c" stopOpacity={0.3} />
                                                <stop offset="100%" stopColor="#fb923c" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#fb923c"
                                            strokeWidth={2}
                                            fill="url(#portfolioGradient)"
                                            dot={false}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Quick Stats below chart */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-orange-500/5">
                                <div>
                                    <div className="text-[9px] sm:text-[10px] text-orange-400/30 uppercase tracking-wider">Win Rate</div>
                                    <div className="text-base sm:text-lg font-bold text-green-400 font-mono">{winRate}%</div>
                                </div>
                                <div>
                                    <div className="text-[9px] sm:text-[10px] text-orange-400/30 uppercase tracking-wider">Trades</div>
                                    <div className="text-base sm:text-lg font-bold text-orange-200/80 font-mono">{stats.totalTrades}</div>
                                </div>
                                <div>
                                    <div className="text-[9px] sm:text-[10px] text-orange-400/30 uppercase tracking-wider">Active</div>
                                    <div className="text-base sm:text-lg font-bold text-orange-200/80 font-mono">{stats.activePositions}</div>
                                </div>
                                <div>
                                    <div className="text-[9px] sm:text-[10px] text-orange-400/30 uppercase tracking-wider">Balance</div>
                                    <div className="text-base sm:text-lg font-bold text-orange-200/80 font-mono">${stats.availableBalance.toLocaleString()}</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-wrap items-center gap-2 sm:gap-3"
                        >
                            {actions.map((action) => (
                                <Link
                                    key={action.label}
                                    to={action.href}
                                    className="group flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#1a1410]/50 border border-orange-500/10 hover:border-orange-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 text-sm"
                                >
                                    <action.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400/60 group-hover:text-orange-300 transition-colors" />
                                    <span className="text-xs sm:text-sm font-medium text-orange-200/60 group-hover:text-orange-200/80 transition-colors">
                                        {action.label}
                                    </span>
                                </Link>
                            ))}
                            <Link
                                to="/trade"
                                className="group flex items-center gap-1.5 sm:gap-2 px-5 sm:px-7 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-[#0d0b0a] font-semibold shadow-lg shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300 text-sm"
                            >
                                <span>Trade Now</span>
                                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    </div>

                    {/* Right Column (1/3 width) - Market Overview */}
                    <div className="space-y-4 md:space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15 }}
                            className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#1a1410]/80 to-[#0a0807]/80 backdrop-blur-2xl border border-orange-500/10"
                        >
                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                                <span className="text-[10px] sm:text-xs font-medium text-orange-400/60 tracking-wider uppercase flex items-center gap-2">
                                    <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-400" />
                                    Top Movers
                                </span>
                                <span className="text-[9px] sm:text-[10px] text-orange-400/30">Real-time</span>
                            </div>
                            <div className="space-y-2 sm:space-y-3">
                                {tickerData.slice(0, 4).map((stock, idx) => (
                                    <motion.div
                                        key={stock.symbol}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 + idx * 0.05 }}
                                        className="flex items-center justify-between p-1.5 sm:p-2 rounded-lg hover:bg-orange-500/5 transition-colors cursor-pointer group"
                                    >
                                        <div>
                                            <span className="text-xs sm:text-sm font-semibold text-orange-200/80 group-hover:text-orange-300 transition-colors">
                                                {stock.symbol}
                                            </span>
                                            <span className="text-[10px] sm:text-xs text-orange-400/40 ml-1 sm:ml-2 font-mono">
                                                ${stock.price.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className={`flex items-center gap-1 text-xs sm:text-sm font-semibold ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {stock.change >= 0 ? <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : <TrendingDown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                                            <span>{stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            <Link
                                to="/markets"
                                className="mt-3 sm:mt-4 flex items-center justify-center gap-1 text-[10px] sm:text-xs text-orange-400/30 hover:text-orange-300 transition-colors group"
                            >
                                <span>View all markets</span>
                                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </motion.div>

                        {/* Quick Search / Trade */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.25 }}
                            className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#1a1410]/80 to-[#0a0807]/80 backdrop-blur-2xl border border-orange-500/10"
                        >
                            <div className="flex items-center gap-2 mb-2 sm:mb-3">
                                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400/40" />
                                <span className="text-[10px] sm:text-xs font-medium text-orange-400/60 tracking-wider uppercase">Quick Trade</span>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Search symbol..."
                                    className="flex-1 px-3 py-1.5 sm:py-2 rounded-full bg-[#0d0b0a]/50 border border-orange-500/10 focus:border-orange-500/30 outline-none text-xs sm:text-sm text-orange-200/70 placeholder-orange-400/20 transition-all"
                                />
                                <button className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-[#0d0b0a] font-semibold text-xs sm:text-sm transition-all hover:scale-105 shadow-lg shadow-orange-500/30">
                                    Buy
                                </button>
                            </div>
                            <div className="flex items-center gap-3 sm:gap-4 mt-2 sm:mt-3 text-[10px] sm:text-xs text-orange-400/30">
                                <span className="flex items-center gap-1">
                                    <Plus className="w-3 h-3" /> Buy
                                </span>
                                <span className="flex items-center gap-1">
                                    <Minus className="w-3 h-3" /> Sell
                                </span>
                                <span className="flex items-center gap-1">
                                    <Star className="w-3 h-3" /> Watch
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* ─── Trust Badges ────────────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8 sm:mt-12 pt-4 sm:pt-6 border-t border-orange-500/10 flex flex-wrap items-center justify-center sm:justify-between gap-2 sm:gap-4 text-[10px] text-orange-400/20"
                >
                    <span className="flex items-center gap-1.5">
                        <Shield className="w-3 h-3 text-orange-400/30" />
                        <span className="hidden xs:inline">End-to-end encrypted</span>
                    </span>
                    <span className="hidden sm:inline w-px h-3 bg-orange-500/10" />
                    <span className="flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-orange-400/30" />
                        <span className="hidden xs:inline">Ultra-low latency</span>
                    </span>
                    <span className="hidden sm:inline w-px h-3 bg-orange-500/10" />
                    <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-orange-400/30" />
                        <span className="hidden xs:inline">AI-powered insights</span>
                    </span>
                    <span className="hidden sm:inline w-px h-3 bg-orange-500/10" />
                    <span className="flex items-center gap-1.5">
                        <Users className="w-3 h-3 text-orange-400/30" />
                        <span className="hidden xs:inline">500k+ active traders</span>
                    </span>
                </motion.div>
            </div>
        </section>
    );
};

export default AuthenticatedHero;