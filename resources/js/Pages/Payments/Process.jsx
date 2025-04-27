import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';

export default function Process({ subscription, intent }) {
    const [paymentMethod, setPaymentMethod] = useState('card');
    const { data, setData, post, processing, errors } = useForm({
        payment_method: 'card',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('payment.store', subscription.id));
    };

    return (
        <>
            <Head title="Process Payment" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-6">Payment Details</h2>

                            <div className="mb-6">
                                <h3 className="font-semibold mb-2">Order Summary</h3>
                                <div className="bg-gray-50 p-4 rounded-md">
                                    <div className="flex justify-between mb-2">
                                        <span>Plan:</span>
                                        <span className="font-semibold">{subscription.plan_name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Amount:</span>
                                        <span className="font-semibold">{subscription.price} MAD</span>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Payment Method
                                    </label>
                                    <div className="space-y-2">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                value="card"
                                                checked={data.payment_method === 'card'}
                                                onChange={e => setData('payment_method', e.target.value)}
                                                className="mr-2"
                                            />
                                            Credit/Debit Card
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                value="paypal"
                                                checked={data.payment_method === 'paypal'}
                                                onChange={e => setData('payment_method', e.target.value)}
                                                className="mr-2"
                                            />
                                            PayPal
                                        </label>
                                    </div>
                                </div>

                                {data.payment_method === 'card' && (
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Card Details
                                        </label>
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                placeholder="Card Number"
                                                className="w-full border-gray-300 rounded-md shadow-sm"
                                            />
                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    placeholder="MM/YY"
                                                    className="border-gray-300 rounded-md shadow-sm"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="CVC"
                                                    className="border-gray-300 rounded-md shadow-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200"
                                >
                                    {processing ? 'Processing...' : 'Pay Now'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 