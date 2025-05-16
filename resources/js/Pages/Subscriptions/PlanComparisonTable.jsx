import React from 'react';
import { motion } from 'framer-motion';

export default function PlanComparisonTable({ plans }) {
    // Reduced set of features
    const defaultFeatures = [
        "Access hours (6AM - 11PM)",
        "Mixed fitness area",
        "Women-only area",
        "Group classes",
        "Personal trainer sessions"
    ];

    // Get all unique features from plans or use defaults
    const features = plans && plans.length > 0 
        ? [...new Set(plans.flatMap(plan => plan.features))].slice(0, 5)
        : defaultFeatures;

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

    return (
        <motion.div 
            className="bg-white rounded-xl shadow-xl overflow-hidden my-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6">
                <h2 className="text-2xl font-bold text-center">Compare All Plans</h2>
                <p className="text-center text-red-100 mt-2">Choose the plan that best fits your fitness goals</p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="py-4 px-6 text-left font-semibold text-gray-600 w-1/3 border-b border-gray-200">Features</th>
                            {plans && plans.length > 0 ? (
                                plans.map((plan, index) => (
                                    <motion.th 
                                        key={index} 
                                        className="py-4 px-6 text-center font-semibold border-b border-gray-200"
                                        variants={itemVariants}
                                    >
                                        <span className={`text-lg ${index === 1 ? 'text-red-600' : 'text-gray-800'}`}>
                                            {plan.name}
                                        </span>
                                    </motion.th>
                                ))
                            ) : (
                                <>
                                    <motion.th 
                                        className="py-4 px-6 text-center font-semibold border-b border-gray-200"
                                        variants={itemVariants}
                                    >
                                        <span className="text-lg text-gray-800">Basic Pass</span>
                                    </motion.th>
                                    <motion.th 
                                        className="py-4 px-6 text-center font-semibold border-b border-gray-200"
                                        variants={itemVariants}
                                    >
                                        <span className="text-lg text-red-600">Premium Pass</span>
                                    </motion.th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {features.map((feature, index) => (
                            <motion.tr 
                                key={index}
                                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                                variants={itemVariants}
                            >
                                <td className="py-4 px-6 border-b border-gray-200 text-gray-700">{feature}</td>
                                {plans && plans.length > 0 ? (
                                    plans.map((plan, planIndex) => (
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
                                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                        planIndex === 1 
                                                            ? 'bg-red-100 text-red-600' 
                                                            : 'bg-gray-100 text-gray-600'
                                                    }`}>
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
                                                    <span className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-400">
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </span>
                                                </motion.div>
                                            )}
                                        </td>
                                    ))
                                ) : (
                                    <>
                                        <td className="py-4 px-6 text-center border-b border-gray-200">
                                            {index < 3 ? (
                                                <motion.div 
                                                    className="flex justify-center"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: "spring", stiffness: 200, delay: 0.1 * index }}
                                                >
                                                    <span className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-600">
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
                                                    <span className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-400">
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </span>
                                                </motion.div>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-center border-b border-gray-200">
                                            <motion.div 
                                                className="flex justify-center"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", stiffness: 200, delay: 0.1 * index }}
                                            >
                                                <span className="w-8 h-8 rounded-full flex items-center justify-center bg-red-100 text-red-600">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </span>
                                            </motion.div>
                                        </td>
                                    </>
                                )}
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="p-6 bg-gray-50 border-t border-gray-200">
                <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                    <span className="text-gray-600 font-medium">Ready to get started?</span>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-semibold hover:from-red-600 hover:to-orange-600 transition-all shadow-md"
                    >
                        Choose Your Plan
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
} 