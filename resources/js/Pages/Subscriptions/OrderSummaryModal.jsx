import React from 'react';
import { motion } from 'framer-motion';
import Modal from '@/Components/Modal';

export default function OrderSummaryModal({ 
    show, 
    onClose, 
    selectedPlan, 
    discountInfo, 
    discountError, 
    discountData, 
    setDiscountData, 
    handleApplyDiscount, 
    handleSubscribe, 
    loading, 
    processing 
}) {
    if (!selectedPlan) return null;
    
    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <div className="p-8">
                <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                    <h3 className="text-xl font-bold text-gray-800">Order Summary</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
                
                <div className="mb-6">
                    <div className="flex justify-between py-3 border-b border-gray-200 text-gray-600">
                        <span>Selected Plan:</span>
                        <span className="font-medium text-gray-800">{selectedPlan.name}</span>
                    </div>
                    
                    <div className="flex justify-between py-3 border-b border-gray-200 text-gray-600">
                        <span>Billing Cycle:</span>
                        <span className="font-medium text-gray-800">Monthly</span>
                    </div>
                    
                    <div className="flex justify-between py-3 border-b border-gray-200 text-gray-600">
                        <span>Regular Price:</span>
                        <motion.span 
                            className="font-medium text-gray-800"
                            animate={discountInfo ? { x: [0, 5, -5, 5, 0] } : {}}
                            transition={{ duration: 0.5 }}
                        >
                            {discountInfo ? (
                                <span>
                                    <span className="line-through text-gray-400 mr-2">${selectedPlan.price}</span>
                                    <span className="text-red-600">${discountInfo.pricing.discounted}</span>
                                </span>
                            ) : (
                                <span>${selectedPlan.price}</span>
                            )}
                        </motion.span>
                    </div>
                    
                    {discountInfo && (
                        <motion.div 
                            className="flex justify-between py-3 border-b border-gray-200 text-red-600"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ duration: 0.3 }}
                        >
                            <span>Discount Applied ({discountInfo.discount.name}):</span>
                            <span className="font-medium">-${discountInfo.pricing.savings_formatted} ({discountInfo.pricing.savings_percentage}%)</span>
                        </motion.div>
                    )}
                    
                    <motion.div 
                        className="flex justify-between py-4 mt-2"
                        animate={discountInfo ? { 
                            color: ['#1F2937', '#DC2626', '#1F2937'],
                            transition: { duration: 1.5, times: [0, 0.5, 1] }
                        } : {}}
                    >
                        <span className="text-xl font-bold text-gray-800">Total Due Today:</span>
                        <span className="text-2xl font-bold text-red-600">${discountInfo ? discountInfo.pricing.discounted : selectedPlan.price}</span>
                    </motion.div>
                </div>

                <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-medium mb-4 text-gray-700">Have a Discount Code?</h4>
                    <form onSubmit={handleApplyDiscount} className="flex flex-col md:flex-row gap-2">
                        <input
                            type="text"
                            placeholder="Enter your code"
                            className="flex-grow px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-800 placeholder-gray-400 transition-all duration-300"
                            value={discountData.code}
                            onChange={(e) => setDiscountData('code', e.target.value)}
                            disabled={processing}
                        />
                        <motion.button
                            type="submit"
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                            disabled={!discountData.code || processing || loading}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Validating
                                </span>
                            ) : 'Apply Code'}
                        </motion.button>
                    </form>
                    
                    {discountError && (
                        <motion.p 
                            className="mt-3 text-sm text-red-500"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {discountError}
                        </motion.p>
                    )}
                    
                    {discountInfo && (
                        <motion.div 
                            className="mt-3 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                {discountInfo.message}
                            </div>
                        </motion.div>
                    )}
                </div>
                
                <motion.button
                    onClick={handleSubscribe}
                    disabled={processing}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ 
                        boxShadow: "0 0 15px rgba(239, 68, 68, 0.4)",
                    }}
                    className="w-full py-4 px-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-semibold hover:from-red-600 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                    {processing ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </span>
                    ) : (
                        <div className="flex items-center justify-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>COMPLETE SUBSCRIPTION</span>
                            <motion.span 
                                className="ml-2"
                                animate={{ x: [0, 4, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                                →
                            </motion.span>
                        </div>
                    )}
                </motion.button>
                
                <div className="mt-6 flex items-center justify-center space-x-4">
                    <span className="text-xs flex items-center text-gray-500">
                        <svg className="w-4 h-4 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        Secure Payment
                    </span>
                    <span className="text-xs flex items-center text-gray-500">
                        <svg className="w-4 h-4 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                        </svg>
                        Flexible Plans
                    </span>
                    <span className="text-xs flex items-center text-gray-500">
                        <svg className="w-4 h-4 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                        Cancel Anytime
                    </span>
                </div>
            </div>
        </Modal>
    );
} 