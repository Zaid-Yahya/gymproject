import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { motion } from 'framer-motion';
import OrderSummaryModal from './OrderSummaryModal';
import PlanComparisonTable from './PlanComparisonTable';
import Navbar from '@/Components/Navbar';

// Animated background component with pink/red particles
const AnimatedBackground = () => {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const mouseRef = useRef({ x: undefined, y: undefined, radius: 150 });
    
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };
        
        const handleMouseMove = (e) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY;
        };
        
        const handleMouseLeave = () => {
            mouseRef.current.x = undefined;
            mouseRef.current.y = undefined;
        };
        
        const initParticles = () => {
            const particles = [];
            const particleCount = Math.min(Math.floor(canvas.width * canvas.height / 12000), 150);
            
            for (let i = 0; i < particleCount; i++) {
                const size = Math.random() * 3 + 1;
                const x = Math.random() * (canvas.width - size * 2);
                const y = Math.random() * (canvas.height - size * 2);
                const directionX = Math.random() * 1 - 0.5;
                const directionY = Math.random() * 1 - 0.5;
                // Light red/pink/orange color palette
                const colors = [
                    'rgba(255, 99, 132, 0.5)', // light red
                    'rgba(255, 159, 64, 0.5)', // light orange
                    'rgba(255, 127, 80, 0.5)', // coral
                    'rgba(255, 182, 193, 0.5)', // light pink
                    'rgba(255, 69, 0, 0.5)',    // red-orange
                ];
                const color = colors[Math.floor(Math.random() * colors.length)];
                
                particles.push({
                    x, y, size, directionX, directionY, color
                });
            }
            
            particlesRef.current = particles;
        };
        
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particlesRef.current.forEach((particle, index) => {
                particle.x += particle.directionX;
                particle.y += particle.directionY;
                
                // Bounce off edges
                if (particle.x < 0 || particle.x > canvas.width) {
                    particle.directionX = -particle.directionX;
                }
                if (particle.y < 0 || particle.y > canvas.height) {
                    particle.directionY = -particle.directionY;
                }
                
                // Mouse interaction
                if (mouseRef.current.x !== undefined) {
                    const dx = mouseRef.current.x - particle.x;
                    const dy = mouseRef.current.y - particle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < mouseRef.current.radius) {
                        const angle = Math.atan2(dy, dx);
                        const force = (mouseRef.current.radius - distance) / mouseRef.current.radius;
                        particle.directionX -= Math.cos(angle) * force * 0.6;
                        particle.directionY -= Math.sin(angle) * force * 0.6;
                    }
                }
                
                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
                
                // Connect nearby particles
                particlesRef.current.forEach((otherParticle, otherIndex) => {
                    if (index === otherIndex) return;
                    
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255, 99, 132, ${0.2 * (1 - distance / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.stroke();
                    }
                });
            });
            
            animationFrameId = requestAnimationFrame(animate);
        };
        
        window.addEventListener('resize', handleResize);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);
        
        handleResize();
        animate();
        
        return () => {
            window.removeEventListener('resize', handleResize);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);
    
    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full -z-10 opacity-75"
        />
    );
};

