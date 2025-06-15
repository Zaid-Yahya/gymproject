import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Profile({ auth }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: auth.user.name,
        email: auth.user.email,
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    const [activeTab, setActiveTab] = useState('profile');

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.profile.update'), {
            onSuccess: () => {
                reset('current_password', 'new_password', 'new_password_confirmation');
            },
        });
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                duration: 0.5,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <AdminLayout title="Admin Profile">
            <Head title="Admin Profile" />

            <motion.div 
                className="py-12"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Profile Header Card */}
                    <motion.div 
                        className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg shadow-xl mb-8 overflow-hidden"
                        variants={itemVariants}
                    >
                        <div className="p-8">
                            <div className="flex items-center space-x-6">
                                <div className="h-32 w-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-5xl font-bold shadow-lg border-4 border-white/30">
                                    {auth.user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="text-white">
                                    <h2 className="text-4xl font-bold">{auth.user.name}</h2>
                                    <p className="text-white/80 mt-2 text-lg">{auth.user.email}</p>
                                    <div className="mt-4 flex items-center space-x-2">
                                        <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                                            Administrator
                                        </span>
                                        <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                                            Member since {new Date(auth.user.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Tabs */}
                    <motion.div 
                        className="bg-white rounded-lg shadow-lg mb-8"
                        variants={itemVariants}
                    >
                        <div className="border-b border-gray-200">
                            <nav className="flex space-x-8 px-6" aria-label="Tabs">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === 'profile'
                                            ? 'border-orange-500 text-orange-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Profile Information
                                </button>
                                <button
                                    onClick={() => setActiveTab('security')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === 'security'
                                            ? 'border-orange-500 text-orange-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Security
                                </button>
                            </nav>
                        </div>
                    </motion.div>

                    {/* Content */}
                    <motion.div 
                        className="bg-white rounded-lg shadow-lg overflow-hidden"
                        variants={itemVariants}
                    >
                        <div className="p-6 sm:p-8">
                            {activeTab === 'profile' ? (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel htmlFor="name" value="Name" className="text-sm font-medium text-gray-700" />
                                            <TextInput
                                                id="name"
                                                name="name"
                                                value={data.name}
                                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                                onChange={(e) => setData('name', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.name} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="email" value="Email" className="text-sm font-medium text-gray-700" />
                                            <TextInput
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={data.email}
                                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                                onChange={(e) => setData('email', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.email} className="mt-2" />
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <PrimaryButton 
                                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 focus:ring-orange-500 px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300" 
                                            disabled={processing}
                                        >
                                            {processing ? 'Updating...' : 'Update Profile'}
                                        </PrimaryButton>
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-6">
                                        <div>
                                            <InputLabel htmlFor="current_password" value="Current Password" className="text-sm font-medium text-gray-700" />
                                            <TextInput
                                                id="current_password"
                                                name="current_password"
                                                type="password"
                                                value={data.current_password}
                                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                                onChange={(e) => setData('current_password', e.target.value)}
                                            />
                                            <InputError message={errors.current_password} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="new_password" value="New Password" className="text-sm font-medium text-gray-700" />
                                            <TextInput
                                                id="new_password"
                                                name="new_password"
                                                type="password"
                                                value={data.new_password}
                                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                                onChange={(e) => setData('new_password', e.target.value)}
                                            />
                                            <InputError message={errors.new_password} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="new_password_confirmation" value="Confirm New Password" className="text-sm font-medium text-gray-700" />
                                            <TextInput
                                                id="new_password_confirmation"
                                                name="new_password_confirmation"
                                                type="password"
                                                value={data.new_password_confirmation}
                                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                                onChange={(e) => setData('new_password_confirmation', e.target.value)}
                                            />
                                            <InputError message={errors.new_password_confirmation} className="mt-2" />
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <PrimaryButton 
                                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 focus:ring-orange-500 px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300" 
                                            disabled={processing}
                                        >
                                            {processing ? 'Updating...' : 'Update Password'}
                                        </PrimaryButton>
                                    </div>
                                </form>
                            )}
                        </div>
                    </motion.div>

                    {/* Stats Cards */}
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
                        variants={itemVariants}
                    >
                        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Last Login</p>
                                    <p className="mt-1 text-2xl font-semibold text-gray-900">
                                        {new Date().toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="p-3 bg-orange-100 rounded-full">
                                    <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Account Status</p>
                                    <p className="mt-1 text-2xl font-semibold text-gray-900">Active</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-full">
                                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Role</p>
                                    <p className="mt-1 text-2xl font-semibold text-gray-900">Administrator</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </AdminLayout>
    );
} 