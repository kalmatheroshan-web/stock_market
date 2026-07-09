import React, { useEffect, useRef, useState } from 'react';
import {
  TrendingUp, TrendingDown, BarChart3, Shield, Zap, Globe,
  Menu, X, ChevronDown, ArrowRight, Award, Sparkles,
  LineChart, PieChart, Users, Clock, CheckCircle,
  ExternalLink, Moon, Sun, Bell, User, Settings,
  Mail, Phone, MapPin, Link as Github, Link as Twitter, Link as Youtube
} from 'lucide-react';
import { Link } from "react-router-dom";
import Navbar from './Navbar';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import AuthenticatedHero from '../components/Auth/AuthenticatedHero';

function Home() {
  const [scrolled, setScrolled] = useState(false);
  const particlesRef = useRef(null);
  const { user } = useSelector(state => state.auth);

  // Market data simulation (same as before)
  const [marketData] = useState([
    { symbol: 'AAPL', price: 178.50, change: 2.35, changePercent: 1.34 },
    { symbol: 'GOOGL', price: 142.80, change: -1.20, changePercent: -0.83 },
    { symbol: 'MSFT', price: 415.20, change: 3.80, changePercent: 0.92 },
    { symbol: 'TSLA', price: 245.60, change: 8.40, changePercent: 3.54 },
    { symbol: 'AMZN', price: 185.30, change: -2.10, changePercent: -1.12 },
    { symbol: 'NVDA', price: 875.40, change: 15.20, changePercent: 1.77 },
  ]);

  // Features data
  const features = [
    { icon: Zap, title: 'Lightning Fast Execution', desc: 'Sub-millisecond order processing with minimal slippage' },
    { icon: Shield, title: 'Bank-Grade Security', desc: 'Multi-layer encryption with hardware security modules' },
    { icon: BarChart3, title: 'Advanced Analytics', desc: 'Real-time portfolio tracking with AI-powered insights' },
    { icon: Globe, title: 'Global Markets', desc: 'Access 50+ exchanges across 30+ countries' },
    { icon: LineChart, title: 'Smart Trading', desc: 'Automated strategies with backtesting capabilities' },
    { icon: Users, title: 'Community & Support', desc: '24/7 expert support and active trader community' },
  ];

  // Testimonials
  const testimonials = [
    { name: 'Sarah Chen', role: 'Hedge Fund Manager', content: 'The execution speed and reliability of this platform is unmatched. It\'s become an essential tool for our daily trading operations.', avatar: 'SC' },
    { name: 'Michael Rodriguez', role: 'Day Trader', content: 'I\'ve tried many platforms, but this one stands out with its intuitive interface and powerful analytics. My trading performance has improved significantly.', avatar: 'MR' },
    { name: 'Emily Thompson', role: 'Investment Analyst', content: 'The depth of market data and real-time insights provided are invaluable for making informed investment decisions.', avatar: 'ET' },
  ];

  // Stats
  const stats = [
    { value: '$4.2B+', label: '24h Trading Volume' },
    { value: '99.99%', label: 'Platform Uptime' },
    { value: '50+', label: 'Global Exchanges' },
    { value: '2M+', label: 'Active Users' },
  ];

  // Particle animation (unchanged)
  useEffect(() => {
    const canvas = particlesRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };

    class Particle {
      constructor() { /* ... same as before ... */ }
      // ... (keep particle code from original)
    }

    // (particle code unchanged)
    // ... 

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0807] via-[#1a1410] to-[#0d0b0a] text-white overflow-x-hidden">

      {/* ─── Enhanced Background Layers ────────────────────────────────── */}
      <canvas ref={particlesRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" />
      <div className="fixed top-[-20%] right-[-10%] w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[-30%] left-[-10%] w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-400/3 rounded-full blur-[180px] pointer-events-none" />
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc0IiBudW1PY3RhdmVzPSIzIiAvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNmKSIgb3BhY2l0eT0iMC4xIiAvPjwvc3ZnPg==')] bg-repeat" />

      {/* Navbar */}
      <Navbar scrolled={scrolled} />

      {/* ─── HERO SECTION ──────────────────────────────────────────────────── */}
      {user ? (
        <AuthenticatedHero />
      ) : (
        <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Hero Content */}
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 backdrop-blur-sm">
                  <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                  <span className="text-xs font-medium text-orange-400/80 tracking-wide">Next-Gen Trading Platform</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                  Trade the global markets with{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 animate-shimmer bg-[length:200%_auto]">
                    lightning speed
                  </span>
                </h1>

                <p className="text-lg text-orange-200/60 max-w-xl font-light leading-relaxed">
                  Access ultra-low latency execution, comprehensive portfolio analytics, and deep liquidity across thousands of digital assets and traditional equities.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link to="/signup" className="group px-8 py-3.5 rounded-full font-semibold text-sm bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-[#0d0b0a] shadow-lg shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300 flex items-center gap-2">
                    Start Trading Free
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <button className="px-8 py-3.5 rounded-full font-semibold text-sm border border-orange-500/30 text-orange-200/80 hover:bg-orange-500/10 transition-all">
                    View Demo
                  </button>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap items-center gap-6 text-xs text-orange-400/40">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>SEC Registered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>FDIC Insured</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>24/7 Support</span>
                  </div>
                </div>
              </div>

              {/* Hero Stats / Market Preview */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="p-4 rounded-xl bg-gradient-to-br from-[#1a1410]/50 to-[#0a0807]/50 border border-orange-500/10 backdrop-blur-sm hover:border-orange-500/30 transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,120,0,0.05)]">
                      <div className="text-xl font-bold text-orange-400">{stat.value}</div>
                      <div className="text-xs text-orange-200/40 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Market Ticker */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#1a1410]/50 to-[#0a0807]/50 border border-orange-500/10 backdrop-blur-sm hover:border-orange-500/30 transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-orange-400/60 tracking-wider">TOP GAINERS</span>
                    <span className="text-xs text-orange-400/30">Real-time</span>
                  </div>
                  <div className="space-y-2">
                    {marketData.slice(0, 3).map((stock, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-orange-500/5 transition-colors">
                        <div>
                          <span className="text-sm font-semibold text-orange-200/80">{stock.symbol}</span>
                          <span className="text-xs text-orange-400/40 ml-2">${stock.price.toFixed(2)}</span>
                        </div>
                        <div className={`flex items-center gap-1 text-sm font-semibold ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {stock.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          <span>{stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── FEATURES SECTION ────────────────────────────────────────────── */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-orange-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-medium text-orange-400/60 tracking-wider uppercase">Features</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2 bg-gradient-to-r from-orange-300 to-orange-500 bg-clip-text text-transparent">
              Built for Professional Traders
            </h2>
            <p className="text-orange-200/40 mt-4 max-w-2xl mx-auto">
              Everything you need to execute sophisticated trading strategies with confidence
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="group p-6 rounded-2xl bg-gradient-to-br from-[#1a1410]/30 to-[#0a0807]/30 backdrop-blur-sm border border-orange-500/10 hover:border-orange-500/30 transition-all duration-500 hover:shadow-[0_0_60px_rgba(255,120,0,0.05)] hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-orange-200/90 mb-2">{feature.title}</h3>
                <p className="text-sm text-orange-200/40 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MARKETS SECTION ──────────────────────────────────────────────── */}
      <section id="markets" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-orange-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-medium text-orange-400/60 tracking-wider uppercase">Markets</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2 bg-gradient-to-r from-orange-300 to-orange-500 bg-clip-text text-transparent">
              Live Market Overview
            </h2>
            <p className="text-orange-200/40 mt-4 max-w-2xl mx-auto">
              Real-time prices from global exchanges with advanced charting tools
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketData.map((stock, index) => (
              <Link
                key={index}
                to="/stockdetails"
                state={stock}
              >
                <div className="p-4 cursor-pointer rounded-xl bg-gradient-to-br from-[#1a1410]/30 to-[#0a0807]/30 backdrop-blur-sm border border-orange-500/10 hover:border-orange-500/30 transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,120,0,0.05)] group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-orange-200/80 group-hover:text-orange-300 transition-colors">{stock.symbol}</span>
                    <span className="text-xs text-orange-400/40">NASDAQ</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-xl font-bold text-orange-200/90 group-hover:text-orange-300 transition-colors">${stock.price.toFixed(2)}</span>
                    <div className={`flex items-center gap-1 text-sm font-semibold ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {stock.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span>{stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ────────────────────────────────────────────────── */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-orange-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-medium text-orange-400/60 tracking-wider uppercase">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2 bg-gradient-to-r from-orange-300 to-orange-500 bg-clip-text text-transparent">
              What Our Users Say
            </h2>
            <p className="text-orange-200/40 mt-4 max-w-2xl mx-auto">
              Join thousands of satisfied traders who trust our platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-6 rounded-2xl bg-gradient-to-br from-[#1a1410]/30 to-[#0a0807]/30 backdrop-blur-sm border border-orange-500/10 hover:border-orange-500/30 transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,120,0,0.05)] group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/20 flex items-center justify-center font-semibold text-orange-400 group-hover:scale-110 transition-transform duration-300">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-orange-200/90">{testimonial.name}</div>
                    <div className="text-xs text-orange-400/40">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-sm text-orange-200/60 leading-relaxed">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA SECTION ──────────────────────────────────────────────────── */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-orange-500/10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative p-12 rounded-3xl bg-gradient-to-br from-[#1a1410]/80 via-[#0d0b0a]/90 to-[#0a0807]/95 backdrop-blur-2xl border border-orange-500/20 shadow-[0_0_80px_rgba(255,120,0,0.05)] hover:border-orange-500/40 transition-all duration-500">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-500/5 via-transparent to-transparent pointer-events-none" />
            <div className="absolute -top-1/2 -right-1/2 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-300 to-orange-500 bg-clip-text text-transparent mb-4">
              Ready to Start Trading?
            </h2>
            <p className="text-orange-200/40 max-w-2xl mx-auto mb-8">
              Join thousands of traders who are already using our platform to execute trades with lightning speed and precision.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/signup" className="group px-8 py-3.5 rounded-full font-semibold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-[#0d0b0a] shadow-lg shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300 flex items-center gap-2">
                Start Free Trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-8 py-3.5 rounded-full font-semibold border border-orange-500/30 text-orange-200/80 hover:bg-orange-500/10 transition-all duration-300">
                Contact Sales
              </button>
            </div>
            <p className="text-xs text-orange-400/30 mt-6">No credit card required. 14-day free trial.</p>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-orange-500/10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/20">
                  <TrendingUp className="w-4 h-4 text-orange-400" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                  TradePro
                </span>
              </div>
              <p className="text-sm text-orange-200/40 leading-relaxed">
                Next-generation trading platform for modern investors and traders.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-orange-400/40 hover:text-orange-400 transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="text-orange-400/40 hover:text-orange-400 transition-colors">
                  <Github className="w-4 h-4" />
                </a>
                <a href="#" className="text-orange-400/40 hover:text-orange-400 transition-colors">
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-sm font-semibold text-orange-200/80 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-orange-200/40">
                <li><a href="#" className="hover:text-orange-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Documentation</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-semibold text-orange-200/80 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-orange-200/40">
                <li><Link to={"/about"} className="hover:text-orange-400 transition-colors">About</Link></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-semibold text-orange-200/80 mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-orange-200/40">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-orange-400/40" />
                  <span>kalamtheroshan@traderpro.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-orange-400/40" />
                  <span>+91 95128 - 98993</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-400/40" />
                  <span>Gujarati, India</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="mt-12 pt-8 border-t border-orange-500/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-orange-400/30">
            <div className="flex flex-wrap items-center gap-4">
              <span>© 2026 TradePro. All rights reserved.</span>
              <span className="w-px h-4 bg-orange-400/20" />
              <a href="#" className="hover:text-orange-400 transition-colors">Privacy Policy</a>
              <span className="w-px h-4 bg-orange-400/20" />
              <a href="#" className="hover:text-orange-400 transition-colors">Terms of Service</a>
            </div>
            <div className="flex items-center gap-2 text-orange-400/20">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ─── Custom Animations ────────────────────────────────────────────── */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 6s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
}

export default Home;