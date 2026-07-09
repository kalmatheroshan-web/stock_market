import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Plus, X, TrendingUp, TrendingDown,
    BarChart3, Star, Trash2, Eye, ChevronDown,
    ChevronUp, ArrowLeft, Shield, Clock, Zap
} from 'lucide-react';
import {
    LineChart, Line, ResponsiveContainer
} from 'recharts';

// ─── Mock data generator ──────────────────────────────────────────────────
const generateWatchlistItems = () => {
    const symbols = ['AAPL', 'TSLA', 'GOOGL', 'MSFT', 'AMZN', 'NVDA', 'META', 'NFLX'];
    const names = [
        'Apple Inc.', 'Tesla Inc.', 'Alphabet Inc.', 'Microsoft Corp.',
        'Amazon.com Inc.', 'NVIDIA Corp.', 'Meta Platforms Inc.', 'Netflix Inc.'
    ];
    return symbols.map((symbol, i) => {
        const price = 100 + Math.random() * 300;
        const change = (Math.random() - 0.5) * 6;
        const changePercent = (change / price) * 100;
        // Generate random sparkline data (last 20 points)
        const sparkline = Array.from({ length: 20 }, () => price + (Math.random() - 0.5) * 20);
        return {
            symbol,
            name: names[i],
            price,
            change,
            changePercent,
            volume: Math.floor(Math.random() * 10000000) + 100000,
            sparkline,
            isFavorite: Math.random() > 0.5,
        };
    });
};

