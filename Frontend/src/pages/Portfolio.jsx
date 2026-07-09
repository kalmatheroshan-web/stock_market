import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Wallet, BarChart3,
  ArrowRight, Zap, Shield, Clock, DollarSign, ArrowLeft,
  Award, Users, ChevronRight, PieChart as PieChartIcon,
  Download, Plus, Eye, Filter, Calendar
} from 'lucide-react';
import {
  LineChart, Line, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, AreaChart, PieChart, Pie,
  Cell, CartesianGrid
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

// ─── Mock Data ─────────────────────────────────────────────────────────────
const generatePortfolioValueHistory = () => {
  const data = [];
  let value = 20000;
  for (let i = 0; i < 30; i++) {
    value += (Math.random() - 0.5) * 600;
    value = Math.max(value, 15000);
    data.push({ date: `Day ${i + 1}`, value: Math.round(value) });
  }
  return data;
};

const generateHoldings = () => {
  const symbols = ['AAPL', 'TSLA', 'GOOGL', 'MSFT', 'AMZN', 'NVDA'];
  const names = ['Apple Inc.', 'Tesla Inc.', 'Alphabet Inc.', 'Microsoft Corp.', 'Amazon.com Inc.', 'NVIDIA Corp.'];
  const colors = ['#fb923c', '#4ade80', '#60a5fa', '#a78bfa', '#f472b6', '#facc15'];
  return symbols.map((symbol, i) => {
    const shares = Math.floor(Math.random() * 100) + 10;
    const price = 100 + Math.random() * 300;
    const value = shares * price;
    const change = (Math.random() - 0.5) * 8;
    const changePercent = (change / price) * 100;
    return {
      symbol,
      name: names[i],
      shares,
      price,
      value,
      change,
      changePercent,
      color: colors[i % colors.length],
    };
  });
};

function Portfolio() {
  const [holdings, setHoldings] = useState([]);
  const [history] = useState(generatePortfolioValueHistory());
  const [timeFilter, setTimeFilter] = useState('1M');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHoldings(generateHoldings());
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // ─── Calculate totals ──────────────────────────────────────────────────
  const totalValue = useMemo(() => {
    return holdings.reduce((sum, h) => sum + h.value, 0);
  }, [holdings]);

  const dailyPnL = useMemo(() => {
    return holdings.reduce((sum, h) => sum + (h.change * h.shares), 0);
  }, [holdings]);

  const dailyReturnPercent = totalValue > 0 ? (dailyPnL / totalValue) * 100 : 0;
  const isPositive = dailyPnL >= 0;

  const totalValueAnimated = useCountUp(totalValue);
  const dailyPnLAnimated = useCountUp(Math.abs(dailyPnL));

  // ─── Pie chart data ─────────────────────────────────────────────────────
  const pieData = holdings.map(h => ({
    name: h.symbol,
    value: h.value,
    color: h.color,
  }));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0807]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-orange-400/30 text-sm font-medium tracking-wider">LOADING PORTFOLIO</p>
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
          className="flex flex-wrap items-center justify-between gap-3 py-4 border-b border-orange-500/10 mb-6 sm:mb-8"
        >
          <Link to="/" className="flex items-center gap-2 text-orange-400/50 hover:text-orange-300 transition-all group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium tracking-wide">Back</span>
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
          className="flex flex-wrap items-start justify-between gap-4 mb-6"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-orange-200 via-orange-300 to-orange-400 bg-clip-text text-transparent">
              Portfolio
            </h1>
            <p className="text-orange-400/30 text-sm mt-0.5">Track your holdings and performance</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-orange-400/30">
              {holdings.length} {holdings.length === 1 ? 'asset' : 'assets'}
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-[10px] font-medium text-green-400/80 tracking-wider">LIVE</span>
            </div>
          </div>
        </motion.div>

        {/* ─── Portfolio Summary Cards ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
        >
          <div className="p-4 sm:p-6 rounded-3xl bg-[#1a1410]/30 backdrop-blur-xl border border-orange-500/10">
            <div className="flex items-center gap-2 text-orange-400/40 text-xs font-medium tracking-wider uppercase">
              <Wallet className="w-4 h-4" />
              Total Value
            </div>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-2xl sm:text-3xl font-bold text-orange-200/90 font-mono tracking-tight">
                ${totalValueAnimated.toLocaleString()}
              </span>
            </div>
            <div className={`flex items-center gap-1 mt-1 text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{isPositive ? '+' : ''}{dailyPnLAnimated.toFixed(2)}</span>
              <span className="text-orange-400/30 text-xs">today</span>
            </div>
          </div>

          <div className="p-4 sm:p-6 rounded-3xl bg-[#1a1410]/30 backdrop-blur-xl border border-orange-500/10">
            <div className="flex items-center gap-2 text-orange-400/40 text-xs font-medium tracking-wider uppercase">
              <Award className="w-4 h-4" />
              Daily Return
            </div>
            <div className={`text-2xl sm:text-3xl font-bold font-mono tracking-tight mt-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? '+' : ''}{dailyReturnPercent.toFixed(2)}%
            </div>
            <div className="w-full h-1.5 mt-2 bg-[#0d0b0a] rounded-full overflow-hidden">
              <div
                className={`h-full ${isPositive ? 'bg-green-400' : 'bg-red-400'} rounded-full transition-all duration-1000`}
                style={{ width: `${Math.min(Math.abs(dailyReturnPercent) * 2, 100)}%` }}
              />
            </div>
          </div>

          <div className="p-4 sm:p-6 rounded-3xl bg-[#1a1410]/30 backdrop-blur-xl border border-orange-500/10 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 text-orange-400/40 text-xs font-medium tracking-wider uppercase">
              <Calendar className="w-4 h-4" />
              YTD Return
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-orange-300/80 font-mono tracking-tight mt-1">
              +24.8%
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs text-orange-400/30">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span>Outperforming S&P 500</span>
            </div>
          </div>
        </motion.div>

        {/* ─── Chart & Allocation ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 p-4 sm:p-6 rounded-3xl bg-[#1a1410]/30 backdrop-blur-xl border border-orange-500/10"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <span className="text-sm font-medium text-orange-400/60 tracking-wider uppercase flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Performance
              </span>
              <div className="flex gap-1 sm:gap-2">
                {['1W', '1M', '3M', '1Y'].map((label) => (
                  <button
                    key={label}
                    onClick={() => setTimeFilter(label)}
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium transition-all ${timeFilter === label
                      ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                      : 'text-orange-400/30 hover:text-orange-300/70'
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-40 sm:h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="portfolioValueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fb923c" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#fb923c" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,140,0,0.06)" />
                  <XAxis dataKey="date" hide />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1410',
                      borderColor: 'rgba(255,140,0,0.2)',
                      borderRadius: '12px',
                      color: '#d4c5b8',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#fb923c"
                    strokeWidth={2}
                    fill="url(#portfolioValueGradient)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* ─── Allocation Pie Chart ──────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="p-4 sm:p-6 rounded-3xl bg-[#1a1410]/30 backdrop-blur-xl border border-orange-500/10 flex flex-col items-center"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-orange-400/60 tracking-wider uppercase w-full mb-2">
              <PieChartIcon className="w-4 h-4" />
              Allocation
            </div>
            {holdings.length > 0 ? (
              <>
                <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={65}
                        paddingAngle={2}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mt-3">
                  {pieData.slice(0, 4).map((entry) => (
                    <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-orange-200/60">{entry.name}</span>
                      <span className="text-orange-400/30">
                        ({((entry.value / totalValue) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  ))}
                  {pieData.length > 4 && (
                    <div className="text-xs text-orange-400/30">+{pieData.length - 4} more</div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-orange-400/30">
                <PieChartIcon className="w-12 h-12 opacity-20" />
                <span className="text-sm mt-2">No holdings</span>
              </div>
            )}
          </motion.div>
        </div>

        {/* ─── Holdings Table ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl bg-[#1a1410]/30 backdrop-blur-xl border border-orange-500/10 overflow-hidden"
        >
          <div className="p-3 sm:p-4 border-b border-orange-500/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-orange-400/40" />
              <span className="text-sm font-medium text-orange-400/60 tracking-wider uppercase">Holdings</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1.5 rounded-lg hover:bg-orange-500/10 text-orange-400/30 hover:text-orange-300 transition-colors">
                <Filter className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-xs font-medium text-orange-300/70 hover:bg-orange-500/20 transition-all">
                <Download className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Export</span>
              </button>
            </div>
          </div>

          {holdings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mb-3">
                <BarChart3 className="w-8 h-8 text-orange-400/30" />
              </div>
              <h3 className="text-lg font-semibold text-orange-200/60">No holdings</h3>
              <p className="text-orange-400/30 text-sm">Start trading to build your portfolio.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] sm:min-w-full">
                <thead>
                  <tr className="border-b border-orange-500/10">
                    <th className="px-3 sm:px-4 py-2.5 text-left text-xs font-medium text-orange-400/40 uppercase tracking-wider">Asset</th>
                    <th className="px-3 sm:px-4 py-2.5 text-right text-xs font-medium text-orange-400/40 uppercase tracking-wider">Shares</th>
                    <th className="px-3 sm:px-4 py-2.5 text-right text-xs font-medium text-orange-400/40 uppercase tracking-wider">Price</th>
                    <th className="px-3 sm:px-4 py-2.5 text-right text-xs font-medium text-orange-400/40 uppercase tracking-wider">Value</th>
                    <th className="px-3 sm:px-4 py-2.5 text-right text-xs font-medium text-orange-400/40 uppercase tracking-wider">Change</th>
                    <th className="px-3 sm:px-4 py-2.5 text-right text-xs font-medium text-orange-400/40 uppercase tracking-wider hidden md:table-cell">Allocation</th>
                    <th className="px-3 sm:px-4 py-2.5 text-right text-xs font-medium text-orange-400/40 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((item, index) => {
                    const allocation = (item.value / totalValue) * 100;
                    return (
                      <motion.tr
                        key={item.symbol}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="border-b border-orange-500/5 hover:bg-orange-500/5 transition-colors group"
                      >
                        <td className="px-3 sm:px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: item.color + '33', color: item.color }}>
                              {item.symbol.slice(0, 2)}
                            </div>
                            <div>
                              <Link
                                to={`/stock/${item.symbol}`}
                                className="font-semibold text-orange-200/90 hover:text-orange-300 transition-colors text-sm sm:text-base"
                              >
                                {item.symbol}
                              </Link>
                              <span className="text-xs text-orange-400/30 block sm:hidden">{item.name}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 py-2.5 text-right text-sm text-orange-200/70 font-mono">{item.shares}</td>
                        <td className="px-3 sm:px-4 py-2.5 text-right font-mono text-sm text-orange-200/70">${item.price.toFixed(2)}</td>
                        <td className="px-3 sm:px-4 py-2.5 text-right font-mono font-semibold text-orange-200/80">${item.value.toFixed(2)}</td>
                        <td className="px-3 sm:px-4 py-2.5 text-right">
                          <div className={`flex items-center justify-end gap-1 text-sm font-semibold ${item.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {item.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            <span>{item.change >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%</span>
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 py-2.5 text-right hidden md:table-cell">
                          <div className="flex items-center justify-end gap-1">
                            <div className="w-16 sm:w-20 h-1.5 bg-[#0d0b0a] rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${Math.min(allocation, 100)}%`, backgroundColor: item.color }}
                              />
                            </div>
                            <span className="text-xs text-orange-400/30 font-mono">{allocation.toFixed(1)}%</span>
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 py-2.5 text-right">
                          <Link
                            to={`/stock/${item.symbol}`}
                            className="p-1.5 rounded-lg hover:bg-orange-500/10 text-orange-400/30 hover:text-orange-300 transition-colors inline-block"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* ─── Quick Actions ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4"
        >
          <Link
            to="/trade"
            className="flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-[#0d0b0a] font-semibold shadow-lg shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300 text-sm sm:text-base"
          >
            <Plus className="w-4 h-4" />
            Trade
          </Link>
          <Link
            to="/deposit"
            className="flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-full bg-[#1a1410]/50 border border-orange-500/10 hover:border-orange-500/30 transition-all hover:shadow-lg hover:shadow-orange-500/10"
          >
            <Wallet className="w-4 h-4 text-orange-400/60" />
            <span className="text-sm font-medium text-orange-200/60 hover:text-orange-200/80">Deposit</span>
          </Link>
          <button
            className="flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-full bg-[#1a1410]/50 border border-orange-500/10 hover:border-orange-500/30 transition-all hover:shadow-lg hover:shadow-orange-500/10"
          >
            <Download className="w-4 h-4 text-orange-400/60" />
            <span className="text-sm font-medium text-orange-200/60 hover:text-orange-200/80">Export Report</span>
          </button>
        </motion.div>

        {/* ─── Footer ────────────────────────────────────────────────────────── */}
        <div className="mt-10 pt-6 border-t border-orange-500/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-orange-400/20">
            <span>© 2026 TradePro</span>
            <span className="w-px h-3 bg-orange-500/10" />
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span className="hidden xs:inline">End-to-end encrypted</span>
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
}

export default Portfolio;