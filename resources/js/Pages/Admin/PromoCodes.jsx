import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { motion, AnimatePresence } from 'framer-motion';

export default function PromoCodes({ auth, discounts, filters = {} }) {
    const { flash = {} } = usePage().props;
    const [showingCreateModal, setShowingCreateModal] = useState(false);
    const [showingCancelModal, setShowingCancelModal] = useState(false);
    const [selectedDiscount, setSelectedDiscount] = useState(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [actionMessage, setActionMessage] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        code: '',
        type: 'percentage', // percentage or fixed
        value: '',
        max_uses: '',
        expires_at: '',
    });

    const { data: cancelData, delete: processCancel, processing: cancelProcessing, errors: cancelErrors, reset: resetCancel } = useForm({});

    const openCreateModal = () => {
        setShowingCreateModal(true);
    };

    const closeCreateModal = () => {
        setShowingCreateModal(false);
        reset();
    };

    const openCancelModal = (discount) => {
        setSelectedDiscount(discount);
        setShowingCancelModal(true);
    };

    const closeCancelModal = () => {
        setShowingCancelModal(false);
        setSelectedDiscount(null);
        resetCancel();
    };

    const createDiscount = (e) => {
        e.preventDefault();
        post(route('discounts.store'), {
            preserveScroll: true,
            onSuccess: () => {
                closeCreateModal();
                setActionMessage('Promo code created successfully!');
                setShowSuccessMessage(true);
                setTimeout(() => setShowSuccessMessage(false), 3000);
            },
            onError: () => console.log(errors),
        });
    };

    const cancelDiscount = () => {
        if (!selectedDiscount) return;
        processCancel(route('discounts.destroy', selectedDiscount.id), {
            preserveScroll: true,
            onSuccess: () => {
                closeCancelModal();
                setActionMessage('Promo code cancelled successfully!');
                setShowSuccessMessage(true);
                setTimeout(() => setShowSuccessMessage(false), 3000);
            },
            onError: () => console.log(cancelErrors),
        });
    };

    // Filter logic (basic example, can be expanded)
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [filterStatus, setFilterStatus] = useState(filters.status || 'all');

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        // Inertia.get(route('discounts.index'), { search: e.target.value, status: filterStatus }, { preserveState: true, replace: true });
    };

    const handleFilterStatus = (e) => {
        setFilterStatus(e.target.value);
        // Inertia.get(route('discounts.index'), { search: searchTerm, status: e.target.value }, { preserveState: true, replace: true });
    };

    const filteredDiscounts = discounts.filter(discount => {
        const matchesSearch = discount.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (discount.type && discount.type.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const isExpired = discount.expires_at ? new Date(discount.expires_at) < new Date() : false;
        const isCancelled = discount.status === 'cancelled';
        const isActive = !isExpired && !isCancelled && (discount.max_uses === null || discount.uses < discount.max_uses);

        const matchesStatus = filterStatus === 'all' ||
                              (filterStatus === 'active' && isActive) ||
                              (filterStatus === 'expired' && isExpired) ||
                              (filterStatus === 'cancelled' && isCancelled);

        return matchesSearch && matchesStatus;
    });

    return (
        <AdminLayout title="Promo Codes Management">
            <Head title="Promo Codes" />

            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                        <input
                            type="text"
                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 p-2.5"
                            placeholder="Search promo codes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <select
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block p-2.5"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="expired">Expired</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    
                    <button
                        onClick={openCreateModal}
                        className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-orange-500/30"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        Add Promo Code
                    </button>
                </div>
            </div>

            {/* Success message notification */}
            <AnimatePresence>
                {showSuccessMessage && (
                    <motion.div 
                        className="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 rounded-lg shadow-sm"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <p className="font-medium">{actionMessage}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                <div className="p-5 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">All Promo Codes</h2>
                    <span className="text-sm text-gray-600 bg-white py-1 px-3 rounded-full border border-gray-200 shadow-sm">
                        {filteredDiscounts.length} {filteredDiscounts.length === 1 ? 'promo code' : 'promo codes'}
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr className="bg-gray-50">
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    CODE
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    TYPE
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    VALUE
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    MAX USES
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    USES
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    EXPIRES AT
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    STATUS
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredDiscounts.length > 0 ? (
                                filteredDiscounts.map((discount) => (
                                    <tr key={discount.id} className="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {discount.code}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                            {discount.type}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value}`}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {discount.max_uses || 'Unlimited'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {discount.uses}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {discount.expires_at ? new Date(discount.expires_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            }) : 'Never'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                discount.status === 'cancelled'
                                                    ? 'bg-gray-100 text-gray-800 border border-gray-200'
                                                    : (new Date(discount.expires_at) < new Date() && discount.expires_at !== null)
                                                        ? 'bg-red-100 text-red-800 border border-red-200'
                                                        : (discount.max_uses !== null && discount.uses >= discount.max_uses)
                                                            ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                                            : 'bg-green-100 text-green-800 border border-green-200'
                                            }`}>
                                                {discount.status === 'cancelled'
                                                    ? 'Cancelled'
                                                    : (new Date(discount.expires_at) < new Date() && discount.expires_at !== null)
                                                        ? 'Expired'
                                                        : (discount.max_uses !== null && discount.uses >= discount.max_uses)
                                                            ? 'Depleted'
                                                            : 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex space-x-2 justify-end">
                                                <button
                                                    onClick={() => openCancelModal(discount)}
                                                    className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 rounded-md p-1.5 transition-colors duration-150"
                                                    disabled={discount.status === 'cancelled' || (discount.expires_at && new Date(discount.expires_at) < new Date()) || (discount.max_uses !== null && discount.uses >= discount.max_uses)}
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="px-6 py-10 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
                                            </svg>
                                            <p className="text-lg font-medium">No promo codes found</p>
                                            <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filter to find what you're looking for.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Showing {filteredDiscounts.length} of {discounts.length} promo codes
                        </div>
                        <div className="flex space-x-2">
                            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                                Previous
                            </button>
                            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Promo Code Modal */}
            <Modal show={showingCreateModal} onClose={closeCreateModal}>
                <form onSubmit={createDiscount} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Promo Code</h2>

                    <div className="mb-4">
                        <InputLabel htmlFor="code" value="Code" />
                        <TextInput
                            id="code"
                            type="text"
                            name="code"
                            value={data.code}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('code', e.target.value)}
                            required
                        />
                        <InputError message={errors.code} className="mt-2" />
                    </div>

                    <div className="mb-4">
                        <InputLabel htmlFor="type" value="Type" />
                        <select
                            id="type"
                            name="type"
                            value={data.type}
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            onChange={(e) => setData('type', e.target.value)}
                        >
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed Amount</option>
                        </select>
                        <InputError message={errors.type} className="mt-2" />
                    </div>

                    <div className="mb-4">
                        <InputLabel htmlFor="value" value="Value" />
                        <TextInput
                            id="value"
                            type="number"
                            name="value"
                            value={data.value}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('value', e.target.value)}
                            required
                        />
                        <InputError message={errors.value} className="mt-2" />
                    </div>

                    <div className="mb-4">
                        <InputLabel htmlFor="max_uses" value="Max Uses (optional)" />
                        <TextInput
                            id="max_uses"
                            type="number"
                            name="max_uses"
                            value={data.max_uses}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('max_uses', e.target.value)}
                        />
                        <InputError message={errors.max_uses} className="mt-2" />
                    </div>

                    <div className="mb-4">
                        <InputLabel htmlFor="expires_at" value="Expires At (optional)" />
                        <TextInput
                            id="expires_at"
                            type="date"
                            name="expires_at"
                            value={data.expires_at}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('expires_at', e.target.value)}
                        />
                        <InputError message={errors.expires_at} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeCreateModal}>Cancel</SecondaryButton>
                        <PrimaryButton className="ml-3" disabled={processing}>
                            Create Promo Code
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Cancel Promo Code Confirmation Modal */}
            <Modal show={showingCancelModal} onClose={closeCancelModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Confirm Cancellation
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Are you sure you want to cancel the promo code "<span className="font-bold">{selectedDiscount?.code}</span>"? This action cannot be undone.
                    </p>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeCancelModal}>Cancel</SecondaryButton>
                        <DangerButton className="ml-3" onClick={cancelDiscount} disabled={cancelProcessing}>
                            Confirm Cancellation
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
} 