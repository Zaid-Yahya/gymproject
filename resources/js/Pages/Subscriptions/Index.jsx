import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';

export default function Index({ subscriptions, hasActiveSubscription }) {
    const { post, processing } = useForm();

    const handleCancel = (id) => {
        if (confirm('Are you sure you want to cancel this subscription? This action cannot be undone.')) {
            post(route('subscriptions.cancel', id));
        }
    };

    const handleRenew = (id) => {
        post(route('subscriptions.renew', id));
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'expired':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <>
            <Head title="My Subscriptions" />

            <div className="py-12 bg-gray-100 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">My Subscriptions</h2>
                        
                        <Link
                            href={route('subscriptions.plans')}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            New Subscription
                        </Link>
                    </div>

                    {subscriptions.length === 0 ? (
                        <div className="bg-white shadow rounded-lg p-6 text-center">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No subscriptions yet</h3>
                            <p className="text-gray-500 mb-4">You don't have any subscriptions at the moment.</p>
                            <Link
                                href={route('subscriptions.plans')}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                            >
                                Browse Plans
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-white shadow overflow-hidden rounded-lg">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Plan
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
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {subscriptions.map((subscription) => (
                                            <tr key={subscription.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {subscription.plan_name}
                                                    </div>
                                                    {subscription.discount && (
                                                        <div className="text-xs text-green-600">
                                                            Discount applied: {subscription.discount.name}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(subscription.status)}`}>
                                                        {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div>From: {formatDate(subscription.start_date)}</div>
                                                    <div>To: {formatDate(subscription.end_date)}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {subscription.discount ? (
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">${subscription.price}</div>
                                                            <div className="text-xs text-gray-500 line-through">${subscription.original_price}</div>
                                                        </div>
                                                    ) : (
                                                        <div className="text-sm font-medium text-gray-900">${subscription.price}</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="flex space-x-2">
                                                        {subscription.status === 'active' && (
                                                            <button
                                                                onClick={() => handleRenew(subscription.id)}
                                                                disabled={processing}
                                                                className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                                                            >
                                                                Renew
                                                            </button>
                                                        )}
                                                        {(subscription.status === 'active' || subscription.status === 'pending') && (
                                                            <button
                                                                onClick={() => handleCancel(subscription.id)}
                                                                disabled={processing}
                                                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                                            >
                                                                Cancel
                                                            </button>
                                                        )}
                                                        <Link
                                                            href={route('payments.index')}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            View Payments
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
} 