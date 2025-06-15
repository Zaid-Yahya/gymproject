import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { format } from 'date-fns';
import debounce from 'lodash/debounce';

export default function CreateSubscription({ users, discounts }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showNewUserForm, setShowNewUserForm] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isNewUser, setIsNewUser] = useState(false);
    const [activeSubscription, setActiveSubscription] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        user_id: '',
        plan_name: 'Basic',
        period: 'monthly',
        original_price: 0,
        price: 0,
        discount_id: '',
        start_date: format(new Date(), 'yyyy-MM-dd'),
        end_date: format(new Date(new Date().setMonth(new Date().getMonth() + 1)), 'yyyy-MM-dd'),
        is_upgrade: false,
        // New user fields
        new_user: {
            name: '',
            email: '',
        }
    });

    const [selectedDiscount, setSelectedDiscount] = useState(null);

    // Plan prices based on period
    const planPrices = {
        Basic: {
            monthly: 49,
            quarterly: 132,
            yearly: 470,
        },
        Premium: {
            monthly: 89,
            quarterly: 240,
            yearly: 853,
        },
        Elite: {
            monthly: 129,
            quarterly: 348,
            yearly: 1238,
        },
    };

    // Plan tiers for upgrade calculation
    const planTiers = {
        Basic: 1,
        Premium: 2,
        Elite: 3
    };

    // Insurance fee
    const INSURANCE_FEE = 50;

    // Search users with debounce
    const searchUsers = debounce((query) => {
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        const results = users.filter(user => 
            user.name.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(results);
    }, 300);

    useEffect(() => {
        searchUsers(searchQuery);
    }, [searchQuery]);

    // Update prices when plan or period changes
    useEffect(() => {
        if (activeSubscription) {
            // Calculate upgrade price
            const currentPlanTier = planTiers[activeSubscription.plan_name];
            const newPlanTier = planTiers[data.plan_name];
            
            if (newPlanTier <= currentPlanTier) {
                setData(data => ({
                    ...data,
                    original_price: 0,
                    price: 0,
                }));
                return;
            }

            const originalPrice = planPrices[data.plan_name][data.period];
            const discountedPrice = selectedDiscount ? calculateDiscountedPrice(originalPrice, selectedDiscount) : originalPrice;
            
            // Calculate prorated upgrade price
            const daysRemaining = Math.ceil((new Date(activeSubscription.end_date) - new Date()) / (1000 * 60 * 60 * 24));
            const totalDays = Math.ceil((new Date(activeSubscription.end_date) - new Date(activeSubscription.start_date)) / (1000 * 60 * 60 * 24));
            const proratedPrice = (discountedPrice * daysRemaining) / totalDays;

            setData(data => ({
                ...data,
                original_price: originalPrice,
                price: proratedPrice,
                is_upgrade: true,
            }));
        } else {
            const originalPrice = planPrices[data.plan_name][data.period];
            const discountedPrice = selectedDiscount ? calculateDiscountedPrice(originalPrice, selectedDiscount) : originalPrice;
            const finalPrice = isNewUser ? discountedPrice + INSURANCE_FEE : discountedPrice;

            setData(data => ({
                ...data,
                original_price: originalPrice,
                price: finalPrice,
                is_upgrade: false,
            }));
        }
    }, [data.plan_name, data.period, selectedDiscount, isNewUser, activeSubscription]);

    // Calculate discounted price
    const calculateDiscountedPrice = (originalPrice, discount) => {
        if (!discount) return originalPrice;
        
        if (discount.type === 'percentage') {
            return originalPrice - (originalPrice * (discount.value / 100));
        }
        
        return Math.max(0, originalPrice - discount.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.subscriptions.store'), {
            onSuccess: () => {
                reset();
                setSelectedDiscount(null);
                setSelectedUser(null);
                setShowNewUserForm(false);
                setIsNewUser(false);
                setActiveSubscription(null);
            },
            onError: (errors) => {
                console.error('Form submission errors:', errors);
            }
        });
    };

    const handleDiscountChange = (discountId) => {
        const discount = discounts.find(d => d.id === parseInt(discountId));
        setSelectedDiscount(discount);
        setData('discount_id', discountId);
    };

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setData('user_id', user.id);
        setSearchQuery(user.name);
        setSearchResults([]);
        setIsNewUser(false);

        // Check for active subscription
        const activeSub = user.subscriptions?.[0];
        if (activeSub) {
            setActiveSubscription(activeSub);
            setData('plan_name', activeSub.plan_name);
            setData('period', activeSub.period);
        } else {
            setActiveSubscription(null);
            setData('plan_name', 'Basic');
            setData('period', 'monthly');
        }
    };

    const handleNewUser = () => {
        setShowNewUserForm(true);
        setSelectedUser(null);
        setData('user_id', '');
        setIsNewUser(true);
        setActiveSubscription(null);
    };

    return (
        <AdminLayout>
            <Head title="Create Subscription" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h2 className="text-2xl font-semibold mb-6">
                                {activeSubscription ? 'Upgrade Subscription' : 'Create New Subscription'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* User Search/Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Search User</label>
                                    {selectedUser ? (
                                        <div className="mt-1 flex items-center justify-between p-3 bg-indigo-50 rounded-md">
                                            <div>
                                                <span className="text-indigo-800 font-medium">
                                                    Selected User: {selectedUser.name} ({selectedUser.email})
                                                </span>
                                                {activeSubscription && (
                                                    <div className="mt-1 text-sm text-indigo-600">
                                                        Current Plan: {activeSubscription.plan_name} ({activeSubscription.period})
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedUser(null);
                                                    setData('user_id', '');
                                                    setSearchQuery('');
                                                    setShowNewUserForm(false);
                                                    setIsNewUser(false);
                                                    setActiveSubscription(null);
                                                    reset('new_user');
                                                }}
                                                className="text-sm text-indigo-600 hover:text-indigo-500"
                                            >
                                                Change User
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="mt-1 relative">
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => {
                                                    setSearchQuery(e.target.value);
                                                    setShowNewUserForm(false);
                                                }}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                placeholder="Search by name or email..."
                                            />
                                            {searchQuery.length > 0 && searchResults.length > 0 && (
                                                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200">
                                                    {searchResults.map(user => (
                                                        <button
                                                            key={user.id}
                                                            type="button"
                                                            onClick={() => handleUserSelect(user)}
                                                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                                        >
                                                            {user.name} ({user.email})
                                                            {user.subscriptions?.[0] && (
                                                                <span className="text-sm text-gray-500 ml-2">
                                                                    - Current Plan: {user.subscriptions[0].plan_name}
                                                                </span>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                            {searchQuery.length > 0 && searchResults.length === 0 && !showNewUserForm && (
                                                <p className="mt-2 text-sm text-gray-500">No user found. Consider adding a new user.</p>
                                            )}
                                        </div>
                                    )}

                                    {!selectedUser && !showNewUserForm && (
                                        <button
                                            type="button"
                                            onClick={handleNewUser}
                                            className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
                                        >
                                            + Add New User
                                        </button>
                                    )}
                                </div>

                                {/* New User Form */}
                                {showNewUserForm && (
                                    <div className="bg-gray-50 p-4 rounded-md space-y-4">
                                        <h3 className="text-lg font-medium text-gray-900">New User Information</h3>
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                                <input
                                                    type="text"
                                                    value={data.new_user.name}
                                                    onChange={e => setData('new_user', { ...data.new_user, name: e.target.value })}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    required
                                                />
                                                {errors['new_user.name'] && (
                                                    <p className="mt-1 text-sm text-red-600">{errors['new_user.name']}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                                <input
                                                    type="email"
                                                    value={data.new_user.email}
                                                    onChange={e => setData('new_user', { ...data.new_user, email: e.target.value })}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    required
                                                />
                                                {errors['new_user.email'] && (
                                                    <p className="mt-1 text-sm text-red-600">{errors['new_user.email']}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowNewUserForm(false);
                                                    setIsNewUser(false);
                                                    reset('new_user');
                                                }}
                                                className="mr-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Subscription Details */}
                                {!showNewUserForm && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Plan</label>
                                            <select
                                                value={data.plan_name}
                                                onChange={e => setData('plan_name', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                disabled={activeSubscription && planTiers[e.target.value] <= planTiers[activeSubscription.plan_name]}
                                            >
                                                <option value="Basic">Basic</option>
                                                <option value="Premium">Premium</option>
                                                <option value="Elite">Elite</option>
                                            </select>
                                            {activeSubscription && planTiers[data.plan_name] <= planTiers[activeSubscription.plan_name] && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    You can only upgrade to a higher tier plan
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Period</label>
                                            <select
                                                value={data.period}
                                                onChange={e => setData('period', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            >
                                                <option value="monthly">Monthly</option>
                                                <option value="quarterly">Quarterly</option>
                                                <option value="yearly">Yearly</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Discount</label>
                                            <select
                                                value={data.discount_id}
                                                onChange={e => handleDiscountChange(e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            >
                                                <option value="">No Discount</option>
                                                {discounts.map(discount => (
                                                    <option key={discount.id} value={discount.id}>
                                                        {discount.name} ({discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value}`})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-md">
                                            <h4 className="text-lg font-medium text-gray-900 mb-2">Price Summary</h4>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span>Original Price:</span>
                                                    <span>${data.original_price}</span>
                                                </div>
                                                {selectedDiscount && (
                                                    <div className="flex justify-between text-green-600">
                                                        <span>Discount:</span>
                                                        <span>
                                                            {selectedDiscount.type === 'percentage' 
                                                                ? `-${selectedDiscount.value}%`
                                                                : `-$${selectedDiscount.value}`}
                                                        </span>
                                                    </div>
                                                )}
                                                {isNewUser && (
                                                    <div className="flex justify-between">
                                                        <span>Insurance Fee:</span>
                                                        <span>${INSURANCE_FEE}</span>
                                                    </div>
                                                )}
                                                {activeSubscription && (
                                                    <div className="flex justify-between text-blue-600">
                                                        <span>Prorated Upgrade:</span>
                                                        <span>Based on remaining days</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between font-bold border-t pt-2 mt-2">
                                                    <span>Final Price:</span>
                                                    <span>${data.price}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing || (activeSubscription && planTiers[data.plan_name] <= planTiers[activeSubscription.plan_name])}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                                    >
                                        {processing ? 'Processing...' : activeSubscription ? 'Upgrade Subscription' : 'Create Subscription'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
} 