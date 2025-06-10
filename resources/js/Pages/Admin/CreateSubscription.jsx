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

    const { data, setData, post, processing, errors, reset } = useForm({
        user_id: '',
        plan_name: 'Basic',
        period: 'monthly',
        original_price: 0,
        price: 0,
        discount_id: '',
        start_date: format(new Date(), 'yyyy-MM-dd'),
        end_date: format(new Date(new Date().setMonth(new Date().getMonth() + 1)), 'yyyy-MM-dd'),
        // New user fields
        new_user: {
            name: '',
            email: '',
            phone: '',
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
        const originalPrice = planPrices[data.plan_name][data.period];
        const discountedPrice = selectedDiscount ? calculateDiscountedPrice(originalPrice, selectedDiscount) : originalPrice;
        const finalPrice = isNewUser ? discountedPrice + INSURANCE_FEE : discountedPrice;

        setData(data => ({
            ...data,
            original_price: originalPrice,
            price: finalPrice,
        }));
    }, [data.plan_name, data.period, selectedDiscount, isNewUser]);

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
            },
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
    };

    const handleNewUser = () => {
        setShowNewUserForm(true);
        setSelectedUser(null);
        setData('user_id', '');
        setIsNewUser(true);
    };

    return (
        <AdminLayout>
            <Head title="Create Subscription" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h2 className="text-2xl font-semibold mb-6">Create New Subscription</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* User Search/Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Search User</label>
                                    {selectedUser ? (
                                        <div className="mt-1 flex items-center justify-between p-3 bg-indigo-50 rounded-md">
                                            <span className="text-indigo-800 font-medium">
                                                Selected User: {selectedUser.name} ({selectedUser.email})
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedUser(null);
                                                    setData('user_id', '');
                                                    setSearchQuery('');
                                                    setShowNewUserForm(false);
                                                    setIsNewUser(false);
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
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Phone</label>
                                                <input
                                                    type="tel"
                                                    value={data.new_user.phone}
                                                    onChange={e => setData('new_user', { ...data.new_user, phone: e.target.value })}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    required
                                                />
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
                                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Plan Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Plan</label>
                                    <select
                                        value={data.plan_name}
                                        onChange={e => setData('plan_name', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    >
                                        <option value="Basic">Basic</option>
                                        <option value="Premium">Premium</option>
                                        <option value="Elite">Elite</option>
                                    </select>
                                    {errors.plan_name && <div className="text-red-500 text-sm mt-1">{errors.plan_name}</div>}
                                </div>

                                {/* Period Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Period</label>
                                    <select
                                        value={data.period}
                                        onChange={e => setData('period', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    >
                                        <option value="monthly">Monthly</option>
                                        <option value="quarterly">Quarterly</option>
                                        <option value="yearly">Yearly</option>
                                    </select>
                                    {errors.period && <div className="text-red-500 text-sm mt-1">{errors.period}</div>}
                                </div>

                                {/* Discount Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Discount (Optional)</label>
                                    <select
                                        value={data.discount_id}
                                        onChange={e => handleDiscountChange(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="">No discount</option>
                                        {discounts.map(discount => (
                                            <option key={discount.id} value={discount.id}>
                                                {discount.name} ({discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value}`})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.discount_id && <div className="text-red-500 text-sm mt-1">{errors.discount_id}</div>}
                                </div>

                                {/* Dates */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                        <input
                                            type="date"
                                            value={data.start_date}
                                            onChange={e => setData('start_date', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        />
                                        {errors.start_date && <div className="text-red-500 text-sm mt-1">{errors.start_date}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">End Date</label>
                                        <input
                                            type="date"
                                            value={data.end_date}
                                            onChange={e => setData('end_date', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        />
                                        {errors.end_date && <div className="text-red-500 text-sm mt-1">{errors.end_date}</div>}
                                    </div>
                                </div>

                                {/* Price Summary */}
                                <div className="bg-gray-50 p-4 rounded-md">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Price Summary</h3>
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
                                            <div className="flex justify-between text-blue-600">
                                                <span>Insurance Fee:</span>
                                                <span>+${INSURANCE_FEE}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between font-semibold border-t pt-2">
                                            <span>Final Price:</span>
                                            <span>${data.price}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                    >
                                        {processing ? 'Creating...' : 'Create Subscription'}
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