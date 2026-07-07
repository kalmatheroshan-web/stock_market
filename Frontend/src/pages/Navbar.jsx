import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { TrendingUp, Menu, X } from 'lucide-react';

const Navbar = ({ scrolled }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a0807]/90 backdrop-blur-2xl border-b border-orange-500/10' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 cursor-pointer">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/20">
                            <TrendingUp className="w-4 h-4 text-orange-400" />
                        </div>
                        <span className="text-lg font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                            TradePro
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm text-orange-200/60 hover:text-orange-400 transition-colors">Features</a>
                        <a href="#markets" className="text-sm text-orange-200/60 hover:text-orange-400 transition-colors">Markets</a>
                        <a href="#testimonials" className="text-sm text-orange-200/60 hover:text-orange-400 transition-colors">Testimonials</a>
                        <a href="#pricing" className="text-sm text-orange-200/60 hover:text-orange-400 transition-colors">Pricing</a>
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/login" className="text-sm text-orange-200/60 hover:text-orange-400 transition-colors">
                            Login
                        </Link>
                        <Link to="/signup" className="px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-[#0d0b0a] font-semibold text-sm transition-all hover:scale-105 shadow-lg shadow-orange-500/30">
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-orange-200/60 hover:text-orange-400 transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden bg-[#0a0807]/95 backdrop-blur-2xl border-b border-orange-500/10">
                    <div className="px-4 py-6 space-y-4">
                        <a href="#features" className="block text-orange-200/60 hover:text-orange-400 transition-colors">Features</a>
                        <a href="#markets" className="block text-orange-200/60 hover:text-orange-400 transition-colors">Markets</a>
                        <a href="#testimonials" className="block text-orange-200/60 hover:text-orange-400 transition-colors">Testimonials</a>
                        <a href="#pricing" className="block text-orange-200/60 hover:text-orange-400 transition-colors">Pricing</a>
                        <div className="pt-4 border-t border-orange-500/10 space-y-3">
                            <Link to="/login" className="block w-full text-orange-200/60 hover:text-orange-400 transition-colors">
                                Login
                            </Link>
                            <Link to="/signup" className="block w-full px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-[#0d0b0a] font-semibold text-center transition-all">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;