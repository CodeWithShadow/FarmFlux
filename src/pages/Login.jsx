import React, { useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { signInWithGoogle } from '../services/supabase';
import useStore from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { Leaf, Droplets, Bug, Sprout, ShieldAlert, BarChart3, CloudLightning, ShieldCheck, Zap, ArrowRight, ShoppingCart } from 'lucide-react';

/* Floating particles for the Hero Section */
function Particles() {
    const particles = useMemo(() =>
        Array.from({ length: 40 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 4 + 2,
            duration: Math.random() * 10 + 10,
            delay: Math.random() * 5,
        })), []
    );

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="particle bg-farm-accent/30 rounded-full absolute"
                    style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
                    animate={{ y: [0, -30, 10, -20, 0], x: [0, 15, -10, 5, 0], opacity: [0.2, 0.5, 0.3, 0.6, 0.2] }}
                    transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
                />
            ))}
        </div>
    );
}

const stats = [
    { value: "30%", label: "Global crop loss due to unchecked diseases & pests annually.", icon: Bug, color: "text-farm-danger" },
    { value: "70%", label: "Of the world's freshwater is used for agriculture, often inefficiently.", icon: Droplets, color: "text-blue-400" },
    { value: "40%", label: "Of farmers lack access to accurate market pricing and weather data.", icon: BarChart3, color: "text-farm-warning" },
];

const features = [
    {
        title: "AI Disease Detection",
        description: "Snap a photo of any distressed leaf. Our offline-capable AI models instantly identify diseases and provide actionable treatment plans.",
        icon: ShieldAlert,
        color: "text-red-400",
        bg: "bg-red-500/10"
    },
    {
        title: "Smart Irrigation Planning",
        description: "Save water and money. FarmFlux calculates precise irrigation schedules based on real-time weather forecasts and specific crop needs.",
        icon: Droplets,
        color: "text-blue-400",
        bg: "bg-blue-500/10"
    },
    {
        title: "Soil Analysis",
        description: "Understand your soil health without expensive lab tests. Upload soil images for instant pH and nutrient recommendations.",
        icon: Sprout,
        color: "text-farm-accent",
        bg: "bg-farm-accent/10"
    },
    {
        title: "Peer-to-Peer Marketplace",
        description: "Bypass the middlemen. Sell your surplus yield directly to buyers at fair, AI-suggested market rates.",
        icon: ShoppingCart,
        color: "text-purple-400",
        bg: "bg-purple-500/10"
    }
];

