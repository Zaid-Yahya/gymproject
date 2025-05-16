import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { motion } from 'framer-motion';
import OrderSummaryModal from './OrderSummaryModal';
import PlanComparisonTable from './PlanComparisonTable';

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
        <div className="relative overflow-hidden bg-gradient-to-r from-red-50 via-orange-50 to-red-50">
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 animate-pulse-slow"></div>
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-500/5 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-red-500/5 to-transparent"></div>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
                <div className="flex flex-col md:flex-row items-center">
                    <div className="w-full md:w-1/2 pr-0 md:pr-12 mb-10 md:mb-0">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600">
                                Join Us Today
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
                                Transform your body and life with our premium membership plans tailored to your fitness journey.
                            </p>
                            <motion.div 
                                className="inline-block"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <a 
                                    href="#plans" 
                                    className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-lg shadow-lg hover:shadow-red-500/30 transition-all duration-300 inline-flex items-center"
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
                        </motion.div>
                    </div>
                    
                    <div className="w-full md:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="absolute -inset-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl blur-lg opacity-30 animate-pulse-slow"></div>
                            <div className="relative overflow-hidden rounded-xl shadow-2xl">
                                <img 
                                    src="/storage/join_us.jpg" 
                                    alt="Fitness Training" 
                                    className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                                    <div className="p-6">
                                        <p className="text-white font-medium text-lg">Start your fitness journey with us</p>
                                    </div>
                                </div>
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

