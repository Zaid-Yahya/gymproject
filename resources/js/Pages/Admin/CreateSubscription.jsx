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
        new_user: null
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
        // Update end date based on period
        const startDate = new Date(data.start_date);
        let endDate = new Date(startDate);

        switch (data.period) {
            case 'monthly':
                endDate.setMonth(endDate.getMonth() + 1);
                break;
            case 'quarterly':
                endDate.setMonth(endDate.getMonth() + 3);
                break;
            case 'yearly':
                endDate.setFullYear(endDate.getFullYear() + 1);
                break;
        }

        setData(data => ({
            ...data,
            end_date: format(endDate, 'yyyy-MM-dd')
        }));

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
    }, [data.plan_name, data.period, data.start_date, selectedDiscount, isNewUser, activeSubscription]);

    // Add new useEffect for end date updates
    useEffect(() => {
        const startDate = new Date(data.start_date);
        let endDate = new Date(startDate);

        switch (data.period) {
            case 'monthly':
                endDate.setMonth(endDate.getMonth() + 1);
                break;
            case 'quarterly':
                endDate.setMonth(endDate.getMonth() + 3);
                break;
            case 'yearly':
                endDate.setFullYear(endDate.getFullYear() + 1);
                break;
        }

        setData(data => ({
            ...data,
            end_date: format(endDate, 'yyyy-MM-dd')
        }));
    }, [data.period, data.start_date]);

    // Add handler for start date changes
    const handleStartDateChange = (e) => {
        const newStartDate = e.target.value;
        setData('start_date', newStartDate);
        
        // Update end date based on new start date and current period
        const startDate = new Date(newStartDate);
        let endDate = new Date(startDate);

        switch (data.period) {
            case 'monthly':
                endDate.setMonth(endDate.getMonth() + 1);
                break;
            case 'quarterly':
                endDate.setMonth(endDate.getMonth() + 3);
                break;
            case 'yearly':
                endDate.setFullYear(endDate.getFullYear() + 1);
                break;
        }

        setData('end_date', format(endDate, 'yyyy-MM-dd'));
    };

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

        // Validate required fields
        if (!selectedUser && !isNewUser) {
            alert('Please select a user or create a new one');
            return;
        }

        if (!data.plan_name || !data.period || !data.start_date || !data.end_date) {
            alert('Please fill in all required fields');
            return;
        }

        // Create base form data
        let formData = {
            plan_name: data.plan_name,
            period: data.period,
            original_price: data.original_price,
            price: data.price,
            start_date: format(new Date(data.start_date), 'yyyy-MM-dd'),
            end_date: format(new Date(data.end_date), 'yyyy-MM-dd'),
            is_upgrade: data.is_upgrade || false
        };

        // Add user_id or new_user based on selection
        if (selectedUser) {
            formData.user_id = selectedUser.id;
        } else if (isNewUser) {
            if (!data.new_user?.name || !data.new_user?.email) {
                alert('Please fill in all new user details');
                return;
            }
            formData.new_user = {
                name: data.new_user.name,
                email: data.new_user.email
            };
        }

        // Add discount_id only if it exists and is not empty
        if (data.discount_id && data.discount_id !== '') {
            formData.discount_id = data.discount_id;
        }

        // Remove any undefined, null, or empty values
        Object.keys(formData).forEach(key => {
            if (formData[key] === undefined || formData[key] === null || formData[key] === '') {
                delete formData[key];
            }
        });

        console.log('Sending form data:', formData);

        post(route('admin.subscriptions.store'), formData, {
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
                if (errors.new_user) {
                    alert('Please fill in all new user details correctly');
                } else {
                    alert('Failed to create subscription. Please check the console for details.');
                }
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
        setIsNewUser(false);
        setShowNewUserForm(false);
        setData(data => ({
            ...data,
            user_id: user.id,
            new_user: null
        }));
    };

    const handleNewUser = () => {
        setSelectedUser(null);
        setIsNewUser(true);
        setShowNewUserForm(true);
        setData(data => ({
            ...data,
            user_id: '',
            new_user: { name: '', email: '' }
        }));
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
                                                    value={data.new_user?.name}
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
                                                    value={data.new_user?.email}
                                                    onChange={e => setData('new_user', { ...data.new_user, email: e.target.value })}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    required
                                                />
                                                {errors['new_user.email'] && (
                                                    <p className="mt-1 text-sm text-red-600">{errors['new_user.email']}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Subscription Details */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                                        </div>

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
                                        </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                        <input
                                            type="date"
                                            value={data.start_date}
                                            onChange={handleStartDateChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">End Date</label>
                                        <input
                                            type="date"
                                            value={data.end_date}
                                            readOnly
                                            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        />
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
                                        </div>

                                {/* Price Summary */}
                                        <div className="bg-gray-50 p-4 rounded-md">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Price Summary</h3>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span>Original Price:</span>
                                                    <span>${data.original_price}</span>
                                                </div>
                                        {data.discount_id && (
                                                    <div className="flex justify-between text-green-600">
                                                <span>Discount Applied:</span>
                                                <span>-${(data.original_price - data.price).toFixed(2)}</span>
                                                    </div>
                                                )}
                                                {isNewUser && (
                                                    <div className="flex justify-between">
                                                        <span>Insurance Fee:</span>
                                                        <span>${INSURANCE_FEE}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between font-bold border-t pt-2 mt-2">
                                            <span>Total Price:</span>
                                                    <span>${data.price}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
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