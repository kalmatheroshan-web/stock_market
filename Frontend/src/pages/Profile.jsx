import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaGithub, FaTwitter, FaLinkedin
} from 'react-icons/fa';
import {
    Mail, MapPin, Calendar, TrendingUp,
    BarChart3, Award, LogOut, ArrowLeft, Shield,
    Clock, ChevronRight, Users, BookOpen,
    Zap, Activity, Settings, User
} from 'lucide-react';
import { me } from '../services/auth';

// ─── Custom hook for animated counter ──────────────────────────────────────
const useCountUp = (target, duration = 2000) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
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

// ─── Memoized Stat Card ──────────────────────────────────────────────────────
const StatCard = memo(({ label, value, icon: Icon, change }) => (
    <div className="group p-6 rounded-2xl bg-[#1a1410]/30 backdrop-blur-sm border border-orange-500/10 
                  hover:border-orange-500/30 transition-all duration-500 hover:-translate-y-1 
                  hover:shadow-2xl hover:shadow-orange-500/10 relative overflow-hidden cursor-pointer">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="flex items-center justify-between">
            <div>
                <p className="text-xs font-medium text-orange-400/40 tracking-wider uppercase">{label}</p>
                <p className="text-2xl font-bold text-orange-200/80 mt-1 font-mono tracking-tight">{value}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20 group-hover:bg-orange-500/20 transition-all duration-300">
                <Icon className="w-5 h-5 text-orange-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
        </div>
        <div className="mt-3 flex items-center text-xs text-orange-400/30">
            <span>{change}</span>
            <ChevronRight className="w-3 h-3 ml-1" />
        </div>
    </div>
));
StatCard.displayName = 'StatCard';

// ─── Memoized Social Link ───────────────────────────────────────────────────
const SocialLink = memo(({ href, icon: Icon, label }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a1410]/40 border border-orange-500/10 hover:border-orange-500/30 transition-all hover:bg-[#1a1410]/60"
    >
        <Icon className="w-4 h-4 text-orange-400/60" />
        <span className="text-xs text-orange-300/50">{label}</span>
    </a>
));
SocialLink.displayName = 'SocialLink';