export default function Login() {
    const { user } = useStore();
    const navigate = useNavigate();
    const { scrollYProgress } = useScroll();
    const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

    useEffect(() => {
        if (user) navigate('/', { replace: true });
    }, [user, navigate]);

    const handleLogin = async () => {
        try {
            await signInWithGoogle();
        } catch (err) {
            console.error('Login error:', err);
        }
    };

    const titleLetters = 'FarmFlux'.split('');

    return (
        <div className="min-h-screen bg-farm-bg text-farm-text font-dm selection:bg-farm-accent/30 selection:text-farm-accent overflow-x-hidden">
            
            {/* Top Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-farm-bg/70 backdrop-blur-xl border-b border-farm-border/50">
                <div className="flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-farm-accent" />
                    <span className="font-syne font-bold text-lg tracking-wide">FarmFlux</span>
                </div>
                <button 
                    onClick={handleLogin}
                    className="px-5 py-2 rounded-full bg-farm-accent/10 text-farm-accent text-sm font-semibold hover:bg-farm-accent hover:text-farm-bg transition-colors"
                >
                    Sign In
                </button>
            </nav>

            {/* Hero Section */}
            <motion.section 
                style={{ opacity: heroOpacity, scale: heroScale }}
                className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden gradient-mesh"
            >
                <Particles />

                <div className="relative z-10 flex flex-col items-center px-6 max-w-4xl mx-auto text-center">
                    {/* Logo Icon */}
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                        className="w-20 h-20 rounded-2xl bg-farm-accent/10 border border-farm-accent/30 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(74,222,128,0.2)]"
                    >
                        <Leaf className="w-10 h-10 text-farm-accent drop-shadow-lg" />
                    </motion.div>

                    {/* Title */}
                    <div className="flex items-center justify-center gap-[1px] mb-4 flex-wrap">
                        {titleLetters.map((letter, i) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + i * 0.05, type: 'spring', stiffness: 300 }}
                                className="font-syne font-black text-6xl md:text-8xl text-farm-text tracking-tight"
                            >
                                {letter}
                            </motion.span>
                        ))}
                    </div>

                    {/* Tagline */}
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0 }}
                        className="text-farm-text-secondary text-lg md:text-2xl font-dm mb-12 max-w-2xl font-light"
                    >
                        Intelligence rooted in the soil. Next-generation AI tools to maximize crop yield, minimize resource waste, and securely connect you to the market.
                    </motion.p>

                    {/* Glassmorphic Login Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                        className="p-1 rounded-2xl bg-gradient-to-b from-farm-border to-transparent"
                    >
                        <div className="bg-farm-bg-secondary/40 backdrop-blur-2xl rounded-xl p-6 sm:p-8 border border-farm-border/50 max-w-sm mx-auto shadow-2xl">
                            <button
                                onClick={handleLogin}
                                className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-syne font-bold text-lg rounded-lg hover:bg-gray-100 transition-colors shadow-lg active:scale-95"
                            >
                                <svg className="w-6 h-6" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Continue with Google
                            </button>
                            <p className="text-xs text-farm-text-muted mt-5 text-center px-4 leading-relaxed">
                                Join thousands of modern farmers optimizing their land with FarmFlux.
                            </p>
                        </div>
                    </motion.div>
                    
                    {/* Scroll Indicator */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2 }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-farm-text-muted/50"
                    >
                        <span className="text-xs uppercase tracking-widest font-mono">Discover More</span>
                        <motion.div 
                            animate={{ y: [0, 10, 0] }} 
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="w-[1px] h-10 bg-gradient-to-b from-farm-text-muted/50 to-transparent"
                        />
                    </motion.div>
                </div>
            </motion.section>

            {/* Problem Statement & Stats Section */}
            <section className="py-24 sm:py-32 px-6 relative border-y border-farm-border/30 bg-farm-card/10">
                <div className="max-w-6xl mx-auto">
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
                        }}
                        className="text-center mb-20"
                    >
                        <h2 className="font-syne font-bold text-3xl sm:text-5xl mb-6 text-farm-text">Farming is harder than ever.</h2>
                        <p className="text-lg text-farm-text-secondary max-w-3xl mx-auto font-light leading-relaxed">
                            Climate changes, unpredictable markets, and rising costs demand data-driven precision, not just intuition. The old ways are no longer enough to secure our food systems.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {stats.map((stat, i) => {
                            const Icon = stat.icon;
                            return (
                                <motion.div 
                                    key={i}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: "-100px" }}
                                    variants={{
                                        hidden: { opacity: 0, y: 30 },
                                        visible: { opacity: 1, y: 0, transition: { delay: i * 0.2, duration: 0.6 } }
                                    }}
                                    className="p-8 rounded-2xl bg-farm-bg-secondary/50 border border-farm-border text-center flex flex-col items-center"
                                >
                                    <div className={`w-16 h-16 rounded-full bg-farm-bg border border-farm-border flex items-center justify-center mb-6 shadow-inner`}>
                                        <Icon className={`w-8 h-8 ${stat.color}`} />
                                    </div>
                                    <h3 className="text-5xl font-syne font-black mb-4 text-farm-text">{stat.value}</h3>
                                    <p className="text-farm-text-secondary font-dm text-sm leading-relaxed">{stat.label}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Features Showcase Section */}
            <section className="py-24 sm:py-32 px-6 relative">
                <div className="max-w-6xl mx-auto">
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8 } } }}
                        className="mb-16 md:mb-24"
                    >
                        <span className="text-farm-accent font-mono uppercase tracking-widest text-sm mb-4 block">The Solution</span>
                        <h2 className="font-syne font-bold text-4xl sm:text-5xl text-farm-text max-w-2xl">
                            Empowering agriculture with <span className="text-farm-accent">edge AI.</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
                        {features.map((feature, i) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div 
                                    key={i}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: "-50px" }}
                                    variants={{
                                        hidden: { opacity: 0, y: 30 },
                                        visible: { opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }
                                    }}
                                    className="group p-8 sm:p-10 rounded-3xl bg-farm-card border border-farm-border hover:border-farm-accent/50 transition-colors duration-500 overflow-hidden relative"
                                >
                                    <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-radial ${feature.bg} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl`} />
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-8 bg-farm-bg border border-farm-border relative z-10`}>
                                        <Icon className={`w-6 h-6 ${feature.color}`} />
                                    </div>
                                    <h3 className="text-2xl font-syne font-bold text-farm-text mb-4 relative z-10">{feature.title}</h3>
                                    <p className="text-farm-text-secondary leading-relaxed relative z-10">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-32 px-6 bg-farm-accent/5 border-t border-farm-border relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiM0QURFODAiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]" />
                
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } } }}
                    className="max-w-2xl mx-auto text-center relative z-10"
                >
                    <h2 className="font-syne font-bold text-4xl sm:text-5xl text-farm-text mb-8">Ready to transform your farm?</h2>
                    <button
                        onClick={handleLogin}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-farm-accent text-farm-bg font-syne font-bold text-lg rounded-full hover:bg-farm-accent-secondary transition-colors shadow-[0_0_30px_rgba(74,222,128,0.3)] hover:shadow-[0_0_50px_rgba(74,222,128,0.5)] active:scale-95"
                    >
                        Start using FarmFlux  <ArrowRight className="w-5 h-5" />
                    </button>
                    <p className="text-sm text-farm-text-muted mt-6">Secure login via Google. No credit card required.</p>
                </motion.div>
            </section>
            
        </div>
    );
}
