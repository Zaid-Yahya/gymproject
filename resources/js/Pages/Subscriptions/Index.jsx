import React, { useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/Components/Navbar';
import PageTransition from '@/Components/PageTransition';

// Dynamic background with animated gradient and design elements
const DynamicBackground = () => {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden">
            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50"></div>
            
            {/* Animated decorative elements */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-red-600 opacity-[0.03] rounded-full transform -translate-y-1/3 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-red-600 opacity-[0.03] rounded-full transform translate-y-1/3 -translate-x-1/3"></div>
            
            {/* Accent lines */}
            <div className="absolute inset-0">
                <div className="absolute top-[15%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-200 to-transparent opacity-30"></div>
                <div className="absolute top-[85%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-200 to-transparent opacity-30"></div>
            </div>
            
            {/* Pattern overlay */}
            <div className="absolute inset-0 bg-pattern opacity-5"></div>
        </div>
    );
};

// Table status badge component with improved design
const StatusBadge = ({ status }) => {
    const getStatusStyles = () => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
            case 'pending':
                return 'bg-gradient-to-r from-amber-500 to-amber-600 text-white';
            case 'cancelled':
                return 'bg-gradient-to-r from-red-500 to-red-600 text-white';
            case 'expired':
                return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
            default:
                return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
        }
    };
    
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase shadow-sm ${getStatusStyles()}`}>
            {status}
        </span>
    );
};

// Premium Badge Component
const PremiumBadge = () => {
    return (
        <span className="px-3 py-1 bg-gradient-to-r from-amber-200 to-amber-400 text-amber-800 rounded-full text-xs font-semibold shadow-sm">
            PREMIUM
        </span>
    );
};

// Empty State Component with consistent colors
const EmptyState = () => {
    return (
        <motion.div 
            className="bg-white rounded-xl p-10 shadow-lg text-center border border-gray-100"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
        >
            <div className="mb-6 mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Active Subscriptions</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                You haven't subscribed to any plans yet. Choose from our membership options to start your fitness journey.
            </p>
            
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                    href={route('subscriptions.plans')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-sm transition-all duration-200"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Browse Plans
                </Link>
            </motion.div>
        </motion.div>
    );
};

// Action Button component for consistent styling
const ActionButton = ({ onClick, disabled, color = "red", children }) => {
    const getColorClasses = () => {
        switch (color) {
            case 'red':
                return 'bg-red-600 hover:bg-red-700';
            case 'green':
                return 'bg-green-600 hover:bg-green-700';
            case 'gray':
                return 'bg-gray-600 hover:bg-gray-700';
            case 'amber':
                return 'bg-amber-500 hover:bg-amber-600';
            default:
                return 'bg-red-600 hover:bg-red-700';
        }
    };
    
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`px-3 py-1.5 ${getColorClasses()} text-white rounded-md text-xs font-medium transition-all duration-200 disabled:opacity-50 shadow-sm`}
        >
            {children}
        </button>
    );
};

// Main component
export default function Index({ subscriptions, hasActiveSubscription, auth }) {
    const { post, processing } = useForm();
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [actionMessage, setActionMessage] = useState('');
    
    const handleCancel = (id) => {
        if (confirm('Are you sure you want to cancel this subscription? This action cannot be undone.')) {
            post(route('subscriptions.cancel', id), {
                onSuccess: () => {
                    setActionMessage('Subscription cancelled successfully');
                    setShowSuccessMessage(true);
                    setTimeout(() => setShowSuccessMessage(false), 3000);
                }
            });
        }
    };

    const handleRenew = (id) => {
        post(route('subscriptions.renew', id), {
            onSuccess: () => {
                setActionMessage('Subscription renewed successfully');
                setShowSuccessMessage(true);
                setTimeout(() => setShowSuccessMessage(false), 3000);
            }
        });
    };
    
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    
    // Page transition variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };
    
    const itemVariants = {
        hidden: { y: 10, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    };

    // Add CSS for background pattern
    useEffect(() => {
        const styleEl = document.createElement('style');
        styleEl.textContent = `
            .bg-pattern {
                background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ef4444' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
            }
            
            @keyframes pulseGlow {
                0%, 100% { box-shadow: 0 0 0 rgba(239, 68, 68, 0); }
                50% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.2); }
            }
            
            .table-row-hover:hover {
                background-color: rgba(239, 68, 68, 0.03);
                transition: all 0.2s ease;
            }
            
            .animate-pulse-glow {
                animation: pulseGlow 3s infinite;
            }
        `;
        document.head.appendChild(styleEl);
        
        return () => {
            document.head.removeChild(styleEl);
        };
    }, []);

    return (
        <>
            <Head title="My Subscriptions" />
            
            {/* Dynamic background */}
            <DynamicBackground />
            
            {/* Navbar */}
            <Navbar />
            
            <PageTransition variant="fadeScale">
                <div className="pt-32 pb-12 min-h-screen">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Enhanced Header with visual elements */}
                        <div className="mb-16">
                            <motion.div 
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden shadow-2xl p-10 mb-8">
                                    {/* Abstract shape decorations */}
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-600 opacity-10 rounded-full transform translate-x-1/3 -translate-y-1/3"></div>
                                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500 opacity-10 rounded-full transform -translate-x-1/3 translate-y-1/3"></div>
                                    
                                    {/* Diagonal line decorations */}
                                    <div className="absolute inset-0 opacity-20">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-transparent"></div>
                                        <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-red-500 to-transparent"></div>
                                    </div>
                                    
                                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
                                        <div className="text-center md:text-left mb-8 md:mb-0">
                                            <div className="inline-block px-3 py-1 bg-red-600 bg-opacity-20 rounded-full text-red-400 text-sm font-semibold mb-4">POWER GYM MEMBERSHIP</div>
                                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">Turn <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Subscriptions</span><br />Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Strength</span></h1>
                                            <p className="text-gray-300 max-w-lg">
                                                Your active memberships fuel your transformation journey. 
                                                Each plan brings you closer to the powerful version of yourself you're working to become.
                                            </p>
                                        </div>
                                        
                                        <div className="flex-shrink-0 relative">
                                            <div className="w-64 h-64 rounded-full bg-gradient-to-br from-orange-500 to-red-600 p-1">
                                                <div className="w-full h-full rounded-full overflow-hidden border-2 border-white border-opacity-30">
                                                    <img 
                                                        src="https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80" 
                                                        alt="Fitness Motivation" 
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </div>
                                            
                                            {/* Decorative floating elements */}
                                            <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-500 bg-opacity-80 rounded-xl transform rotate-12 shadow-lg"></div>
                                            <div className="absolute -bottom-6 left-6 w-8 h-8 bg-red-600 rounded-lg transform -rotate-12 shadow-lg"></div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                        
                        {/* Success message notification */}
                        <AnimatePresence>
                            {showSuccessMessage && (
                                <motion.div 
                                    className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-lg shadow-sm"
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <p className="font-medium">{actionMessage}</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        {/* Content - Enhanced Table Design */}
                        {subscriptions.length === 0 ? (
                            <EmptyState />
                        ) : (
                            <motion.div 
                                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 animate-pulse-glow"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {/* Table Title Bar */}
                                <div className="bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-4">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-lg font-bold">Active Subscriptions</h2>
                                        <span className="text-sm opacity-80">Total: {subscriptions.length}</span>
                                    </div>
                                </div>
                                
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Membership
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Period
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Price
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {subscriptions.map((subscription, index) => {
                                                const isPremium = 
                                                    subscription.plan_name.toLowerCase().includes('premium') || 
                                                    subscription.plan_name.toLowerCase().includes('elite') ||
                                                    subscription.price > 100;
                                                    
                                                // Alternating row colors
                                                const rowBgClass = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
                                                    
                                                return (
                                                    <motion.tr 
                                                        key={subscription.id}
                                                        variants={itemVariants}
                                                        className={`${rowBgClass} table-row-hover`}
                                                    >
                                                        {/* Membership */}
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex flex-col">
                                                                <div className="text-sm font-bold text-gray-900">
                                                                    {subscription.plan_name}
                                                                </div>
                                                                <div className="mt-1 flex items-center gap-2">
                                                                    {isPremium && <PremiumBadge />}
                                                                    {subscription.discount && (
                                                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                                            {subscription.discount.name}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="mt-1 text-xs text-gray-500">
                                                                    ID: #{subscription.id}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        
                                                        {/* Status */}
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <StatusBadge status={subscription.status} />
                                                        </td>
                                                        
                                                        {/* Period */}
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-700">
                                                                <div className="flex items-center">
                                                                    <span className="w-16 text-xs text-gray-500 uppercase">Start:</span>
                                                                    <span className="font-medium">{formatDate(subscription.start_date)}</span>
                                                                </div>
                                                                <div className="mt-2 flex items-center">
                                                                    <span className="w-16 text-xs text-gray-500 uppercase">End:</span>
                                                                    <span className="font-medium">{formatDate(subscription.end_date)}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        
                                                        {/* Price */}
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {subscription.discount ? (
                                                                <div>
                                                                    <div className="text-md font-bold text-gray-900">${subscription.price}</div>
                                                                    <div className="text-xs text-gray-500 line-through">${subscription.original_price}</div>
                                                                    <div className="text-xs text-green-600 font-medium">
                                                                        {Math.round((1 - subscription.price / subscription.original_price) * 100)}% off
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="text-md font-bold text-gray-900">${subscription.price}</div>
                                                            )}
                                                        </td>
                                                        
                                                        {/* Actions */}
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            <div className="flex gap-2">
                                                                {subscription.status === 'active' && (
                                                                    <ActionButton 
                                                                        onClick={() => handleRenew(subscription.id)}
                                                                        disabled={processing}
                                                                        color="green"
                                                                    >
                                                                        Renew
                                                                    </ActionButton>
                                                                )}
                                                                
                                                                {(subscription.status === 'active' || subscription.status === 'pending') && (
                                                                    <ActionButton 
                                                                        onClick={() => handleCancel(subscription.id)} 
                                                                        disabled={processing}
                                                                        color="gray"
                                                                    >
                                                                        Cancel
                                                                    </ActionButton>
                                                                )}
                                                                
                                                                <Link
                                                                    href={route('payments.index')}
                                                                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-medium transition-all duration-200 shadow-sm inline-flex items-center"
                                                                >
                                                                    <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                                    </svg>
                                                                    Payments
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </PageTransition>
        </>
    );
} 