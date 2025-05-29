import { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import Navbar from '@/Components/Navbar';

export default function Edit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    const [activeTab, setActiveTab] = useState('profile');

    // Function to get user initials for avatar
    const getUserInitials = () => {
        if (!auth?.user?.name) return '?';
        
        const nameParts = auth.user.name.split(' ');
        if (nameParts.length >= 2) {
            return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
        }
        
        return auth.user.name.charAt(0).toUpperCase();
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title="Mon Profil | POWER GYM" />
            
            {/* Navbar */}
            <Navbar />
            
            {/* Header */}
            <div className="pt-24 pb-6 bg-gradient-to-r from-gray-900 to-gray-800 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-red-500/10 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-orange-500/10 to-transparent"></div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex items-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-2xl md:text-3xl shadow-xl border-4 border-white">
                            {auth.user.avatar ? (
                                <img 
                                    src={auth.user.avatar} 
                                    alt={auth.user.name} 
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                getUserInitials()
                            )}
                        </div>
                        <div className="ml-6">
                            <h1 className="text-2xl md:text-3xl font-bold text-white">
                                {auth.user.name}
                            </h1>
                            <p className="text-gray-300">{auth.user.email}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <div className="md:w-1/4">
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-24">
                            <div className="py-6 px-4 bg-gradient-to-r from-gray-900 to-gray-800">
                                <h2 className="text-white text-lg font-bold">Paramètres du compte</h2>
                            </div>
                            <nav className="flex flex-col p-2">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`px-4 py-3 rounded-lg text-left mb-1 transition-all flex items-center ${
                                        activeTab === 'profile'
                                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                                            : 'hover:bg-gray-100 text-gray-700'
                                    }`}
                                >
                                    <svg className="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Profil personnel
                                </button>
                                <button
                                    onClick={() => setActiveTab('password')}
                                    className={`px-4 py-3 rounded-lg text-left mb-1 transition-all flex items-center ${
                                        activeTab === 'password'
                                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                                            : 'hover:bg-gray-100 text-gray-700'
                                    }`}
                                >
                                    <svg className="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Sécurité
                                </button>
                                <div className="py-2 px-4 my-2 border-t border-gray-100"></div>
                                <button
                                    onClick={() => setActiveTab('delete')}
                                    className={`px-4 py-3 rounded-lg text-left mb-1 transition-all flex items-center ${
                                        activeTab === 'delete'
                                            ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md'
                                            : 'hover:bg-red-50 text-red-600'
                                    }`}
                                >
                                    <svg className="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Supprimer le compte
                                </button>
                            </nav>
                        </div>
                    </div>
                    
                    {/* Main Content */}
                    <div className="md:w-3/4">
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            {activeTab === 'profile' && (
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                />
                            )}
                            
                            {activeTab === 'password' && (
                                <UpdatePasswordForm />
                            )}
                            
                            {activeTab === 'delete' && (
                                <DeleteUserForm />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Footer */}
            <div className="bg-gray-900 text-gray-400 py-8 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p>© 2023 POWER GYM | Tous droits réservés</p>
                </div>
            </div>
        </div>
    );
}
