import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Navbar({ user }) {
    const [isOpen, setIsOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    return (
        <nav className="bg-gray-900 bg-opacity-80 backdrop-blur-sm text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16">
                    {/* Logo - positioned at the far left */}
                    <div className="flex-shrink-0 flex items-center mr-8">
                        <Link href="/" className="flex items-center">
                            <div className="text-2xl font-extrabold">
                                <span className="text-red-500">POWER</span>
                                <span className="text-white">GYM</span>
                            </div>
                        </Link>
                    </div>
                    
                    {/* Navigation Links - centered using flex-1 and justify-center */}
                    <div className="hidden md:flex flex-1 items-center justify-center">
                        <div className="flex items-baseline space-x-8">
                            <Link 
                                href={route('dashboard')} 
                                className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-200"
                            >
                                Dashboard
                            </Link>
                            <Link 
                                href="#" 
                                className="px-3 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 transition-all duration-200"
                            >
                                Memberships
                            </Link>
                            <Link 
                                href="#" 
                                className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-200"
                            >
                                Classes
                            </Link>
                            <Link 
                                href="#" 
                                className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-200"
                            >
                                Trainers
                            </Link>
                        </div>
                    </div>
                    
                    {/* User Menu - positioned at the far right */}
                    <div className="hidden md:flex items-center ml-auto">
                        {user ? (
                            <div className="flex items-center relative">
                                <button 
                                    onClick={() => setShowUserMenu(!showUserMenu)} 
                                    className="flex items-center max-w-xs bg-gray-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500 transition-all duration-300"
                                >
                                    <span className="sr-only">Open user menu</span>
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-glow">
                                        <span className="text-sm font-medium text-white">{user.name.charAt(0).toUpperCase()}</span>
                                    </div>
                                    <span className="ml-3 font-medium text-gray-300 mr-1">{user.name}</span>
                                    <svg className="w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                
                                {/* User dropdown menu */}
                                {showUserMenu && (
                                    <div className="absolute right-0 top-12 w-48 py-1 bg-gray-800 rounded-md shadow-lg z-50">
                                        <Link 
                                            href={route('profile.edit')} 
                                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                                        >
                                            Your Profile
                                        </Link>
                                        <Link 
                                            href={route('subscriptions.index')} 
                                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                                        >
                                            Your Subscriptions
                                        </Link>
                                        <div className="border-t border-gray-700 my-1"></div>
                                        <Link 
                                            href={route('logout')} 
                                            method="post" 
                                            as="button"
                                            className="w-full text-left block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                                        >
                                            Sign out
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link 
                                    href={route('login')} 
                                    className="px-4 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-800 transition-all duration-200"
                                >
                                    Log in
                                </Link>
                                <Link 
                                    href={route('register')} 
                                    className="px-4 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 transition-all duration-200 transform hover:scale-105"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>
                    
                    {/* Mobile menu button - positioned at the far right */}
                    <div className="flex md:hidden items-center ml-auto">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Mobile menu */}
            <motion.div 
                className="md:hidden"
                initial={{ height: 0, opacity: 0 }}
                animate={{ 
                    height: isOpen ? 'auto' : 0,
                    opacity: isOpen ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
                style={{ overflow: 'hidden' }}
            >
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <Link 
                        href={route('dashboard')} 
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
                    >
                        Dashboard
                    </Link>
                    <Link 
                        href="#" 
                        className="block px-3 py-2 rounded-md text-base font-medium text-white bg-gradient-to-r from-red-500 to-orange-500"
                    >
                        Memberships
                    </Link>
                    <Link 
                        href="#" 
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
                    >
                        Classes
                    </Link>
                    <Link 
                        href="#" 
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
                    >
                        Trainers
                    </Link>
                </div>
                
                {user ? (
                    <div className="pt-4 pb-3 border-t border-gray-800">
                        <div className="flex items-center px-5">
                            <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                                    <span className="text-sm font-medium text-white">{user.name.charAt(0).toUpperCase()}</span>
                                </div>
                            </div>
                            <div className="ml-3">
                                <div className="text-base font-medium text-white">{user.name}</div>
                                <div className="text-sm font-medium text-gray-400">{user.email}</div>
                            </div>
                        </div>
                        <div className="mt-3 px-2 space-y-1">
                            <Link 
                                href={route('profile.edit')} 
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-800"
                            >
                                Your Profile
                            </Link>
                            <Link 
                                href={route('subscriptions.index')} 
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-800"
                            >
                                Your Subscriptions
                            </Link>
                            <Link 
                                href={route('logout')} 
                                method="post" 
                                as="button"
                                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-800"
                            >
                                Sign out
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="pt-4 pb-3 border-t border-gray-800">
                        <div className="flex flex-col px-5 space-y-2">
                            <Link 
                                href={route('login')} 
                                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-800"
                            >
                                Log in
                            </Link>
                            <Link 
                                href={route('register')} 
                                className="block px-3 py-2 rounded-md text-base font-medium bg-gradient-to-r from-red-500 to-orange-500 text-white text-center"
                            >
                                Sign up
                            </Link>
                        </div>
                    </div>
                )}
            </motion.div>
            
            {/* Add a subtle shadow effect for the navbar */}
            <style jsx>{`
                .shadow-glow {
                    box-shadow: 0 0 15px rgba(239, 68, 68, 0.5);
                }
            `}</style>
        </nav>
    );
} 