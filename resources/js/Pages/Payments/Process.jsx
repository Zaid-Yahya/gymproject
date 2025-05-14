import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';

export default function Process({ subscription, paymentMethods }) {
    const [selectedMethod, setSelectedMethod] = useState('credit_card');
    const [showCardForm, setShowCardForm] = useState(true);

    const { data, setData, post, processing, errors } = useForm({
        payment_method: 'credit_card',
        card_number: '',
        card_expiry: '',
        card_cvc: '',
        card_holder: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('payment.store', subscription.id));
    };

    const handlePaymentMethodChange = (methodId) => {
        setSelectedMethod(methodId);
        setData('payment_method', methodId);
        setShowCardForm(methodId === 'credit_card');
    };

    return (
        <>
            <Head title="Process Payment" />

            <div className="py-12 bg-gray-100 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Complete Your Payment</h2>
                        <p className="text-gray-600 mt-1">Secure checkout for your subscription</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Order Summary */}
                        <div className="md:col-span-1">
                            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                                <h3 className="font-semibold mb-4 pb-2 border-b">Order Summary</h3>
                                
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Plan:</span>
                                        <span className="font-medium">{subscription.plan_name}</span>
                                    </div>
                                    
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Period:</span>
                                        <span className="font-medium">Monthly</span>
                                    </div>
                                    
                                    {subscription.discount && (
                                        <>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Original Price:</span>
                                                <span className="font-medium line-through text-gray-500">
                                                    ${subscription.original_price}
                                                </span>
                                            </div>
                                            
                                            <div className="flex justify-between text-green-600">
                                                <span>Discount:</span>
                                                <span className="font-medium">
                                                    -${(subscription.original_price - subscription.price).toFixed(2)}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                    
                                    <div className="flex justify-between pt-2 border-t font-semibold text-base">
                                        <span>Total:</span>
                                        <span>${subscription.price}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mt-0.5">
                                        <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-blue-700">
                                            This is a demo payment system. No real payments will be processed.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Form */}
                        <div className="md:col-span-2">
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="font-semibold mb-6 pb-2 border-b">Payment Method</h3>
                                
                                <div className="mb-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {paymentMethods.map((method) => (
                                            <div 
                                                key={method.id}
                                                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                                    selectedMethod === method.id 
                                                        ? 'border-red-500 bg-red-50' 
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                                onClick={() => handlePaymentMethodChange(method.id)}
                                            >
                                                <div className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="payment_method"
                                                        checked={selectedMethod === method.id}
                                                        onChange={() => {}}
                                                        className="text-red-600 focus:ring-red-500 h-4 w-4"
                                                    />
                                                    <span className="ml-2 font-medium text-gray-700">
                                                        {method.name}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-2">
                                                    {method.description}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                <form onSubmit={handleSubmit}>
                                    {showCardForm && (
                                        <div className="space-y-4 mb-6">
                                            <div>
                                                <label htmlFor="card_holder" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Cardholder Name
                                                </label>
                                                <input
                                                    type="text"
                                                    id="card_holder"
                                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                                    placeholder="John Doe"
                                                    value={data.card_holder}
                                                    onChange={(e) => setData('card_holder', e.target.value)}
                                                />
                                                {errors.card_holder && (
                                                    <p className="text-red-500 text-xs mt-1">{errors.card_holder}</p>
                                                )}
                                            </div>
                                            
                                            <div>
                                                <label htmlFor="card_number" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Card Number
                                                </label>
                                                <input
                                                    type="text"
                                                    id="card_number"
                                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                                    placeholder="4242 4242 4242 4242"
                                                    value={data.card_number}
                                                    onChange={(e) => setData('card_number', e.target.value)}
                                                />
                                                {errors.card_number && (
                                                    <p className="text-red-500 text-xs mt-1">{errors.card_number}</p>
                                                )}
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="card_expiry" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Expiration Date
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="card_expiry"
                                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                                        placeholder="MM/YY"
                                                        value={data.card_expiry}
                                                        onChange={(e) => setData('card_expiry', e.target.value)}
                                                    />
                                                    {errors.card_expiry && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.card_expiry}</p>
                                                    )}
                                                </div>
                                                
                                                <div>
                                                    <label htmlFor="card_cvc" className="block text-sm font-medium text-gray-700 mb-1">
                                                        CVC
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="card_cvc"
                                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                                        placeholder="123"
                                                        value={data.card_cvc}
                                                        onChange={(e) => setData('card_cvc', e.target.value)}
                                                    />
                                                    {errors.card_cvc && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.card_cvc}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {selectedMethod === 'paypal' && (
                                        <div className="bg-blue-50 p-4 rounded-lg mb-6">
                                            <p className="text-sm text-blue-700">
                                                You will be redirected to PayPal to complete your payment.
                                            </p>
                                        </div>
                                    )}
                                    
                                    {selectedMethod === 'bank_transfer' && (
                                        <div className="bg-blue-50 p-4 rounded-lg mb-6">
                                            <p className="text-sm text-blue-700">
                                                You'll receive bank transfer instructions after proceeding.
                                            </p>
                                        </div>
                                    )}
                                    
                                    <div className="pt-4 border-t">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full bg-red-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                                        >
                                            {processing ? 'Processing...' : `Pay $${subscription.price}`}
                                        </button>
                                        
                                        <div className="mt-4 text-center">
                                            <Link 
                                                href={route('subscriptions.plans')} 
                                                className="text-sm text-gray-600 hover:text-gray-900"
                                            >
                                                Return to plans
                                            </Link>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 