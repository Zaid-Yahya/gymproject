import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function AdminLayout({ children, title = 'Admin Dashboard' }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    // Check if screen is mobile on mount and when resized
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth < 1024) {
                setSidebarOpen(false);
            }
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        
        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    }, []);

    // Navigation items - only include routes that currently exist
    const navItems = [
        { name: 'Dashboard', href: route('admin.dashboard'), icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { name: 'Users', href: route('admin.users'), icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
        { name: 'Subscriptions', href: route('admin.subscriptions'), icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z' },
        { name: 'Reservations', href: route('admin.reservations'), icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { name: 'Create Subscription', href: route('admin.subscriptions.create'), icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
        { name: 'Promo Codes', href: route('discounts.index'), icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        { name: 'Statistics', href: route('admin.statistics'), icon: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z'},
        { name: 'Profile', href: route('admin.profile'), icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <div 
                className={`${sidebarOpen ? 'lg:w-64 w-72' : 'w-20'} 
                    ${isMobile && sidebarOpen ? 'absolute z-50 h-full' : ''} 
                    bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 ease-in-out transform shadow-xl fixed h-screen top-0 left-0`}
            >
                {/* Logo */}
                <div className={`flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'} py-5 px-4 border-b border-gray-700`}>
                    <div className={`flex items-center ${!sidebarOpen && 'justify-center w-full'}`}>
                        <div className="flex-shrink-0 flex items-center">
                            <span className={`bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent font-extrabold text-xl ${!sidebarOpen && 'hidden'}`}>POWER</span>
                            <span className={`text-white font-extrabold text-xl ${!sidebarOpen && 'hidden'}`}>GYM</span>
                            <span className={`text-white font-extrabold text-xl ${sidebarOpen && 'hidden'}`}>PG</span>
                        </div>
                    </div>
                    {sidebarOpen && (
                        <button 
                            onClick={() => setSidebarOpen(false)}
                            className="lg:block hidden rounded-md p-1.5 hover:bg-gray-700"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
                            </svg>
                        </button>
                    )}
                    {!sidebarOpen && (
                        <button 
                            onClick={() => setSidebarOpen(true)}
                            className="lg:block hidden rounded-md p-1.5 hover:bg-gray-700"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
                            </svg>
                        </button>
                    )}
                </div>

                {/* Navigation */}
                <nav className="mt-5 px-2 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`group flex items-center py-3 px-3 text-sm font-medium rounded-md hover:bg-gray-700 ${
                                window.location.pathname === item.href 
                                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white' 
                                    : 'text-gray-300 hover:text-white'
                            }`}
                        >
                            <svg 
                                className={`${sidebarOpen ? 'mr-3' : 'mx-auto'} h-6 w-6`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24" 
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path>
                            </svg>
                            <span className={`${!sidebarOpen && 'hidden'}`}>{item.name}</span>
                        </Link>
                    ))}
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className={`group flex items-center w-full py-3 px-3 text-sm font-medium rounded-md hover:bg-gray-700 text-gray-300 hover:text-white`}
                    >
                        <svg 
                            className={`${sidebarOpen ? 'mr-3' : 'mx-auto'} h-6 w-6`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                        </svg>
                        <span className={`${!sidebarOpen && 'hidden'}`}>Log Out</span>
                    </Link>
                </nav>

                {/* User Info - moved after navigation to be above logout */}
                <div className={`absolute bottom-0 w-full border-t border-gray-700 p-4 ${!sidebarOpen && 'flex justify-center'}`}>
                    <div className={`flex items-center ${!sidebarOpen && 'flex-col'}`}>
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-sm">
                                {auth?.user?.name ? auth.user.name.charAt(0).toUpperCase() : 'A'}
                            </div>
                        </div>
                        <div className={`ml-3 ${!sidebarOpen && 'hidden'}`}>
                            <p className="text-sm font-medium text-white">
                                {auth?.user?.name || 'Admin User'}
                            </p>
                            <Link
                                href="/"
                                className="text-xs font-medium text-gray-300 hover:text-orange-400"
                            >
                                View Site
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
                {/* Top Header */}
                <header className="bg-white shadow-sm z-10">
                    <div className="flex items-center justify-between h-16 px-6">
                        <div className="flex items-center">
                            {/* Mobile menu button */}
                            <button 
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden -ml-2 mr-2 flex items-center justify-center h-10 w-10 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none"
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                                </svg>
                            </button>
                            <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    {children}
                </main>
            </div>
        </div>
    );
}
