import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    Eye, EyeOff, Mail, Lock, ArrowRight, Loader2, CheckCircle,
    AlertCircle, User, Shield, Sparkles, Fingerprint, Globe,
    TrendingUp, ArrowLeft, Zap, Award, BarChart3, Users,
    Check, X, Star
} from 'lucide-react';

function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordChecks, setPasswordChecks] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
    });
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
    });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [touched, setTouched] = useState({});
    const cardRef = useRef(null);
    const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

    // 3D Tilt Effect
    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        const handleMouseMove = (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            const rotateX = (y - 0.5) * 8;
            const rotateY = (x - 0.5) * -8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            setMousePosition({ x: x * 100, y: y * 100 });
        };

        const handleMouseLeave = () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        };

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            card.removeEventListener('mousemove', handleMouseMove);
            card.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    // Password strength checker
    useEffect(() => {
        const checks = {
            length: formData.password.length >= 8,
            uppercase: /[A-Z]/.test(formData.password),
            lowercase: /[a-z]/.test(formData.password),
            number: /\d/.test(formData.password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
        };
        setPasswordChecks(checks);

        const strength = Object.values(checks).filter(Boolean).length;
        setPasswordStrength(strength);
    }, [formData.password]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name) {
            newErrors.name = 'Full name is required';
        } else if (formData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (passwordStrength < 3) {
            newErrors.password = 'Password is too weak';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.agreeTerms) {
            newErrors.agreeTerms = 'You must agree to the terms';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        setSuccess(false);

        setTimeout(() => {
            setIsLoading(false);
            setSuccess(true);
            console.log('Sign up successful!', formData);
            setTimeout(() => setSuccess(false), 3000);
        }, 1500);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const getStrengthColor = () => {
        if (passwordStrength <= 1) return 'bg-red-500';
        if (passwordStrength === 2) return 'bg-orange-500';
        if (passwordStrength === 3) return 'bg-yellow-500';
        if (passwordStrength === 4) return 'bg-green-400';
        return 'bg-green-500';
    };

    const getStrengthText = () => {
        if (passwordStrength <= 1) return 'Weak';
        if (passwordStrength === 2) return 'Fair';
        if (passwordStrength === 3) return 'Good';
        if (passwordStrength === 4) return 'Strong';
        return 'Very Strong';
    };

    return (
        <div className="min-h-screen w-full bg-[#0a0807] text-white overflow-hidden">
            {/* Premium Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-[#0f0a08] via-[#0a0807] to-[#0d0b0a]" />
            <div className="fixed top-[-40%] right-[-20%] w-[600px] h-[600px] bg-orange-500/8 rounded-full blur-[150px] animate-pulse-slow" />
            <div className="fixed bottom-[-40%] left-[-20%] w-[500px] h-[500px] bg-orange-400/5 rounded-full blur-[130px] animate-pulse-slower" />
            <div className="fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-300/3 rounded-full blur-[200px]" />

            {/* Animated Particles Grid */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,rgba(255,140,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,140,0,0.02)_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none" />

            {/* Floating Elements */}
            <div className="fixed top-[20%] left-[5%] text-orange-400/5 animate-float-slow pointer-events-none">
                <BarChart3 className="w-16 h-16" />
            </div>
            <div className="fixed bottom-[30%] right-[5%] text-orange-400/5 animate-float-slower pointer-events-none">
                <Zap className="w-20 h-20" />
            </div>
            <div className="fixed top-[60%] left-[8%] text-orange-400/5 animate-float-slowest pointer-events-none">
                <Users className="w-12 h-12" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 py-6 flex items-center justify-center min-h-screen">
                <div className="w-full max-w-5xl grid lg:grid-cols-5 gap-0 lg:gap-8">

                    {/* Left Side - Value Proposition */}
                    <div className="hidden lg:flex lg:col-span-2 flex-col justify-center space-y-8 p-8">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-orange-400/60 text-sm font-medium tracking-wider">
                                <Sparkles className="w-4 h-4" />
                                <span>JOIN THE FUTURE OF TRADING</span>
                            </div>
                            <h2 className="text-4xl font-bold leading-tight">
                                Start Your
                                <span className="block bg-gradient-to-r from-orange-300 to-orange-500 bg-clip-text text-transparent">
                                    Trading Journey
                                </span>
                            </h2>
                            <p className="text-orange-400/40 text-sm leading-relaxed">
                                Join thousands of traders who are already using our platform to execute trades with lightning speed and precision.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3 group">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Zap className="w-4 h-4 text-orange-400" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-orange-200/80">Lightning Fast Execution</h4>
                                    <p className="text-xs text-orange-400/30">Sub-millisecond order processing</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 group">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Shield className="w-4 h-4 text-orange-400" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-orange-200/80">Bank-Grade Security</h4>
                                    <p className="text-xs text-orange-400/30">256-bit encryption with HSM</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 group">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Award className="w-4 h-4 text-orange-400" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-orange-200/80">Professional Tools</h4>
                                    <p className="text-xs text-orange-400/30">Advanced analytics & insights</p>
                                </div>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="flex items-center gap-6 pt-4 border-t border-orange-500/10">
                            <div className="text-xs">
                                <span className="text-orange-400 font-bold text-sm">4.2M+</span>
                                <span className="text-orange-400/30 block">Active Users</span>
                            </div>
                            <div className="w-px h-10 bg-orange-500/10" />
                            <div className="text-xs">
                                <span className="text-orange-400 font-bold text-sm">99.99%</span>
                                <span className="text-orange-400/30 block">Uptime</span>
                            </div>
                            <div className="w-px h-10 bg-orange-500/10" />
                            <div className="text-xs">
                                <span className="text-orange-400 font-bold text-sm">50+</span>
                                <span className="text-orange-400/30 block">Exchanges</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Sign Up Card with 3D Tilt */}
                    <div className="lg:col-span-3">
                        <div
                            ref={cardRef}
                            className="relative transition-transform duration-200 ease-out"
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            {/* Glow behind card */}
                            <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/20 via-orange-400/10 to-orange-500/20 blur-3xl opacity-50" />

                            <div className="relative bg-gradient-to-br from-[#1a1410]/95 via-[#0d0b0a]/98 to-[#0a0807]/98 
                              backdrop-blur-3xl backdrop-saturate-200
                              rounded-3xl p-6 sm:p-8
                              border border-orange-500/20 
                              shadow-[0_0_100px_rgba(255,120,0,0.05)]
                              hover:shadow-[0_0_150px_rgba(255,120,0,0.08)]
                              transition-all duration-700
                              overflow-hidden">

                                {/* Animated Border Gradient */}
                                <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-r from-orange-400/0 via-orange-400/30 to-orange-600/0 animate-border-flow" />

                                {/* Glass Reflection */}
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.05] via-transparent to-transparent pointer-events-none" />

                                {/* Dynamic Glow */}
                                <div
                                    className="absolute inset-0 rounded-3xl bg-radial-gradient pointer-events-none transition-opacity duration-300"
                                    style={{
                                        opacity: 0.1,
                                        background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255, 140, 0, 0.2), transparent 60%)`,
                                    }}
                                />

                                {/* Decorative Corners */}
                                <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-orange-400/20 rounded-tl-3xl opacity-30" />
                                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-orange-400/20 rounded-br-3xl opacity-30" />

                                <div className="relative">
                                    {/* Header */}
                                    <div className="text-center mb-6">
                                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-200 via-orange-300 to-orange-400 bg-clip-text text-transparent">
                                            Create Account
                                        </h1>
                                        <p className="text-orange-400/30 text-sm mt-1">
                                            Start your 14-day free trial today
                                        </p>
                                    </div>

                                    {/* Success Message */}
                                    {success && (
                                        <div className="mb-6 p-3 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3 animate-slide-down">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                                <CheckCircle className="w-4 h-4 text-green-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-green-400">Account Created!</p>
                                                <p className="text-xs text-green-400/60">Welcome to TradePro</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Form */}
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        {/* Full Name */}
                                        <div>
                                            <label className="text-xs font-medium text-orange-400/60 flex items-center gap-2 mb-1.5">
                                                <User className="w-3.5 h-3.5" />
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                onFocus={() => setFocusedField('name')}
                                                onBlur={() => { setFocusedField(null); handleBlur('name'); }}
                                                className={`w-full px-4 py-2.5 rounded-xl 
                                    bg-[#0a0807]/50 border-2 
                                    ${errors.name && touched.name ? 'border-red-500/50' :
                                                        focusedField === 'name' ? 'border-orange-400/60' : 'border-orange-500/20'}
                                    text-orange-200/90 placeholder-orange-400/30
                                    focus:outline-none focus:ring-2 
                                    ${errors.name && touched.name ? 'focus:ring-red-500/20' : 'focus:ring-orange-500/20'}
                                    focus:border-orange-500/40
                                    transition-all duration-300
                                    text-sm`}
                                                placeholder="John Doe"
                                            />
                                            {errors.name && touched.name && (
                                                <p className="text-xs text-red-400 flex items-center gap-1 mt-1 animate-slide-down">
                                                    <AlertCircle className="w-3 h-3" />
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="text-xs font-medium text-orange-400/60 flex items-center gap-2 mb-1.5">
                                                <Mail className="w-3.5 h-3.5" />
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                onFocus={() => setFocusedField('email')}
                                                onBlur={() => { setFocusedField(null); handleBlur('email'); }}
                                                className={`w-full px-4 py-2.5 rounded-xl 
                                    bg-[#0a0807]/50 border-2 
                                    ${errors.email && touched.email ? 'border-red-500/50' :
                                                        focusedField === 'email' ? 'border-orange-400/60' : 'border-orange-500/20'}
                                    text-orange-200/90 placeholder-orange-400/30
                                    focus:outline-none focus:ring-2 
                                    ${errors.email && touched.email ? 'focus:ring-red-500/20' : 'focus:ring-orange-500/20'}
                                    focus:border-orange-500/40
                                    transition-all duration-300
                                    text-sm`}
                                                placeholder="you@example.com"
                                            />
                                            {errors.email && touched.email && (
                                                <p className="text-xs text-red-400 flex items-center gap-1 mt-1 animate-slide-down">
                                                    <AlertCircle className="w-3 h-3" />
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>

                                        {/* Password with Strength Meter */}
                                        <div>
                                            <label className="text-xs font-medium text-orange-400/60 flex items-center gap-2 mb-1.5">
                                                <Lock className="w-3.5 h-3.5" />
                                                Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    onFocus={() => setFocusedField('password')}
                                                    onBlur={() => { setFocusedField(null); handleBlur('password'); }}
                                                    className={`w-full px-4 pr-12 py-2.5 rounded-xl 
                                      bg-[#0a0807]/50 border-2 
                                      ${errors.password && touched.password ? 'border-red-500/50' :
                                                            focusedField === 'password' ? 'border-orange-400/60' : 'border-orange-500/20'}
                                      text-orange-200/90 placeholder-orange-400/30
                                      focus:outline-none focus:ring-2 
                                      ${errors.password && touched.password ? 'focus:ring-red-500/20' : 'focus:ring-orange-500/20'}
                                      focus:border-orange-500/40
                                      transition-all duration-300
                                      text-sm`}
                                                    placeholder="Create a strong password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400/40 hover:text-orange-400 transition-colors"
                                                >
                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>

                                            {/* Password Strength Meter */}
                                            {formData.password.length > 0 && (
                                                <div className="mt-2 space-y-1.5 animate-slide-down">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex gap-1 flex-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <div
                                                                    key={i}
                                                                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < passwordStrength ? getStrengthColor() : 'bg-orange-500/10'
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className={`text-xs font-medium ml-2 ${passwordStrength <= 1 ? 'text-red-400' :
                                                            passwordStrength === 2 ? 'text-orange-400' :
                                                                passwordStrength === 3 ? 'text-yellow-400' :
                                                                    'text-green-400'
                                                            }`}>
                                                            {getStrengthText()}
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-1 text-[10px]">
                                                        <div className="flex items-center gap-1 text-orange-400/40">
                                                            {passwordChecks.length ?
                                                                <Check className="w-3 h-3 text-green-400" /> :
                                                                <X className="w-3 h-3 text-orange-400/20" />
                                                            }
                                                            <span className={passwordChecks.length ? 'text-green-400/60' : ''}>8+ characters</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-orange-400/40">
                                                            {passwordChecks.uppercase && passwordChecks.lowercase ?
                                                                <Check className="w-3 h-3 text-green-400" /> :
                                                                <X className="w-3 h-3 text-orange-400/20" />
                                                            }
                                                            <span className={passwordChecks.uppercase && passwordChecks.lowercase ? 'text-green-400/60' : ''}>Upper & lowercase</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-orange-400/40">
                                                            {passwordChecks.number ?
                                                                <Check className="w-3 h-3 text-green-400" /> :
                                                                <X className="w-3 h-3 text-orange-400/20" />
                                                            }
                                                            <span className={passwordChecks.number ? 'text-green-400/60' : ''}>Has number</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-orange-400/40">
                                                            {passwordChecks.special ?
                                                                <Check className="w-3 h-3 text-green-400" /> :
                                                                <X className="w-3 h-3 text-orange-400/20" />
                                                            }
                                                            <span className={passwordChecks.special ? 'text-green-400/60' : ''}>Special character</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {errors.password && touched.password && (
                                                <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                                                    <AlertCircle className="w-3 h-3" />
                                                    {errors.password}
                                                </p>
                                            )}
                                        </div>

                                        {/* Confirm Password */}
                                        <div>
                                            <label className="text-xs font-medium text-orange-400/60 flex items-center gap-2 mb-1.5">
                                                <Shield className="w-3.5 h-3.5" />
                                                Confirm Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    name="confirmPassword"
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                    onFocus={() => setFocusedField('confirmPassword')}
                                                    onBlur={() => { setFocusedField(null); handleBlur('confirmPassword'); }}
                                                    className={`w-full px-4 pr-12 py-2.5 rounded-xl 
                                      bg-[#0a0807]/50 border-2 
                                      ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500/50' :
                                                            focusedField === 'confirmPassword' ? 'border-orange-400/60' : 'border-orange-500/20'}
                                      text-orange-200/90 placeholder-orange-400/30
                                      focus:outline-none focus:ring-2 
                                      ${errors.confirmPassword && touched.confirmPassword ? 'focus:ring-red-500/20' : 'focus:ring-orange-500/20'}
                                      focus:border-orange-500/40
                                      transition-all duration-300
                                      text-sm`}
                                                    placeholder="Confirm your password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400/40 hover:text-orange-400 transition-colors"
                                                >
                                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                            {formData.confirmPassword.length > 0 && formData.password === formData.confirmPassword && (
                                                <p className="text-xs text-green-400 flex items-center gap-1 mt-1 animate-slide-down">
                                                    <CheckCircle className="w-3 h-3" />
                                                    Passwords match
                                                </p>
                                            )}
                                            {errors.confirmPassword && touched.confirmPassword && (
                                                <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                                                    <AlertCircle className="w-3 h-3" />
                                                    {errors.confirmPassword}
                                                </p>
                                            )}
                                        </div>

                                        {/* Terms */}
                                        <div className="flex items-start gap-2.5 pt-1">
                                            <input
                                                type="checkbox"
                                                name="agreeTerms"
                                                checked={formData.agreeTerms}
                                                onChange={handleChange}
                                                className="mt-0.5 w-4 h-4 rounded border-2 border-orange-500/20 
                                  bg-[#0a0807]/50 text-orange-500 focus:ring-orange-500/20 
                                  focus:ring-2 transition-all duration-200 cursor-pointer"
                                            />
                                            <div>
                                                <label className="text-xs text-orange-400/40 cursor-pointer">
                                                    I agree to the{' '}
                                                    <a href="#" className="text-orange-400 hover:text-orange-300 transition-colors font-medium">
                                                        Terms of Service
                                                    </a>
                                                    {' '}and{' '}
                                                    <a href="#" className="text-orange-400 hover:text-orange-300 transition-colors font-medium">
                                                        Privacy Policy
                                                    </a>
                                                </label>
                                                {errors.agreeTerms && (
                                                    <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                                                        <AlertCircle className="w-3 h-3" />
                                                        {errors.agreeTerms}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="relative w-full py-3 rounded-xl font-semibold text-sm
                                 bg-gradient-to-r from-orange-500 to-orange-600 
                                 hover:from-orange-400 hover:to-orange-500
                                 text-[#0d0b0a] 
                                 shadow-lg shadow-orange-500/30
                                 hover:shadow-2xl hover:shadow-orange-500/50 
                                 hover:scale-[1.02]
                                 transition-all duration-300 
                                 flex items-center justify-center gap-2
                                 disabled:opacity-70 disabled:cursor-not-allowed
                                 disabled:hover:scale-100
                                 overflow-hidden group">
                                            <span className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-white/10 
                                         opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                                         translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    <span>Creating Account...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>Create Account</span>
                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </button>
                                    </form>

                                    {/* Divider */}
                                    <div className="relative flex items-center my-5">
                                        <div className="flex-grow border-t border-orange-500/10" />
                                        <span className="flex-shrink-0 px-3 text-[10px] text-orange-400/30 tracking-wider">OR</span>
                                        <div className="flex-grow border-t border-orange-500/10" />
                                    </div>

                                    {/* Social */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <button className="group relative py-2.5 rounded-xl border border-orange-500/20 
                                       bg-[#0a0807]/30 hover:bg-orange-500/10 
                                       text-orange-200/60 hover:text-orange-200/80
                                       transition-all duration-300 flex items-center justify-center gap-2
                                       hover:border-orange-500/40 hover:scale-[1.02] text-sm">
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.478,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                                            </svg>
                                            <span>Google</span>
                                        </button>

                                        <button className="group relative py-2.5 rounded-xl border border-orange-500/20 
                                       bg-[#0a0807]/30 hover:bg-orange-500/10 
                                       text-orange-200/60 hover:text-orange-200/80
                                       transition-all duration-300 flex items-center justify-center gap-2
                                       hover:border-orange-500/40 hover:scale-[1.02] text-sm">
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                            </svg>
                                            <span>GitHub</span>
                                        </button>
                                    </div>

                                    {/* Login Link */}
                                    <p className="text-center text-xs text-orange-400/40 mt-5">
                                        Already have an account?{' '}
                                        <Link to="/login" className="text-orange-400 hover:text-orange-300 font-semibold transition-colors">
                                            Sign In
                                        </Link>
                                    </p>


                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.08; }
          50% { transform: scale(1.1); opacity: 0.12; }
        }
        
        @keyframes pulse-slower {
          0%, 100% { transform: scale(1); opacity: 0.05; }
          50% { transform: scale(1.2); opacity: 0.08; }
        }
        
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes border-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes float-slower {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(20px) rotate(-5deg); }
        }
        
        @keyframes float-slowest {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
        }
        
        .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
        .animate-pulse-slower { animation: pulse-slower 12s ease-in-out infinite; }
        .animate-slide-down { animation: slide-down 0.3s ease-out; }
        .animate-border-flow { background-size: 200% 200%; animation: border-flow 3s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        .animate-float-slower { animation: float-slower 8s ease-in-out infinite; }
        .animate-float-slowest { animation: float-slowest 10s ease-in-out infinite; }
      `}</style>
        </div>
    );
}

export default SignUp;