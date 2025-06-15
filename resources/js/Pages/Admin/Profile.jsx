import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Profile({ auth }) {
    const [formData, setFormData] = useState({
        name: auth.user.name,
        email: auth.user.email,
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically make an API call to update the profile
        // For now, we'll just show a success message
        setStatus('Profile updated successfully!');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <AdminLayout title="Admin Profile">
            <Head title="Admin Profile" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                        <div className="p-6 sm:p-8">
                            {/* Profile Header */}
                            <div className="flex items-center space-x-6 mb-8">
                                <div className="h-24 w-24 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                                    {auth.user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900">{auth.user.name}</h2>
                                    <p className="text-gray-600 mt-1">{auth.user.email}</p>
                                    <p className="text-sm text-gray-500 mt-2">Administrator</p>
                                </div>
                            </div>

                            {status && (
                                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-md">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm">{status}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Personal Information */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <InputLabel htmlFor="name" value="Name" className="text-sm font-medium text-gray-700" />
                                            <TextInput
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                                onChange={handleChange}
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
                                                value={formData.email}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                                onChange={handleChange}
                                                required
                                            />
                                            <InputError message={errors.email} className="mt-2" />
                                        </div>

                                        <div className="flex justify-end">
                                            <PrimaryButton className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 focus:ring-orange-500">
                                                Update Profile
                                            </PrimaryButton>
                                        </div>
                                    </form>
                                </div>

                                {/* Change Password */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <InputLabel htmlFor="current_password" value="Current Password" className="text-sm font-medium text-gray-700" />
                                            <TextInput
                                                id="current_password"
                                                name="current_password"
                                                type="password"
                                                value={formData.current_password}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                                onChange={handleChange}
                                            />
                                            <InputError message={errors.current_password} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="new_password" value="New Password" className="text-sm font-medium text-gray-700" />
                                            <TextInput
                                                id="new_password"
                                                name="new_password"
                                                type="password"
                                                value={formData.new_password}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                                onChange={handleChange}
                                            />
                                            <InputError message={errors.new_password} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="new_password_confirmation" value="Confirm New Password" className="text-sm font-medium text-gray-700" />
                                            <TextInput
                                                id="new_password_confirmation"
                                                name="new_password_confirmation"
                                                type="password"
                                                value={formData.new_password_confirmation}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                                onChange={handleChange}
                                            />
                                            <InputError message={errors.new_password_confirmation} className="mt-2" />
                                        </div>

                                        <div className="flex justify-end">
                                            <PrimaryButton className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 focus:ring-orange-500">
                                                Update Password
                                            </PrimaryButton>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* Additional Information */}
                            <div className="mt-8 bg-gray-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Account Type</p>
                                        <p className="mt-1 text-sm text-gray-900">Administrator</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Member Since</p>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {new Date(auth.user.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
} 