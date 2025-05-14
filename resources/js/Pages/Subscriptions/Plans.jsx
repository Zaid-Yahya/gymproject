import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';

export default function Plans({ plans, hasActiveSubscription }) {
    const [loading, setLoading] = useState(false);
    const [discountInfo, setDiscountInfo] = useState(null);
    const [discountError, setDiscountError] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);

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

    return (
        <>
            <Head title="Subscription Plans" />

            <div className="py-12 bg-gray-100 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Choose Your Plan</h2>
                        <p className="mt-4 text-lg text-gray-600">
                            Select the perfect membership plan for your fitness journey
                        </p>
                    </div>

                    {hasActiveSubscription && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700">
                                        You already have an active subscription. Subscribing to a new plan will replace your current one.
                                        <Link
                                            href={route('subscriptions.index')}
                                            className="font-medium underline text-yellow-700 hover:text-yellow-600 ml-1"
                                        >
                                            View your current subscriptions
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        {plans.map((plan, index) => {
                            const isSelected = selectedPlan && selectedPlan.name === plan.name;
                            const isPopular = plan.popular;
                            
                            return (
                                <div
                                    key={index}
                                    className={`bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-300 transform ${isSelected ? 'ring-2 ring-red-500 scale-105' : 'hover:shadow-xl'} ${isPopular ? 'border-2 border-red-500' : ''}`}
                                >
                                    {isPopular && (
                                        <div className="bg-red-500 text-white text-center py-2 font-semibold">
                                            Most Popular
                                        </div>
                                    )}
                                    
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                                        
                                        <div className="flex items-baseline mb-4">
                                            <span className="text-4xl font-bold">${plan.price}</span>
                                            <span className="text-gray-500 ml-1">/{plan.period}</span>
                                        </div>
                                        
                                        <ul className="space-y-3 mb-6">
                                            {plan.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-center">
                                                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                        
                                        <button
                                            onClick={() => handleSelectPlan(plan)}
                                            className={`w-full py-2 rounded-md font-semibold transition-colors ${
                                                isSelected
                                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                            }`}
                                        >
                                            {isSelected ? 'Selected' : 'Select Plan'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {selectedPlan && (
                        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                            
                            <div className="mb-6">
                                <div className="flex justify-between py-2 border-b">
                                    <span>Plan:</span>
                                    <span className="font-medium">{selectedPlan.name}</span>
                                </div>
                                
                                <div className="flex justify-between py-2 border-b">
                                    <span>Billing Period:</span>
                                    <span className="font-medium">Monthly</span>
                                </div>
                                
                                <div className="flex justify-between py-2 border-b">
                                    <span>Price:</span>
                                    <span className="font-medium">
                                        {discountInfo ? (
                                            <span>
                                                <span className="line-through text-gray-500 mr-2">${selectedPlan.price}</span>
                                                ${discountInfo.pricing.discounted}
                                            </span>
                                        ) : (
                                            <span>${selectedPlan.price}</span>
                                        )}
                                    </span>
                                </div>
                                
                                {discountInfo && (
                                    <div className="flex justify-between py-2 border-b text-green-600">
                                        <span>Discount ({discountInfo.discount.name}):</span>
                                        <span className="font-medium">-${discountInfo.pricing.savings_formatted} ({discountInfo.pricing.savings_percentage}%)</span>
                                    </div>
                                )}
                                
                                <div className="flex justify-between py-3 font-bold text-lg">
                                    <span>Total:</span>
                                    <span>${discountInfo ? discountInfo.pricing.discounted : selectedPlan.price}</span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <form onSubmit={handleApplyDiscount} className="flex flex-col md:flex-row gap-2">
                                    <input
                                        type="text"
                                        placeholder="Discount Code"
                                        className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                        value={discountData.code}
                                        onChange={(e) => setDiscountData('code', e.target.value)}
                                        disabled={discountProcessing || processing}
                                    />
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
                                        disabled={!discountData.code || discountProcessing || processing || loading}
                                    >
                                        {loading ? 'Checking...' : 'Apply'}
                                    </button>
                                </form>
                                
                                {discountError && (
                                    <p className="mt-2 text-sm text-red-600">{discountError}</p>
                                )}
                                
                                {discountInfo && (
                                    <div className="mt-2 text-sm text-green-600">
                                        {discountInfo.message}
                                    </div>
                                )}
                            </div>
                            
                            <button
                                onClick={handleSubscribe}
                                disabled={processing}
                                className="w-full py-3 px-4 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Processing...' : 'Subscribe Now'}
                            </button>
                            
                            <p className="mt-4 text-sm text-gray-500 text-center">
                                By subscribing, you agree to our Terms of Service and Privacy Policy
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
} 