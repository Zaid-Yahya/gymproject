import React from 'react';
import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';

export default function Plans({ plans }) {
    const { data, setData, post, processing, errors } = useForm({
        plan_name: '',
        price: 0,
    });

    const handleSubscribe = (plan) => {
        setData({
            plan_name: plan.name,
            price: plan.price,
        });
        post(route('subscriptions.subscribe'));
    };

    return (
        <>
            <Head title="Subscription Plans" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Choose Your Plan</h2>
                        <p className="mt-4 text-lg text-gray-600">Select the perfect membership plan for your fitness journey</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {plans.map((plan) => (
                            <div key={plan.name} className="bg-white overflow-hidden shadow-sm rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold text-center mb-4">{plan.name}</h3>
                                    <div className="text-center mb-6">
                                        <span className="text-4xl font-bold">{plan.price} MAD</span>
                                        <span className="text-gray-600">/{plan.duration}</span>
                                    </div>
                                    <ul className="space-y-3 mb-6">
                                        {plan.features.map((feature, index) => (
                                            <li key={index} className="flex items-center">
                                                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <button
                                        onClick={() => handleSubscribe(plan)}
                                        disabled={processing}
                                        className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200"
                                    >
                                        Subscribe Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
} 