// ─── Main Component ──────────────────────────────────────────────────────────
function Profile() {
    const dispatch = useDispatch();
    const { user: authUser } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [profile, setProfile] = useState(null);

    // ─── Load auth user data ──────────────────────────────────────────────────
    useEffect(() => {
        dispatch(me());
    }, [dispatch]);

    // ─── Enrich profile with GitHub data if githubUsername exists ──────────────
    useEffect(() => {
        if (!authUser) return;

        const enrichProfile = async () => {
            let enriched = {
                name: authUser.name || 'User',
                email: authUser.email || '',
                username: authUser.username || authUser.email?.split('@')[0] || 'user',
                avatar: authUser.avatar || null,
                bio: authUser.bio || '',
                location: authUser.location || '',
                joined: authUser.createdAt || new Date().toISOString(),
                github: authUser.githubUsername || null,
                twitter: authUser.twitterUsername || null,
                linkedin: authUser.linkedinUsername || null,
                followers: 0,
                following: 0,
                repos: 0,
            };

            // If GitHub username is provided, fetch real stats
            if (authUser.githubUsername) {
                try {
                    const res = await fetch(`https://api.github.com/users/${authUser.githubUsername}`);
                    if (res.ok) {
                        const data = await res.json();
                        enriched.avatar = data.avatar_url || enriched.avatar;
                        enriched.bio = data.bio || enriched.bio;
                        enriched.location = data.location || enriched.location;
                        enriched.followers = data.followers || 0;
                        enriched.following = data.following || 0;
                        enriched.repos = data.public_repos || 0;
                        if (data.blog) enriched.linkedin = data.blog; // fallback
                    }
                } catch (error) {
                    console.warn('GitHub API fetch failed:', error);
                }
            }

            // If no avatar, generate initials avatar
            if (!enriched.avatar) {
                // Leave as null – we'll show initials in UI
            }

            setProfile(enriched);
            setLoading(false);
        };

        enrichProfile();
    }, [authUser]);

    // ─── Animated counters ──────────────────────────────────────────────────────
    const followersCount = useCountUp(profile?.followers || 0);
    const followingCount = useCountUp(profile?.following || 0);
    const reposCount = useCountUp(profile?.repos || 0);
    const tradesCount = useCountUp(142); // replace with real trades count
    const profitCount = useCountUp(12450); // replace with real profit

    // ─── Memoized stats data ──────────────────────────────────────────────────
    const statsData = useMemo(() => [
        { label: 'Total Trades', value: tradesCount, icon: BarChart3, change: '+12%' },
        { label: 'Win Rate', value: '68%', icon: Award, change: '↑ 3%' },
        { label: 'Total Profit', value: `+$${profitCount.toLocaleString()}`, icon: TrendingUp, change: '↑ 8.2%' },
        { label: 'Account Value', value: '$24,850', icon: Shield, change: '+1.2%' },
    ], [tradesCount, profitCount]);

    const handleTabChange = useCallback((tab) => setActiveTab(tab), []);
    const renderTabContent = useCallback(() => {
        switch (activeTab) {
            case 'overview':
                return (
                    <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
                    >
                        {statsData.map((stat, idx) => (
                            <StatCard key={idx} {...stat} />
                        ))}
                    </motion.div>
                );
            case 'activity':
                return (
                    <motion.div
                        key="activity"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                    >
                        {[
                            { action: 'Bought AAPL at $178.50', time: '2 min ago', change: '+2.3%', color: 'green', icon: TrendingUp },
                            { action: 'Sold TSLA at $245.20', time: '15 min ago', change: '-1.1%', color: 'red', icon: TrendingUp },
                            { action: 'Dividend received from MSFT', time: '1 hour ago', change: '+$12.40', color: 'orange', icon: Award },
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-start gap-4 py-3 border-b border-orange-500/5 last:border-0 group hover:bg-[#1a1410]/20 rounded-xl px-3 transition-all">
                                <div className={`p-2 rounded-xl bg-${item.color}-500/10 border border-${item.color}-500/20`}>
                                    <item.icon className={`w-4 h-4 text-${item.color}-400`} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-orange-200/80">{item.action}</p>
                                    <p className="text-xs text-orange-400/30 mt-0.5">{item.time}</p>
                                </div>
                                <span className={`text-xs font-mono ${item.change.startsWith('+') ? 'text-green-400/60' :
                                    item.change.startsWith('-') ? 'text-red-400/60' :
                                        'text-orange-400/40'
                                    }`}>{item.change}</span>
                            </div>
                        ))}
                    </motion.div>
                );
            case 'settings':
                return (
                    <motion.div
                        key="settings"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-between py-3 border-b border-orange-500/5">
                            <span className="text-sm text-orange-200/70 flex items-center gap-2">
                                <div className="w-4 h-4 text-orange-400/40" />
                                Email Notifications
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-orange-400/40 bg-orange-500/10 px-2 py-0.5 rounded-full">Enabled</span>
                                <div className="w-10 h-5 bg-orange-500/20 rounded-full relative cursor-pointer">
                                    <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-orange-400 rounded-full transition-transform shadow-lg" />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-orange-500/5">
                            <span className="text-sm text-orange-200/70 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-orange-400/40" />
                                Two-Factor Auth
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-green-400/60 bg-green-500/10 px-2 py-0.5 rounded-full">Active</span>
                                <div className="w-10 h-5 bg-orange-500/30 rounded-full relative cursor-pointer">
                                    <div className="absolute top-0.5 right-0.5 w-4 h-4 bg-orange-400 rounded-full transition-transform shadow-lg" />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between py-3">
                            <span className="text-sm text-orange-200/70 flex items-center gap-2">
                                <div className="w-4 h-4 text-orange-400/40" />
                                Language
                            </span>
                            <span className="text-xs text-orange-400/30">English (US)</span>
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    }, [activeTab, statsData]);

    if (loading || !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0807]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
                    <p className="text-orange-400/30 text-sm font-medium tracking-wider">LOADING PROFILE</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[#0a0807] text-white overflow-y-auto overflow-x-hidden font-sans antialiased">
            {/* Background layers (unchanged) */}
            <div className="fixed inset-0 bg-gradient-to-br from-[#1a1410] via-[#0a0807] to-[#0d0b0a] pointer-events-none" />
            <div className="fixed top-[-30%] right-[-20%] w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-[180px] pointer-events-none" />
            <div className="fixed bottom-[-30%] left-[-20%] w-[700px] h-[700px] bg-orange-600/3 rounded-full blur-[150px] pointer-events-none" />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-orange-400/2 rounded-full blur-[250px] pointer-events-none" />
            <div className="fixed inset-0 opacity-[0.015] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc0IiBudW1PY3RhdmVzPSIzIiAvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNmKSIgb3BhY2l0eT0iMC4xIiAvPjwvc3ZnPg==')] bg-repeat" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
                {/* Navigation */}
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

                {/* Cover */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="relative w-full h-48 sm:h-64 lg:h-80 rounded-3xl overflow-hidden mb-8 border border-orange-500/10 shadow-2xl shadow-orange-500/10"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 via-orange-600/20 to-orange-500/10" />
                    <img
                        src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80"
                        alt="Cover"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0807] via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 flex items-center gap-4">
                        <div className="relative">
                            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 opacity-40 blur-lg" />
                            {profile.avatar ? (
                                <img
                                    src={profile.avatar}
                                    alt={profile.name}
                                    className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-orange-500/30 shadow-xl object-cover"
                                />
                            ) : (
                                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-orange-500/20 border-2 border-orange-500/30 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-orange-300">
                                        {profile.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-[#0a0807] animate-pulse" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg">{profile.name}</h1>
                            <p className="text-sm text-orange-300/50 drop-shadow-lg">@{profile.username}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Profile Info & Social */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2 space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-[#1a1410]/30 backdrop-blur-sm rounded-2xl border border-orange-500/10 p-6"
                        >
                            {profile.bio && (
                                <p className="text-sm text-orange-300/50 leading-relaxed">{profile.bio}</p>
                            )}
                            <div className="flex flex-wrap gap-4 mt-4 text-sm text-orange-400/40">
                                {profile.location && (
                                    <span className="flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5" />
                                        {profile.location}
                                    </span>
                                )}
                                <span className="flex items-center gap-1.5">
                                    <Mail className="w-3.5 h-3.5" />
                                    {profile.email}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    Joined {new Date(profile.joined).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                </span>
                            </div>
                        </motion.div>

                        {/* Social Links – only show if they exist */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-wrap gap-3"
                        >
                            {profile.github && (
                                <SocialLink href={`https://github.com/${profile.github}`} icon={FaGithub} label="GitHub" />
                            )}
                            {profile.twitter && (
                                <SocialLink href={`https://twitter.com/${profile.twitter}`} icon={FaTwitter} label="Twitter" />
                            )}
                            {profile.linkedin && (
                                <SocialLink href={`https://linkedin.com/in/${profile.linkedin}`} icon={FaLinkedin} label="LinkedIn" />
                            )}
                        </motion.div>
                    </div>

                    {/* Quick Stats – from GitHub if available, else show placeholder */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-[#1a1410]/30 backdrop-blur-sm rounded-2xl border border-orange-500/10 p-6 shadow-xl shadow-orange-500/5"
                    >
                        <div className="grid grid-cols-3 gap-3">
                            <div className="text-center p-3 rounded-xl bg-[#0d0b0a]/50 border border-orange-500/5">
                                <Users className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                                <p className="text-xl font-bold text-orange-300/80">{followersCount}</p>
                                <p className="text-[10px] text-orange-400/30 uppercase tracking-wider">Followers</p>
                            </div>
                            <div className="text-center p-3 rounded-xl bg-[#0d0b0a]/50 border border-orange-500/5">
                                <Users className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                                <p className="text-xl font-bold text-orange-300/80">{followingCount}</p>
                                <p className="text-[10px] text-orange-400/30 uppercase tracking-wider">Following</p>
                            </div>
                            <div className="text-center p-3 rounded-xl bg-[#0d0b0a]/50 border border-orange-500/5">
                                <BookOpen className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                                <p className="text-xl font-bold text-orange-300/80">{reposCount}</p>
                                <p className="text-[10px] text-orange-400/30 uppercase tracking-wider">Repos</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Tabs */}
                <div className="mb-6">
                    <div className="flex gap-2 border-b border-orange-500/10">
                        {['overview', 'activity', 'settings'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => handleTabChange(tab)}
                                className={`px-4 py-2 text-sm font-medium transition-all duration-300 border-b-2 ${activeTab === tab
                                    ? 'border-orange-400 text-orange-300'
                                    : 'border-transparent text-orange-400/40 hover:text-orange-300/70'
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    {renderTabContent()}
                </AnimatePresence>

                {/* Footer */}
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
                        <button className="flex items-center gap-1.5 text-xs font-medium text-red-400/60 hover:text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/10 hover:border-red-500/30 transition-all">
                            <LogOut className="w-3 h-3" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default React.memo(Profile);