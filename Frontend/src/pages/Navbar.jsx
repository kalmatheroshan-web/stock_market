import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { TrendingUp, Menu, X, CircleUserRound } from "lucide-react";
import { useSelector } from "react-redux";

const Navbar = React.memo(({ scrolled }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user } = useSelector((state) => state.auth);

    return (
        <>
            <nav
                className={`
          fixed top-0 left-0 right-0 z-50 
          transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${scrolled
                        ? 'bg-[#0a0807]/80 backdrop-blur-2xl border-b border-orange-500/20 shadow-2xl shadow-orange-500/5'
                        : 'bg-transparent border-b border-transparent'}
        `}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 md:h-20">

                        {/* Logo with premium glow & rotation */}
                        <Link to="/" className="flex items-center gap-3 group cursor-pointer">
                            <div className="relative flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500/30 to-orange-600/10 border border-orange-400/30 shadow-lg shadow-orange-500/20 transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-105">
                                <TrendingUp className="w-5 h-5 text-orange-400 drop-shadow-[0_0_6px_rgba(251,146,60,0.6)] transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(251,146,60,0.9)]" />
                                <div className="absolute inset-0 rounded-2xl bg-orange-400/10 blur-xl group-hover:blur-2xl transition-all duration-500" />
                            </div>
                            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(251,146,60,0.15)]">
                                TradePro
                            </span>
                        </Link>

                        {/* Desktop Navigation - refined spacing & hover effects */}
                        <div className="hidden md:flex items-center gap-10">
                            {['Features', 'Markets', 'Testimonials', 'Pricing'].map((item) => (
                                <a
                                    key={item}
                                    href={`#${item.toLowerCase()}`}
                                    className="relative text-sm font-medium text-orange-200/60 hover:text-orange-300 transition-colors duration-300 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-orange-400 after:to-orange-500 after:transition-all after:duration-300 hover:after:w-full"
                                >
                                    {item}
                                </a>
                            ))}
                        </div>

                        {/* Desktop Actions - premium CTA with shimmer */}
                        <div className="hidden md:flex items-center gap-5">
                            {!user ? (
                                <>
                                    <Link
                                        to="/login"
                                        className="text-sm font-medium text-orange-200/60 hover:text-orange-300 transition-colors duration-300"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="relative px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-[#0d0b0a] font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/40 active:scale-95 overflow-hidden group"
                                    >
                                        <span className="relative z-10">Get Started</span>
                                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    </Link>
                                </>
                            ) : (
                                <Link
                                    to="/profile"
                                    className="text-orange-200/60 hover:text-orange-300 transition-colors duration-300"
                                >
                                    <CircleUserRound className="w-9 h-9 p-0.5 rounded-full ring-2 ring-orange-500/30 hover:ring-orange-400/60 transition-all duration-300 hover:scale-105" />
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Toggle - refined */}
                        <button
                            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl text-orange-200/60 hover:text-orange-300 hover:bg-orange-500/10 transition-all duration-300"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation - smooth slide-down with premium glass */}
                <div
                    className={`
            md:hidden overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
            ${isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
          `}
                >
                    <div className="bg-[#0a0807]/95 backdrop-blur-3xl border-t border-orange-500/10 shadow-2xl shadow-orange-500/5">
                        <div className="px-6 py-8 space-y-5">
                            {['Features', 'Markets', 'Testimonials', 'Pricing'].map((item) => (
                                <a
                                    key={item}
                                    href={`#${item.toLowerCase()}`}
                                    className="block text-base font-medium text-orange-200/60 hover:text-orange-300 transition-colors duration-300"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item}
                                </a>
                            ))}
                            <div className="pt-5 border-t border-orange-500/10 space-y-4">
                                {!user ? (
                                    <>
                                        <Link
                                            to="/login"
                                            className="block w-full text-center text-orange-200/60 hover:text-orange-300 transition-colors duration-300"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/signup"
                                            className="block w-full px-4 py-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-[#0d0b0a] font-semibold text-center transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/30 active:scale-95"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Get Started
                                        </Link>
                                    </>
                                ) : (
                                    <Link
                                        to="/profile"
                                        className="flex items-center justify-center gap-3 text-orange-200/60 hover:text-orange-300 transition-colors duration-300"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <CircleUserRound className="w-6 h-6" />
                                        <span className="font-medium">Profile</span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Optional: Extra glow behind navbar when scrolled */}
            {scrolled && (
                <div className="fixed top-0 left-0 w-full h-20 bg-orange-500/5 blur-3xl -z-10 pointer-events-none transition-opacity duration-700" />
            )}
        </>
    );
});

export default Navbar;