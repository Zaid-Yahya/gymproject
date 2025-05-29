import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function PlanComparisonTable({ plans }) {
    const [activePeriod, setActivePeriod] = useState('monthly');
    
    // Group plans by name first, then by period
    const groupedPlans = plans.reduce((acc, plan) => {
        if (!acc[plan.name]) {
            acc[plan.name] = {};
        }
        acc[plan.name][plan.period] = plan;
        return acc;
    }, {});
    
    // Get plan types (Basic, Premium, Elite)
    const planTypes = Object.keys(groupedPlans);
    
    // Get all periods
    const periods = ['monthly', 'quarterly', 'yearly'];
    
    // Get all unique features from all plans
    const features = [...new Set(plans.flatMap(plan => plan.features))].slice(0, 10);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { type: "spring", stiffness: 100 }
        }
    };
    
    // Format price display based on period
    const formatPrice = (price, period) => {
        switch(period) {
            case 'monthly': return `${price}€/month`;
            case 'quarterly': return `${price}€/3 months`;
            case 'yearly': return `${price}€/year`;
            default: return `${price}€`;
        }
    };
    
    // Helper to get period text
    const getPeriodText = (period) => {
        switch(period) {
            case 'monthly': return 'Monthly';
            case 'quarterly': return '3 Months';
            case 'yearly': return 'Yearly';
            default: return period;
        }
    };

    return (
        <motion.div 
            className="bg-white rounded-xl shadow-xl overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6">
                <h2 className="text-2xl font-bold text-center">Compare All Plans</h2>
                <p className="text-center text-red-100 mt-2">Choose the plan that best fits your fitness goals</p>
            </div>
            
            {/* Period selection tabs */}
            <div className="flex justify-center p-4 bg-gray-50 border-b border-gray-200">
                <div className="inline-flex rounded-md shadow-sm">
                    {periods.map(period => (
                        <button
                            key={period}
                            onClick={() => setActivePeriod(period)}
                            className={`px-4 py-2 text-sm font-medium ${
                                activePeriod === period
                                    ? 'bg-red-500 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                            } ${
                                period === 'monthly' 
                                    ? 'rounded-l-lg border border-gray-200' 
                                    : period === 'yearly' 
                                        ? 'rounded-r-lg border border-l-0 border-gray-200' 
                                        : 'border-t border-b border-gray-200'
                            }`}
                        >
                            {getPeriodText(period)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="py-4 px-6 text-left font-semibold text-gray-600 w-1/4 border-b border-gray-200">Features</th>
                            {planTypes.map((planType, index) => {
                                const plan = groupedPlans[planType][activePeriod];
                                // If no plan exists for this type and period, show placeholder
                                if (!plan) return (
                                    <motion.th 
                                        key={index} 
                                        className="py-4 px-6 text-center font-semibold border-b border-gray-200"
                                        variants={itemVariants}
                                    >
                                        <span className="text-lg text-gray-400">{planType}</span>
                                        <p className="text-sm text-gray-400">Not available</p>
                                    </motion.th>
                                );
                                
                                return (
                                    <motion.th 
                                        key={index} 
                                        className="py-4 px-6 text-center font-semibold border-b border-gray-200"
                                        variants={itemVariants}
                                    >
                                        <span className={`text-lg ${plan.popular ? 'text-red-600' : 'text-gray-800'}`}>
                                            {planType}
                                        </span>
                                        <p className={`text-sm ${plan.popular ? 'text-red-500' : 'text-gray-500'}`}>
                                            {formatPrice(plan.price, plan.period)}
                                        </p>
                                        {plan.savings && (
                                            <p className="text-xs text-green-600 mt-1">{plan.savings}</p>
                                        )}
                                    </motion.th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {/* Billing Period Row */}
                        <motion.tr 
                            className="bg-gray-50"
                            variants={itemVariants}
                        >
                            <td className="py-4 px-6 border-b border-gray-200 text-gray-700 font-medium">
                                Billing Period
                            </td>
                            {planTypes.map((planType, index) => {
                                const plan = groupedPlans[planType][activePeriod];
                                if (!plan) return (
                                    <td key={index} className="py-4 px-6 text-center border-b border-gray-200 text-gray-400">
                                        -
                                    </td>
                                );
                                
                                return (
                                    <td key={index} className="py-4 px-6 text-center border-b border-gray-200 font-medium">
                                        {getPeriodText(plan.period)}
                                    </td>
                                );
                            })}
                        </motion.tr>
                        
                        {/* Monthly Cost Row */}
                        <motion.tr 
                            className="bg-white"
                            variants={itemVariants}
                        >
                            <td className="py-4 px-6 border-b border-gray-200 text-gray-700 font-medium">
                                Effective Monthly Cost
                            </td>
                            {planTypes.map((planType, index) => {
                                const plan = groupedPlans[planType][activePeriod];
                                if (!plan) return (
                                    <td key={index} className="py-4 px-6 text-center border-b border-gray-200 text-gray-400">
                                        -
                                    </td>
                                );
                                
                                const monthlyCost = (plan.price / plan.duration).toFixed(2);
                                return (
                                    <td key={index} className="py-4 px-6 text-center border-b border-gray-200">
                                        <span className={activePeriod !== 'monthly' ? 'text-green-600 font-medium' : ''}>
                                            {monthlyCost}€/month
                                        </span>
                                    </td>
                                );
                            })}
                        </motion.tr>
                        
                        {/* Features Rows */}
                        {features.map((feature, index) => (
                            <motion.tr 
                                key={index}
                                className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                                variants={itemVariants}
                            >
                                <td className="py-4 px-6 border-b border-gray-200 text-gray-700">{feature}</td>
                                {planTypes.map((planType, planIndex) => {
                                    const plan = groupedPlans[planType][activePeriod];
                                    if (!plan) return (
                                        <td 
                                            key={planIndex} 
                                            className="py-4 px-6 text-center border-b border-gray-200 text-gray-400"
                                        >
                                            -
                                        </td>
                                    );
                                    
                                    return (
                                        <td 
                                            key={planIndex} 
                                            className="py-4 px-6 text-center border-b border-gray-200"
                                        >
                                            {plan.features.includes(feature) ? (
                                                <motion.div 
                                                    className="flex justify-center"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: "spring", stiffness: 200, delay: 0.1 * index }}
                                                >
                                                    <span className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100 text-green-600">
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </span>
                                                </motion.div>
                                            ) : (
                                                <motion.div 
                                                    className="flex justify-center"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: "spring", stiffness: 200, delay: 0.1 * index }}
                                                >
                                                    <span className="w-8 h-8 rounded-full flex items-center justify-center bg-red-100 text-red-500">
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </span>
                                                </motion.div>
                                            )}
                                        </td>
                                    );
                                })}
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="p-6 bg-gray-50 border-t border-gray-200">
                <div className="text-center text-sm text-gray-600 mb-4">
                    <p>Looking for even more savings? Check out our {activePeriod === 'monthly' ? 'quarterly or yearly' : 
                                                                      activePeriod === 'quarterly' ? 'yearly' : 'longer term'} plans!</p>
                </div>
                <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                    <span className="text-gray-600 font-medium">Ready to get started?</span>
                    <a
                        href="#plans"
                        className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-semibold hover:from-red-600 hover:to-orange-600 transition-all shadow-md cursor-pointer"
                    >
                        Choose Your Plan
                    </a>
                </div>
            </div>
        </motion.div>
    );
} 