const Watchlist = () => {
    // ─── State ──────────────────────────────────────────────────────────────
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'symbol', direction: 'asc' });
    const [loading, setLoading] = useState(true);

    // ─── Load watchlist (simulate API) ──────────────────────────────────────
    useEffect(() => {
        const timer = setTimeout(() => {
            setItems(generateWatchlistItems());
            setLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    // ─── Add stock ──────────────────────────────────────────────────────────
    const handleAddStock = (symbol) => {
        const cleanSymbol = symbol.trim().toUpperCase();
        if (!cleanSymbol) return;
        if (items.some((item) => item.symbol === cleanSymbol)) {
            alert('Stock already in watchlist');
            return;
        }
        // Mock new stock – in real app, fetch from API
        const newItem = {
            symbol: cleanSymbol,
            name: cleanSymbol + ' Inc.',
            price: 100 + Math.random() * 200,
            change: (Math.random() - 0.5) * 4,
            changePercent: 0,
            volume: Math.floor(Math.random() * 10000000) + 100000,
            sparkline: Array.from({ length: 20 }, () => 100 + Math.random() * 50),
            isFavorite: false,
        };
        newItem.changePercent = (newItem.change / newItem.price) * 100;
        setItems([newItem, ...items]);
        setSearchQuery('');
    };

    // ─── Remove stock ──────────────────────────────────────────────────────
    const handleRemove = (symbol) => {
        if (window.confirm(`Remove ${symbol} from watchlist?`)) {
            setItems(items.filter((item) => item.symbol !== symbol));
        }
    };

    // ─── Toggle favorite ──────────────────────────────────────────────────
    const toggleFavorite = (symbol) => {
        setItems(items.map(item =>
            item.symbol === symbol ? { ...item, isFavorite: !item.isFavorite } : item
        ));
    };

    // ─── Sorting ───────────────────────────────────────────────────────────
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedItems = useMemo(() => {
        if (!items.length) return [];
        const sorted = [...items];
        sorted.sort((a, b) => {
            let aVal = a[sortConfig.key];
            let bVal = b[sortConfig.key];
            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }
            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
        return sorted;
    }, [items, sortConfig]);

    // ─── Filter by search ──────────────────────────────────────────────────
    const filteredItems = useMemo(() => {
        if (!searchQuery) return sortedItems;
        return sortedItems.filter(item =>
            item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [sortedItems, searchQuery]);

    // ─── Render sort icon ──────────────────────────────────────────────────
    const SortIcon = ({ column }) => {
        if (sortConfig.key !== column) return <ChevronDown className="w-3 h-3 opacity-30" />;
        return sortConfig.direction === 'asc'
            ? <ChevronUp className="w-3 h-3" />
            : <ChevronDown className="w-3 h-3" />;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0807]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
                    <p className="text-orange-400/30 text-sm font-medium tracking-wider">LOADING WATCHLIST</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[#0a0807] text-white overflow-hidden">
            {/* ─── Background Layers ────────────────────────────────────────────── */}
            <div className="fixed inset-0 bg-gradient-to-br from-[#1a1410] via-[#0a0807] to-[#0d0b0a] pointer-events-none" />
            <div className="fixed top-[-30%] right-[-20%] w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="fixed bottom-[-30%] left-[-20%] w-[500px] h-[500px] bg-orange-600/3 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-orange-400/2 rounded-full blur-[200px] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
                {/* ─── Navigation ──────────────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-wrap items-center justify-between gap-3 py-4 border-b border-orange-500/10 mb-8"
                >
                    <Link to="/" className="flex items-center gap-2 text-orange-400/50 hover:text-orange-300 transition-all group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium tracking-wide">Back to Dashboard</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1a1410]/60 border border-orange-500/10 backdrop-blur-sm">
                            <Shield className="w-3 h-3 text-orange-400/40" />
                            <span className="text-xs text-orange-400/30 font-medium tracking-wider">SECURE</span>
                        </div>
                    </div>
                </motion.div>

                {/* ─── Header ──────────────────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-wrap items-center justify-between gap-4 mb-6"
                >
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-orange-200 via-orange-300 to-orange-400 bg-clip-text text-transparent">
                            Watchlist
                        </h1>
                        <p className="text-orange-400/30 text-sm mt-0.5">Track your favorite stocks in real-time</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-orange-400/30">
                            {items.length} {items.length === 1 ? 'stock' : 'stocks'}
                        </span>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                            <span className="text-[10px] font-medium text-green-400/80 tracking-wider">LIVE</span>
                        </div>
                    </div>
                </motion.div>

                {/* ─── Search & Add ────────────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="mb-6 flex flex-wrap gap-3"
                >
                    <div className="flex-1 min-w-[200px] relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400/30" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search watchlist..."
                            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-[#1a1410]/50 border border-orange-500/10 focus:border-orange-500/30 outline-none text-sm text-orange-200/70 placeholder-orange-400/20 transition-all"
                        />
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Add symbol (e.g., AAPL)"
                            className="px-4 py-2.5 rounded-2xl bg-[#1a1410]/50 border border-orange-500/10 focus:border-orange-500/30 outline-none text-sm text-orange-200/70 placeholder-orange-400/20 transition-all w-40 sm:w-48"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddStock(e.target.value);
                            }}
                            id="add-symbol"
                        />
                        <button
                            onClick={() => {
                                const input = document.getElementById('add-symbol');
                                handleAddStock(input.value);
                                input.value = '';
                            }}
                            className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-[#0d0b0a] font-semibold text-sm transition-all hover:scale-105 shadow-lg shadow-orange-500/30"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add</span>
                        </button>
                    </div>
                </motion.div>

                {/* ─── Table ───────────────────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-3xl bg-[#1a1410]/30 backdrop-blur-xl border border-orange-500/10 overflow-hidden"
                >
                    {filteredItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                            <div className="w-20 h-20 rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
                                <BarChart3 className="w-10 h-10 text-orange-400/30" />
                            </div>
                            <h3 className="text-xl font-semibold text-orange-200/60">No stocks in watchlist</h3>
                            <p className="text-orange-400/30 text-sm mt-1 max-w-sm">
                                Add your first stock using the search bar above to start tracking.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-orange-500/10">
                                        <th className="px-4 py-3 text-left text-xs font-medium text-orange-400/40 uppercase tracking-wider cursor-pointer hover:text-orange-300 transition-colors" onClick={() => requestSort('symbol')}>
                                            <div className="flex items-center gap-1">
                                                Symbol <SortIcon column="symbol" />
                                            </div>
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-orange-400/40 uppercase tracking-wider hidden sm:table-cell">
                                            Name
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-orange-400/40 uppercase tracking-wider cursor-pointer hover:text-orange-300 transition-colors" onClick={() => requestSort('price')}>
                                            <div className="flex items-center justify-end gap-1">
                                                Price <SortIcon column="price" />
                                            </div>
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-orange-400/40 uppercase tracking-wider cursor-pointer hover:text-orange-300 transition-colors" onClick={() => requestSort('changePercent')}>
                                            <div className="flex items-center justify-end gap-1">
                                                Change <SortIcon column="changePercent" />
                                            </div>
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-orange-400/40 uppercase tracking-wider hidden lg:table-cell cursor-pointer hover:text-orange-300 transition-colors" onClick={() => requestSort('volume')}>
                                            <div className="flex items-center justify-end gap-1">
                                                Volume <SortIcon column="volume" />
                                            </div>
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-orange-400/40 uppercase tracking-wider hidden md:table-cell">
                                            Trend
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-orange-400/40 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredItems.map((item, index) => (
                                        <motion.tr
                                            key={item.symbol}
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.03 }}
                                            className="border-b border-orange-500/5 hover:bg-orange-500/5 transition-colors group"
                                        >
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => toggleFavorite(item.symbol)}
                                                        className="text-orange-400/30 hover:text-orange-400 transition-colors"
                                                    >
                                                        <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-orange-400 text-orange-400' : ''}`} />
                                                    </button>
                                                    <Link
                                                        to={`/stock/${item.symbol}`}
                                                        className="font-semibold text-orange-200/90 hover:text-orange-300 transition-colors"
                                                    >
                                                        {item.symbol}
                                                    </Link>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 hidden sm:table-cell text-sm text-orange-400/60">
                                                {item.name}
                                            </td>
                                            <td className="px-4 py-3 text-right font-mono font-bold text-orange-200/80">
                                                ${item.price.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className={`flex items-center justify-end gap-1 text-sm font-semibold ${item.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                    {item.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                                    <span>{item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}</span>
                                                    <span className="text-xs opacity-70">({item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%)</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right hidden lg:table-cell text-sm text-orange-400/40 font-mono">
                                                {(item.volume / 1000000).toFixed(1)}M
                                            </td>
                                            <td className="px-4 py-3 text-right hidden md:table-cell">
                                                <div className="w-20 h-8 ml-auto">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <LineChart data={item.sparkline.map((val, i) => ({ i, val }))}>
                                                            <Line
                                                                type="monotone"
                                                                dataKey="val"
                                                                stroke={item.change >= 0 ? '#4ade80' : '#f87171'}
                                                                strokeWidth={2}
                                                                dot={false}
                                                            />
                                                        </LineChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        to={`/stock/${item.symbol}`}
                                                        className="p-1.5 rounded-lg hover:bg-orange-500/10 text-orange-400/40 hover:text-orange-300 transition-colors"
                                                        title="View details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleRemove(item.symbol)}
                                                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-orange-400/30 hover:text-red-400 transition-colors"
                                                        title="Remove from watchlist"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>

                {/* ─── Footer ──────────────────────────────────────────────────────── */}
                <div className="mt-10 pt-6 border-t border-orange-500/10 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3 text-xs text-orange-400/20">
                        <span>© 2026 TradePro</span>
                        <span className="w-px h-3 bg-orange-500/10" />
                        <span className="flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            End-to-end encrypted
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="text-xs text-orange-400/30 hover:text-orange-300 transition-colors">Privacy</button>
                        <button className="text-xs text-orange-400/30 hover:text-orange-300 transition-colors">Security</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Watchlist;