// Navigation Bar Component
const NavigationBar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    return (
        <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-500 bg-white shadow-sm">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center py-4">
                    {/* Logo */}
                    <div className="text-2xl font-extrabold">
                        <Link href={route('home')}>
                            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">POWER</span>
                            <span className="text-gray-800">GYM</span>
                        </Link>
                    </div>
                    
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-8">
                        <Link 
                            href={route('home')}
                            className="text-sm font-medium transition-all duration-300 text-gray-700 hover:text-orange-500"
                        >
                            ACCUEIL
                        </Link>
                        <a 
                            href="#plans"
                            className="text-sm font-medium transition-all duration-300 text-orange-500"
                        >
                            ABONNEMENTS
                        </a>
                        <Link 
                            href={route('home')}
                            className="text-sm font-medium transition-all duration-300 text-gray-700 hover:text-orange-500"
                        >
                            PROGRAMMES
                        </Link>
                        <Link 
                            href={route('home')}
                            className="text-sm font-medium transition-all duration-300 text-gray-700 hover:text-orange-500"
                        >
                            GALERIE
                        </Link>
                        <Link 
                            href={route('home')}
                            className="text-sm font-medium transition-all duration-300 text-gray-700 hover:text-orange-500"
                        >
                            CONTACT
                        </Link>
                    </div>
                    
                    {/* Authentication Links */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link 
                            href={route('login')} 
                            className="px-4 py-2 transition-all duration-300 text-gray-700 hover:text-orange-500"
                        >
                            Connexion
                        </Link>
                        <Link 
                            href={route('register')} 
                            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:scale-105 transform shadow-md hover:shadow-orange-500/30"
                        >
                            Rejoindre
                        </Link>
                    </div>
                    
                    {/* Mobile menu button */}
                    <button 
                        className="md:hidden text-gray-700"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                            </svg>
                        )}
                    </button>
                </div>
                
                {/* Mobile menu */}
                <div className={`md:hidden transition-all duration-500 overflow-hidden ${mobileMenuOpen ? 'max-h-96 mt-4' : 'max-h-0'}`}>
                    <div className="flex flex-col space-y-4 pt-2 pb-4 rounded-lg shadow-lg bg-white">
                        <Link 
                            href={route('home')}
                            className="text-sm font-medium py-2 transition-all duration-300 text-gray-700 hover:text-orange-500"
                        >
                            ACCUEIL
                        </Link>
                        <a 
                            href="#plans"
                            className="text-sm font-medium py-2 transition-all duration-300 text-orange-500"
                        >
                            ABONNEMENTS
                        </a>
                        <Link 
                            href={route('home')}
                            className="text-sm font-medium py-2 transition-all duration-300 text-gray-700 hover:text-orange-500"
                        >
                            PROGRAMMES
                        </Link>
                        <Link 
                            href={route('home')}
                            className="text-sm font-medium py-2 transition-all duration-300 text-gray-700 hover:text-orange-500"
                        >
                            GALERIE
                        </Link>
                        <Link 
                            href={route('home')}
                            className="text-sm font-medium py-2 transition-all duration-300 text-gray-700 hover:text-orange-500"
                        >
                            CONTACT
                        </Link>
                        <div className="pt-2 flex flex-col space-y-3 px-4">
                            <Link 
                                href={route('login')} 
                                className="py-2 text-gray-700 hover:text-orange-500 transition-all duration-300"
                            >
                                Connexion
                            </Link>
                            <Link 
                                href={route('register')} 
                                className="py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-center rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-300"
                            >
                                Rejoindre
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default function Plans({ plans, hasActiveSubscription }) {
    const { auth } = usePage().props;
    const [loading, setLoading] = useState(false);
    const [discountInfo, setDiscountInfo] = useState(null);
    const [discountError, setDiscountError] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showOrderModal, setShowOrderModal] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        plan_name: '',
        original_price: 0,
        price: 0,
        discount_id: null,
    });

    const { data: discountData, setData: setDiscountData, processing: discountProcessing } = useForm({
        code: '',
        plan_price: 0,
    });

    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan);
        setDiscountInfo(null);
        setDiscountData({
            code: '',
            plan_price: plan.price,
        });
        setShowOrderModal(true);
    };

    const handleSubscribe = () => {
        const planToUse = selectedPlan;
        
        if (!planToUse) return;
        
        setData({
            plan_name: planToUse.name,
            original_price: planToUse.price,
            price: discountInfo ? discountInfo.pricing.discounted : planToUse.price,
            discount_id: discountInfo ? discountInfo.discount.id : null,
        });
        
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        
        post(route('subscriptions.subscribe'));
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

    return (
        <div className="min-h-screen bg-gradient-to-b from-rose-50 to-red-100 relative overflow-hidden">
            <Head title="Subscription Plans" />
            
            {/* Animated background */}
            <AnimatedBackground />
            
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-rose-50 via-transparent to-red-100 -z-10"></div>
            
            <NavigationBar />

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
                                <h2 className="text-4xl font-bold">Membership Plans</h2>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Choose Your Perfect Plan</h3>
                        <motion.p 
                            className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto"
                            animate={pulseAnimation}
                        >
                            Select a plan that fits your fitness journey and goals
                        </motion.p>
                    </motion.div>

                    {hasActiveSubscription && (
                        <motion.div 
                            className="bg-white border-l-4 border-red-400 p-4 mb-8 rounded-md shadow-md"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-gray-600">
                                        You already have an active subscription. Subscribing to a new plan will replace your current one.
                                        <Link
                                            href={route('subscriptions.index')}
                                            className="font-medium underline text-red-500 hover:text-red-600 ml-1 transition-colors duration-300"
                                        >
                                            View your current subscriptions
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {plans.map((plan, index) => {
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
                                    className={`bg-white rounded-2xl overflow-hidden shadow-xl transition-all duration-300 ${
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
                                    
                                    <div className="p-6">
                                        <div className={`w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center bg-gradient-to-br ${colorSet.gradient} shadow-lg`}>
                                            <svg 
                                                className="w-8 h-8 text-white" 
                                                fill="none" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24"
                                            >
                                                {index === 0 ? (
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                ) : index === 1 ? (
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                ) : (
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                )}
                                            </svg>
                                        </div>
                                        
                                        <h3 className="text-2xl font-bold mb-2 text-center text-gray-800">{plan.name}</h3>
                                        
                                        <div className="flex items-baseline justify-center mb-6">
                                            <span className={`text-5xl font-bold ${colorSet.text}`}>${plan.price}</span>
                                            <span className="text-gray-500 ml-1 text-lg">/{plan.period}</span>
                                        </div>
                                        
                                        <div className={`h-1 ${colorSet.accent} rounded-full mb-6`}></div>
                                            
                                        <ul className="space-y-3 mb-8">
                                            {plan.features.map((feature, idx) => (
                                                <motion.li 
                                                    key={idx} 
                                                    className="flex items-center text-gray-600"
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.1 * idx }}
                                                >
                                                    <div className={`w-6 h-6 rounded-full ${colorSet.accent} flex items-center justify-center mr-2 flex-shrink-0`}>
                                                        <svg 
                                                            className={`w-4 h-4 ${colorSet.icon}`}
                                                            fill="currentColor" 
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <span>{feature}</span>
                                                </motion.li>
                                            ))}
                                        </ul>
                                        
                                        <div className="h-12 flex items-center justify-center"> {/* Fixed height container for buttons */}
                                            <motion.button
                                                onClick={() => handleSelectPlan(plan)}
                                                whileTap={{ scale: 0.95 }}
                                                whileHover={{ scale: 1.05 }}
                                                className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 shadow-md ${
                                                    isSelected
                                                        ? `bg-gradient-to-r ${colorSet.button} text-white`
                                                        : `bg-gradient-to-r ${colorSet.button} text-white hover:shadow-lg hover:shadow-${colorSet.button.split('-')[2]}-500/30`
                                                }`}
                                            >
                                                {isSelected ? 'Selected' : 'Select Plan'}
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    {/* Plan Comparison Table */}
                    <PlanComparisonTable plans={plans} />

                    {/* Order Summary Modal */}
                    <OrderSummaryModal
                        show={showOrderModal}
                        onClose={() => setShowOrderModal(false)}
                        selectedPlan={selectedPlan}
                        discountInfo={discountInfo}
                        discountError={discountError}
                        discountData={discountData}
                        setDiscountData={setDiscountData}
                        handleApplyDiscount={handleApplyDiscount}
                        handleSubscribe={handleSubscribe}
                        loading={loading}
                        processing={processing}
                    />
                </div>
            </div>

            {/* Add custom animation styles */}
            <style jsx global>{`
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.7; }
                    50% { opacity: 1; }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
        </div>
    );
} 