// New Hero Section Component
const HeroSection = () => {
    return (
        <div className="relative overflow-hidden bg-gradient-to-b from-gray-900 to-red-900">
            {/* Dynamic background elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-red-800/20 to-orange-700/20"></div>
                <div className="absolute top-0 right-0 w-full h-full bg-[url('/storage/pattern-dots.png')] bg-repeat opacity-5"></div>
                <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-red-900/50 to-transparent"></div>
                
                {/* Animated particles */}
                <div className="absolute inset-0">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 rounded-full bg-red-500/30"
                            initial={{
                                x: Math.random() * 100 + "%",
                                y: Math.random() * 100 + "%",
                                scale: Math.random() * 0.5 + 0.5
                            }}
                            animate={{
                                y: [
                                    Math.random() * 100 + "%", 
                                    Math.random() * 100 + "%"
                                ],
                                opacity: [0.3, 0.8, 0.3]
                            }}
                            transition={{
                                duration: Math.random() * 10 + 10,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </div>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="w-full md:w-1/2 md:pr-12">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="relative"
                        >
                            {/* Decorative elements */}
                            <div className="absolute -left-6 -top-6 w-20 h-20 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 blur-xl"></div>
                            
                            {/* Badge */}
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 mb-6 text-red-300 text-sm font-medium">
                                <span className="w-2 h-2 rounded-full bg-red-400 mr-2 animate-pulse"></span>
                                Premium Membership
                            </div>
                            
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-white">
                                Join Us <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-400">Today</span>
                            </h1>
                            
                            <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed max-w-xl">
                                Transform your body and life with our premium membership plans tailored to your fitness journey.
                            </p>
                            
                            <div className="flex flex-wrap gap-4 items-center">
                                <motion.div 
                                    className="inline-block"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <a 
                                        href="#plans" 
                                        className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 hover:shadow-red-600/40 transition-all duration-300 inline-flex items-center"
                                    >
                                        Explore Plans
                                        <motion.svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            className="h-5 w-5 ml-2" 
                                            fill="none" 
                                            viewBox="0 0 24 24" 
                                            stroke="currentColor"
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </motion.svg>
                                    </a>
                                </motion.div>
                                
                                <a href="#comparison" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Compare Plans
                                </a>
                            </div>
                            
                            {/* Stats */}
                            <div className="mt-12 grid grid-cols-3 gap-4">
                                {[
                                    { number: "500+", label: "Active Members" },
                                    { number: "50+", label: "Trainers" },
                                    { number: "100%", label: "Satisfaction" }
                                ].map((stat, index) => (
                                    <div key={index} className="text-center">
                                        <div className="text-2xl font-bold text-white">{stat.number}</div>
                                        <div className="text-sm text-gray-400">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                    
                    <div className="w-full md:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            {/* Enhanced image card */}
                            <div className="absolute -inset-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl blur-lg opacity-30 animate-pulse-slow"></div>
                            <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-red-500/20 group">
                                <img 
                                    src="/storage/join_us.jpg" 
                                    alt="Fitness Training" 
                                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
                                    <div className="p-8 w-full">
                                        <p className="text-white font-medium text-xl mb-3">Start your fitness journey with us</p>
                                        <div className="flex items-center gap-2">
                                            <span className="inline-block h-1 w-12 bg-red-500 rounded-full"></span>
                                            <span className="inline-block h-1 w-6 bg-orange-500 rounded-full"></span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Floating elements */}
                                <motion.div 
                                    className="absolute top-4 right-4 bg-black/30 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-white text-sm font-medium"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                >
                                    Premium Experience
                                </motion.div>
                            </div>
                            
                            <motion.div 
                                className="absolute -right-4 -bottom-4 bg-white rounded-full p-4 shadow-xl"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, delay: 0.6 }}
                            >
                                <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-full p-3 text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Plans({ plans, hasActiveSubscription, activeSubscription, canUpgrade, upgradablePlans }) {
    const { auth } = usePage().props;
    const [loading, setLoading] = useState(false);
    const [discountInfo, setDiscountInfo] = useState(null);
    const [discountError, setDiscountError] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isUpgrade, setIsUpgrade] = useState(false);
    const [selectedUpgradeCost, setSelectedUpgradeCost] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [activePeriod, setActivePeriod] = useState('monthly'); // Default active period

    const { data, setData, post, processing, errors } = useForm({
        plan_name: '',
        original_price: 0,
        price: 0,
        discount_id: null,
        duration: 1, // Default to monthly
    });

    const { data: discountData, setData: setDiscountData, processing: discountProcessing } = useForm({
        code: '',
        plan_price: 0,
    });

    const handleSelectPlan = (plan, isUpgradeFlow = false, upgradeCost = null) => {
        setSelectedPlan(plan);
        setIsUpgrade(isUpgradeFlow);
        setSelectedUpgradeCost(upgradeCost);
        setDiscountInfo(null);
        setDiscountData({
            code: '',
            plan_price: plan.price,
        });
        setShowOrderModal(true);
    };

    const handleApplyDiscount = async (e) => {
        e.preventDefault();
        
        if (!discountData.code || !selectedPlan) return;
        
        setLoading(true);
        setDiscountError(null);
        
        try {
            const response = await axios.post(route('discounts.validate'), {
                code: discountData.code,
                plan_price: selectedPlan.price,
            });
            
            if (response.data.valid) {
                setDiscountInfo(response.data);
            } else {
                setDiscountError(response.data.message);
            }
        } catch (error) {
            setDiscountError(error.response?.data?.message || 'Failed to validate discount code');
        } finally {
            setLoading(false);
        }
    };

    // Group plans by period
    const monthlyPlans = plans.filter(plan => plan.period === 'monthly');
    const quarterlyPlans = plans.filter(plan => plan.period === 'quarterly');
    const yearlyPlans = plans.filter(plan => plan.period === 'yearly');

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    const pulseAnimation = {
        scale: [1, 1.03, 1],
        transition: { 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
        }
    };

    // Simplified color scheme with red/orange focus
    const planColors = [
        { 
            gradient: "from-red-400 to-red-600", 
            accent: "bg-red-100",
            text: "text-red-800", 
            border: "border-red-400",
            ring: "ring-red-400",
            icon: "text-red-600",
            button: "from-red-500 to-red-600"
        },
        { 
            gradient: "from-orange-400 to-red-500", 
            accent: "bg-orange-100",
            text: "text-orange-800", 
            border: "border-orange-400",
            ring: "ring-orange-400",
            icon: "text-orange-600",
            button: "from-orange-500 to-red-500"
        },
        { 
            gradient: "from-amber-400 to-orange-500", 
            accent: "bg-amber-100",
            text: "text-amber-800", 
            border: "border-amber-400",
            ring: "ring-amber-400",
            icon: "text-amber-600",
            button: "from-amber-500 to-orange-500"
        }
    ];

    // Period selection tabs
    const periodTabs = [
        { id: 'monthly', label: 'Monthly' },
        { id: 'quarterly', label: '3 Months' },
        { id: 'yearly', label: 'Yearly' }
    ];

    // Get plans for current active period
    const getActivePlans = () => {
        switch(activePeriod) {
            case 'monthly': return monthlyPlans;
            case 'quarterly': return quarterlyPlans;
            case 'yearly': return yearlyPlans;
            default: return monthlyPlans;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-rose-50 to-red-100 relative overflow-hidden">
            <Head title="Subscription Plans" />
            
            {/* Animated background */}
            <AnimatedBackground />
            
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-rose-50 via-transparent to-red-100 -z-10"></div>
            
            <Navbar activeSection="membership" />

            {/* New Hero Section */}
            <HeroSection />

            <div className="py-12" id="plans">
                {showConfetti && (
                    <div className="fixed inset-0 z-50 pointer-events-none">
                        {[...Array(100)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-2 h-2"
                                initial={{
                                    top: "0%",
                                    left: `${Math.random() * 100}%`,
                                    backgroundColor: ["#FF6384", "#FF9F40", "#FF7F50", "#FFB6C1", "#FF4500"][Math.floor(Math.random() * 5)]
                                }}
                                animate={{
                                    top: "100%",
                                    rotate: 360,
                                    scale: [1, 0.5],
                                    opacity: [1, 0.8, 0]
                                }}
                                transition={{
                                    duration: Math.random() * 2 + 1,
                                    ease: "easeOut"
                                }}
                            />
                        ))}
                    </div>
                )}

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-block rounded-xl bg-white bg-opacity-70 p-2 shadow-lg mb-4">
                            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-3 rounded-lg">
                                <h2 className="text-4xl font-bold">Fitness Memberships</h2>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Choose The Plan That Fits Your Lifestyle</h3>
                        <motion.p 
                            className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto"
                            animate={pulseAnimation}
                        >
                            Flexible options designed for every fitness level and goal
                        </motion.p>
                    </motion.div>

                    {hasActiveSubscription && !canUpgrade && (
                        <motion.div 
                            className="bg-white border-l-4 border-red-400 p-6 mb-8 rounded-md shadow-md"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="flex items-start">
                                <div className="flex-shrink-0 pt-0.5">
                                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-lg font-medium text-gray-900">You Already Have an Active Subscription</h3>
                                    <div className="mt-2 text-base text-gray-600">
                                        <p>
                                            You currently have the <span className="font-semibold">{activeSubscription?.plan_name}</span> plan which is active until {new Date(activeSubscription?.end_date).toLocaleDateString()}.
                                        </p>
                                        <p className="mt-2">
                                            You are already on our highest tier plan. To manage your existing subscription, please visit your subscription page.
                                        </p>
                                        <div className="mt-4">
                                            <Link
                                                href={route('subscriptions.index')}
                                                className="inline-flex items-center px-4 py-2 bg-red-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-600 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                            >
                                                View My Subscription
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {hasActiveSubscription && canUpgrade && (
                        <motion.div 
                            className="bg-white border-l-4 border-orange-400 p-6 mb-8 rounded-md shadow-md"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="flex items-start">
                                <div className="flex-shrink-0 pt-0.5">
                                    <svg className="h-5 w-5 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-lg font-medium text-gray-900">Upgrade Your Current Plan</h3>
                                    <div className="mt-2 text-base text-gray-600">
                                        <p>
                                            You currently have the <span className="font-semibold">{activeSubscription?.plan_name}</span> plan which is active until {new Date(activeSubscription?.end_date).toLocaleDateString()}.
                                        </p>
                                        <p className="mt-2">
                                            You can upgrade to a higher tier plan. The upgrade price will be calculated based on the remaining time in your current subscription.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {hasActiveSubscription && canUpgrade && (
                        <div className="mb-12">
                            <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">Available Upgrades</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {upgradablePlans.map((plan, index) => {
                                    const colorSet = planColors[index % planColors.length];
                                    
                                    return (
                                        <motion.div
                                            key={index}
                                            variants={itemVariants}
                                            whileHover={{ 
                                                y: -10,
                                                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                                            }}
                                            className={`bg-white rounded-2xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col h-full`}
                                        >
                                            <div className={`bg-gradient-to-r ${colorSet.gradient} text-white text-center py-2 font-semibold`}>
                                                UPGRADE OPTION
                                            </div>
                                            
                                            <div className="p-8 flex-grow">
                                                <div className="text-center mb-6">
                                                    <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
                                                    
                                                    <div className={`inline-block ${colorSet.accent} ${colorSet.text} text-xs font-semibold px-2.5 py-0.5 rounded-full mt-1 mb-3`}>
                                                        {plan.period === 'monthly' ? 'Monthly' : 
                                                        plan.period === 'quarterly' ? '3 Months' : 'Annual'}
                                                    </div>
                                                    
                                                    <div className="flex items-baseline justify-center">
                                                        <span className="text-3xl font-extrabold">{plan.upgrade_cost}€</span>
                                                        <span className="text-gray-500 ml-1 text-sm">
                                                            upgrade price
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="mt-2 text-sm text-green-600 font-medium">
                                                        Based on {activeSubscription.remaining_days} days remaining
                                                    </div>
                                                </div>
                                                
                                                <ul className="space-y-3 mb-8">
                                                    {plan.features.map((feature, idx) => (
                                                        <li key={idx} className="flex items-start">
                                                            <div className={`flex-shrink-0 ${colorSet.icon}`}>
                                                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                            </div>
                                                            <span className="ml-2 text-gray-600">{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            
                                            <div className="p-6 bg-gray-50 border-t">
                                                <button
                                                    onClick={() => handleSelectPlan(plan, true, plan.upgrade_cost)}
                                                    className={`w-full px-4 py-3 bg-gradient-to-r ${colorSet.button} text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${colorSet.ring}`}
                                                >
                                                    Upgrade Now
                                                </button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {!hasActiveSubscription && (
                        <>
                            {/* Period selection tabs */}
                            <div className="flex justify-center mb-8">
                                <div className="bg-white p-1 rounded-xl shadow-md">
                                    <div className="flex space-x-1">
                                        {periodTabs.map((tab) => (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActivePeriod(tab.id)}
                                                className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                                    activePeriod === tab.id
                                                        ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md'
                                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                                }`}
                                            >
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Period Description */}
                            <div className="text-center mb-8">
                                {activePeriod === 'monthly' && (
                                    <p className="text-gray-600">Pay monthly with no long-term commitment.</p>
                                )}
                                {activePeriod === 'quarterly' && (
                                    <p className="text-gray-600">Save 10% with our 3-month subscription plans.</p>
                                )}
                                {activePeriod === 'yearly' && (
                                    <p className="text-gray-600">Our best value! Save 20% with annual subscriptions.</p>
                                )}
                            </div>

                            <motion.div 
                                className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {getActivePlans().map((plan, index) => {
                                    const isSelected = selectedPlan && selectedPlan.name === plan.name;
                                    const isPopular = plan.popular;
                                    const colorSet = planColors[index % planColors.length];
                                    
                                    return (
                                        <motion.div
                                            key={index}
                                            variants={itemVariants}
                                            whileHover={{ 
                                                y: -10,
                                                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                                            }}
                                            className={`bg-white rounded-2xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col h-full ${
                                                isSelected 
                                                    ? `${colorSet.ring} ring-2 scale-105` 
                                                    : 'hover:shadow-2xl'
                                            } ${isPopular ? `${colorSet.border} border-2` : ''}`}
                                        >
                                            {isPopular && (
                                                <motion.div 
                                                    className={`bg-gradient-to-r ${colorSet.gradient} text-white text-center py-2 font-semibold`}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.5 }}
                                                >
                                                    MOST POPULAR
                                                </motion.div>
                                            )}
                                            
                                            <div className={`p-8 ${isPopular ? 'pt-6' : ''} flex-grow`}>
                                                <div className="text-center mb-6">
                                                    <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
                                                    
                                                    {/* Period badge */}
                                                    <div className={`inline-block ${colorSet.accent} ${colorSet.text} text-xs font-semibold px-2.5 py-0.5 rounded-full mt-1 mb-3`}>
                                                        {plan.period === 'monthly' ? 'Monthly' : 
                                                        plan.period === 'quarterly' ? '3 Months' : 'Annual'}
                                                    </div>
                                                    
                                                    <div className="flex items-baseline justify-center">
                                                        <span className="text-3xl font-extrabold">{plan.price}€</span>
                                                        <span className="text-gray-500 ml-1 text-sm">
                                                            /{plan.period === 'monthly' ? 'month' : 
                                                            plan.period === 'quarterly' ? '3 months' : 'year'}
                                                        </span>
                                                    </div>
                                                    
                                                    {/* Show savings information for quarterly and yearly plans */}
                                                    {plan.savings && (
                                                        <div className="mt-2 text-sm text-green-600 font-medium">
                                                            {plan.savings}
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <ul className="space-y-3 mb-8">
                                                    {plan.features.map((feature, idx) => (
                                                        <li key={idx} className="flex items-start">
                                                            <div className={`flex-shrink-0 ${colorSet.icon}`}>
                                                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                            </div>
                                                            <span className="ml-2 text-gray-600">{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            
                                            <div className="p-6 bg-gray-50 border-t">
                                                <button
                                                    onClick={() => handleSelectPlan(plan)}
                                                    className={`w-full px-4 py-3 bg-gradient-to-r ${colorSet.button} text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${colorSet.ring}`}
                                                >
                                                    Select Plan
                                                </button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                            
                            {/* Show message if no plans are available for selected period */}
                            {getActivePlans().length === 0 && (
                                <div className="text-center py-10">
                                    <p className="text-gray-600">No plans available for this period at the moment.</p>
                                </div>
                            )}
                            
                            {/* Plan comparison notice */}
                            <div className="text-center mt-8">
                                <Link 
                                    href="#comparison"
                                    className="text-orange-600 hover:text-red-600 font-medium transition-colors duration-300"
                                >
                                    View plan comparison table
                                    <svg className="inline-block ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
            
            {/* Order Summary Modal */}
            {showOrderModal && (
                <OrderSummaryModal
                    isOpen={showOrderModal}
                    onClose={() => setShowOrderModal(false)}
                    plan={selectedPlan}
                    discountData={discountData}
                    setDiscountData={setDiscountData}
                    discountInfo={discountInfo}
                    discountError={discountError}
                    onApplyDiscount={handleApplyDiscount}
                    isUpgrade={isUpgrade}
                    activeSubscription={activeSubscription}
                    upgradeCost={selectedUpgradeCost}
                    loading={loading}
                    processing={processing}
                />
            )}
            
            {/* Plan Comparison Table Section */}
            <div id="comparison" className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Plan Comparison</h2>
                        <p className="text-gray-600">Compare our subscription options to find the perfect fit</p>
                    </div>
                    
                    <PlanComparisonTable plans={plans} />
                </div>
            </div>
            
            {/* FAQ Section */}
            <div className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Frequently Asked Questions</h2>
                        <p className="text-gray-600">Everything you need to know about our membership plans</p>
                    </div>
                    
                    {/* FAQ content here */}
                </div>
            </div>
        </div>
    );
} 