import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp, Shield, Zap, Users, Award, Globe,
  Sparkles, ArrowRight, CheckCircle, Mail, Phone, MapPin,
  Link as Github, Link as Twitter, Link as Youtube, Clock, BarChart3, LineChart,
  PieChart, Target, Heart, Eye, Lightbulb, Coffee
} from 'lucide-react';
import Navbar from './Navbar';
import { useSelector } from 'react-redux';

function About() {
  const [scrolled, setScrolled] = useState(false);
  const particlesRef = useRef(null);
  const { user } = useSelector(state => state.auth);

  // ─── Particle Animation (same as Home) ──────────────────────────────────
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
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.3 + 0.1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 140, 0, ${this.opacity})`;
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 20000), 100);
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    const connectParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 120) {
            const opacity = (1 - distance / 120) * 0.15;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 140, 0, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      connectParticles();
      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // ─── Scroll effect ──────────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ─── Company Values ──────────────────────────────────────────────────────
  const values = [
    { icon: Shield, title: 'Security First', desc: 'Bank-grade encryption and multi-layer security protocols.' },
    { icon: Zap, title: 'Lightning Speed', desc: 'Sub-millisecond execution with zero latency.' },
    { icon: Globe, title: 'Global Access', desc: 'Trade across 50+ exchanges in 30+ countries.' },
    { icon: Users, title: 'Community Driven', desc: 'Built by traders, for traders with active community support.' },
    { icon: Award, title: 'Transparency', desc: 'Clear pricing, real-time data, and full audit trails.' },
    { icon: Heart, title: 'User First', desc: '24/7 dedicated support and continuous product improvement.' },
  ];

  // ─── Team Members (mock) ──────────────────────────────────────────────
  const team = [
    { name: 'Roshan Kalam', role: 'CEO & Co-Founder', avatar: 'RK', bio: 'Former hedge fund manager with 15+ years in fintech.' },
    { name: 'Priya Sharma', role: 'CTO', avatar: 'PS', bio: 'Ex-Google engineer, expert in low-latency systems.' },
    { name: 'Amit Patel', role: 'Head of Product', avatar: 'AP', bio: 'Product leader with a passion for intuitive trading UX.' },
    { name: 'Sneha Reddy', role: 'Head of Trading', avatar: 'SR', bio: 'Quant trader with experience at top investment banks.' },
  ];

  // ─── Stats ──────────────────────────────────────────────────────────────
  const stats = [
    { value: '$4.2B+', label: 'Trading Volume (24h)' },
    { value: '99.99%', label: 'Platform Uptime' },
    { value: '2M+', label: 'Active Users' },
    { value: '50+', label: 'Global Exchanges' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0807] via-[#1a1410] to-[#0d0b0a] text-white overflow-x-hidden">

      {/* ─── Background Layers ────────────────────────────────────────── */}
      <canvas ref={particlesRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" />
      <div className="fixed top-[-20%] right-[-10%] w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[-30%] left-[-10%] w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-400/3 rounded-full blur-[180px] pointer-events-none" />
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc0IiBudW1PY3RhdmVzPSIzIiAvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNmKSIgb3BhY2l0eT0iMC4xIiAvPjwvc3ZnPg==')] bg-repeat" />

      {/* ─── Navbar ────────────────────────────────────────────────────── */}
      <Navbar scrolled={scrolled} />

      {/* ─── Hero Section ──────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 backdrop-blur-sm mb-6">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-xs font-medium text-orange-400/80 tracking-wide">About Us</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
            Building the Future of{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 animate-shimmer bg-[length:200%_auto]">
              Finance & Trading
            </span>
          </h1>
          <p className="text-lg text-orange-200/60 max-w-2xl mx-auto mt-4 font-light leading-relaxed">
            We're a team of passionate engineers, traders, and designers on a mission to democratize access to global financial markets with cutting-edge technology.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link to="/signup" className="group px-8 py-3.5 rounded-full font-semibold text-sm bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-[#0d0b0a] shadow-lg shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300 flex items-center gap-2">
              Join Our Community
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-8 py-3.5 rounded-full font-semibold text-sm border border-orange-500/30 text-orange-200/80 hover:bg-orange-500/10 transition-all">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* ─── Mission & Vision ────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-orange-500/10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-sm font-medium text-orange-400/60 tracking-wider uppercase">Our Mission</span>
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-300 to-orange-500 bg-clip-text text-transparent">
              Empowering Every Trader
            </h2>
            <p className="text-orange-200/60 leading-relaxed">
              We believe that financial tools should be accessible, transparent, and powerful. Our platform levels the playing field, giving retail traders the same advanced capabilities as institutional investors.
            </p>
            <div className="flex items-center gap-3 text-sm text-orange-200/50">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span>Transparent pricing with zero hidden fees</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-orange-200/50">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span>Real-time data from 50+ global exchanges</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-orange-200/50">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span>Advanced tools built for both beginners and pros</span>
            </div>
          </div>
          <div className="relative p-8 rounded-3xl bg-gradient-to-br from-[#1a1410]/30 to-[#0a0807]/30 backdrop-blur-sm border border-orange-500/10 hover:border-orange-500/30 transition-all duration-300">
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-orange-500/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-orange-600/5 rounded-full blur-2xl" />
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-xl bg-[#0d0b0a]/50 border border-orange-500/10">
                <TrendingUp className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-200/90">50+</div>
                <div className="text-xs text-orange-400/30">Exchanges</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-[#0d0b0a]/50 border border-orange-500/10">
                <Users className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-200/90">2M+</div>
                <div className="text-xs text-orange-400/30">Active Users</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-[#0d0b0a]/50 border border-orange-500/10">
                <Zap className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-200/90">0.1ms</div>
                <div className="text-xs text-orange-400/30">Avg. Latency</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-[#0d0b0a]/50 border border-orange-500/10">
                <Shield className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-200/90">99.99%</div>
                <div className="text-xs text-orange-400/30">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Values ────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-orange-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-medium text-orange-400/60 tracking-wider uppercase">Our Values</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2 bg-gradient-to-r from-orange-300 to-orange-500 bg-clip-text text-transparent">
              What We Stand For
            </h2>
            <p className="text-orange-200/40 mt-4 max-w-2xl mx-auto">
              These core principles guide everything we do – from product development to customer support.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <div key={index} className="group p-6 rounded-2xl bg-gradient-to-br from-[#1a1410]/30 to-[#0a0807]/30 backdrop-blur-sm border border-orange-500/10 hover:border-orange-500/30 transition-all duration-500 hover:shadow-[0_0_60px_rgba(255,120,0,0.05)] hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-orange-200/90 mb-2">{value.title}</h3>
                <p className="text-sm text-orange-200/40 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Team ──────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-orange-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-medium text-orange-400/60 tracking-wider uppercase">Team</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2 bg-gradient-to-r from-orange-300 to-orange-500 bg-clip-text text-transparent">
              Meet the People Behind TradePro
            </h2>
            <p className="text-orange-200/40 mt-4 max-w-2xl mx-auto">
              A diverse group of experts united by a passion for finance and technology.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div key={index} className="group p-6 rounded-2xl bg-gradient-to-br from-[#1a1410]/30 to-[#0a0807]/30 backdrop-blur-sm border border-orange-500/10 hover:border-orange-500/30 transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,120,0,0.05)] text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/20 flex items-center justify-center text-xl font-bold text-orange-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  {member.avatar}
                </div>
                <h3 className="text-lg font-semibold text-orange-200/90">{member.name}</h3>
                <p className="text-sm text-orange-400/40">{member.role}</p>
                <p className="text-sm text-orange-200/40 mt-2 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats ────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-orange-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="p-6 rounded-2xl bg-gradient-to-br from-[#1a1410]/30 to-[#0a0807]/30 backdrop-blur-sm border border-orange-500/10 hover:border-orange-500/30 transition-all duration-300 text-center hover:shadow-[0_0_40px_rgba(255,120,0,0.05)]">
                <div className="text-3xl sm:text-4xl font-bold text-orange-400">{stat.value}</div>
                <div className="text-sm text-orange-200/40 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-orange-500/10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative p-12 rounded-3xl bg-gradient-to-br from-[#1a1410]/80 via-[#0d0b0a]/90 to-[#0a0807]/95 backdrop-blur-2xl border border-orange-500/20 shadow-[0_0_80px_rgba(255,120,0,0.05)] hover:border-orange-500/40 transition-all duration-500">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-500/5 via-transparent to-transparent pointer-events-none" />
            <div className="absolute -top-1/2 -right-1/2 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-300 to-orange-500 bg-clip-text text-transparent mb-4">
              Join the TradePro Community
            </h2>
            <p className="text-orange-200/40 max-w-2xl mx-auto mb-8">
              Be part of the next generation of traders. Sign up today and start your journey with us.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/signup" className="group px-8 py-3.5 rounded-full font-semibold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-[#0d0b0a] shadow-lg shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300 flex items-center gap-2">
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-8 py-3.5 rounded-full font-semibold border border-orange-500/30 text-orange-200/80 hover:bg-orange-500/10 transition-all duration-300">
                Contact Us
              </button>
            </div>
            <p className="text-xs text-orange-400/30 mt-6">No credit card required. 14-day free trial.</p>
          </div>
        </div>
      </section>

      {/* ─── Footer ────────────────────────────────────────────────────── */}
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
                <li><a href="#" className="hover:text-orange-400 transition-colors">About</a></li>
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

      {/* ─── Custom Animations ────────────────────────────────────────── */}
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

export default About;