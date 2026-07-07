import React, { useState } from 'react';

function Header() {
  // Example state for market status (Open/Closed)
  const [isMarketOpen, setIsMarketOpen] = useState(true);

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-slate-900 border-b border-slate-800 text-slate-100 w-full">
      
      {/* Left: Branding & Logo */}
      <div className="flex items-center gap-3">
        <span className="text-2xl" role="img" aria-label="chart">📈</span>
        <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
          TradePulse
        </span>
        
        {/* Market Status Badge */}
        <span className={`ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider text-white transition-colors duration-300 ${
          isMarketOpen ? 'bg-emerald-500' : 'bg-rose-500'
        }`}>
          {isMarketOpen ? '● MARKET OPEN' : '● MARKET CLOSED'}
        </span>
      </div>

      {/* Middle: Navigation Links */}
      <nav className="hidden md:flex items-center gap-6">
        <a href="#dashboard" className="text-sm font-medium text-sky-400 transition-colors">Dashboard</a>
        <a href="#markets" className="text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors">Markets</a>
        <a href="#portfolio" className="text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors">Portfolio</a>
        <a href="#crypto" className="text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors">Crypto</a>
      </nav>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-5">
        {/* Notification Bell */}
        <button className="relative p-1.5 text-slate-400 hover:text-slate-200 transition-colors focus:outline-none" aria-label="Notifications">
          <span className="text-lg">🔔</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
        </button>

        {/* User Profile Summary */}
        <div className="flex items-center gap-3 pl-5 border-l border-slate-800">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
            alt="User avatar" 
            className="w-9 h-9 rounded-full object-cover border-2 border-sky-400/80"
          />
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold">Alex Morgan</span>
            <span className="text-[10px] text-sky-400 font-medium tracking-wide uppercase">Premium</span>
          </div>
        </div>
      </div>
      
    </header>
  );
}

export default Header;