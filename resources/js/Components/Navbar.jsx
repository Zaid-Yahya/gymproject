import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function Navbar({ activeSection = 'hero' }) {
    const { auth } = usePage().props;
    const [navVisible, setNavVisible] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Handle navigation visibility on scroll
    useEffect(() => {
        const handleScroll = () => {
            setNavVisible(window.scrollY > 100);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const scrollToSection = (sectionId) => {
        setMobileMenuOpen(false);
        
        const element = document.getElementById(sectionId);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    };

    // Get user initials for avatar
    const getUserInitials = () => {
        if (!auth?.user?.name) return '?';
        
        const nameParts = auth.user.name.split(' ');
        if (nameParts.length >= 2) {
            return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
        }
        
        return auth.user.name.charAt(0).toUpperCase();
    };

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${navVisible ? 'bg-black shadow-lg' : 'bg-black/90 backdrop-blur-md'}`}>
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center py-4">
                    {/* Logo */}
                    <div className="text-2xl font-extrabold">
                        <Link href={route('home')}>
                            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">POWER</span>
                            <span className="text-white">GYM</span>
                        </Link>
                    </div>
                    
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-8">
                        <Link 
                            href={route('home')}
                            className={`text-sm font-medium transition-all duration-300 ${
                                activeSection === 'hero' ? 'text-orange-500' : 'text-gray-300 hover:text-orange-400'
                            }`}
                        >
                            ACCUEIL
                        </Link>
                        <Link 
                            href={route('home') + '#programs'}
                            className={`text-sm font-medium transition-all duration-300 ${
                                activeSection === 'programs' ? 'text-orange-500' : 'text-gray-300 hover:text-orange-400'
                            }`}
                        >
                            PROGRAMMES
                        </Link>
                        <Link 
                            href={route('home') + '#gallery'}
                            className={`text-sm font-medium transition-all duration-300 ${
                                activeSection === 'gallery' ? 'text-orange-500' : 'text-gray-300 hover:text-orange-400'
                            }`}
                        >
                            GALERIE
                        </Link>
                        <Link 
                            href={route('home') + '#trainers'}
                            className={`text-sm font-medium transition-all duration-300 ${
                                activeSection === 'trainers' ? 'text-orange-500' : 'text-gray-300 hover:text-orange-400'
                            }`}
                        >
                            ENTRAINEURS
                        </Link>
                        <Link 
                            href={route('home') + '#testimonials'}
                            className={`text-sm font-medium transition-all duration-300 ${
                                activeSection === 'testimonials' ? 'text-orange-500' : 'text-gray-300 hover:text-orange-400'
                            }`}
                        >
                            TÉMOIGNAGES
                        </Link>
                        <Link 
                            href={route('home') + '#membership'}
                            className={`text-sm font-medium transition-all duration-300 ${
                                activeSection === 'membership' ? 'text-orange-500' : 'text-gray-300 hover:text-orange-400'
                            }`}
                        >
                            ABONNEMENTS
                        </Link>
                        {auth?.user?.is_admin && (
                            <>
                                <Link 
                                    href={route('users.index')}
                                    className={`text-sm font-medium transition-all duration-300 ${
                                        route().current('users.index') ? 'text-orange-500' : 'text-gray-300 hover:text-orange-400'
                                    }`}
                                >
                                    Users
                                </Link>
                                <Link 
                                    href={route('subscriptions.index')}
                                    className={`text-sm font-medium transition-all duration-300 ${
                                        route().current('subscriptions.index') ? 'text-orange-500' : 'text-gray-300 hover:text-orange-400'
                                    }`}
                                >
                                    Subscriptions
                                </Link>
                                <Link 
                                    href={route('discounts.index')}
                                    className={`text-sm font-medium transition-all duration-300 ${
                                        route().current('discounts.index') ? 'text-orange-500' : 'text-gray-300 hover:text-orange-400'
                                    }`}
                                >
                                    Promo Codes
                                </Link>
                            </>
                        )}
                    </div>
                    
                    {/* Authentication Links */}
                    <div className="hidden md:flex items-center space-x-4">
                        {auth?.user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button 
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center focus:outline-none"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-sm shadow-lg border-2 border-orange-500 hover:scale-105 transition-transform duration-300">
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
                                    <svg className="w-4 h-4 ml-1 text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-black border border-gray-800 rounded-md overflow-hidden shadow-xl z-50">
                                        <div className="px-4 py-3 border-b border-gray-800">
                                            <p className="text-sm text-white font-medium">{auth.user.name}</p>
                                            <p className="text-xs text-gray-400 truncate">{auth.user.email}</p>
                                        </div>
                                        
                                        <Link 
                                            href={route('profile.edit')}
                                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-orange-400"
                                        >
                                            Modifier Profil
                                        </Link>
                                        
                                        <Link 
                                            href={route('logout')} 
                                            method="post" 
                                            as="button"
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-orange-400"
                                        >
                                            Déconnexion
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="text-sm font-medium text-gray-300 hover:text-orange-400 transition-colors duration-300"
                                >
                                    Se connecter
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="text-sm font-medium bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
                                >
                                    S'inscrire
                                </Link>
                            </>
                        )}
                    </div>
                    
                    {/* Mobile menu button */}
                    <button 
                        className="md:hidden text-white"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                            </svg>
                        )}
                    </button>
                </div>
                
                {/* Mobile menu */}
                <div className={`md:hidden transition-all duration-500 overflow-hidden ${mobileMenuOpen ? 'max-h-96 mt-4' : 'max-h-0'}`}>
                    <div className="flex flex-col space-y-4 pt-2 pb-4 rounded-lg shadow-lg bg-black">
                        <Link 
                            href={route('home')}
                            className={`text-sm font-medium py-2 px-4 transition-all duration-300 ${
                                activeSection === 'hero' ? 'text-orange-500' : 'text-gray-300 hover:text-orange-400'
                            }`}
                        >
                            ACCUEIL
                        </Link>
                        <Link 
                            href={route('home') + '#programs'}
                            className={`text-sm font-medium py-2 px-4 transition-all duration-300 ${
                                activeSection === 'programs' ? 'text-orange-500' : 'text-gray-300 hover:text-orange-400'
                            }`}
                        >
                            PROGRAMMES
                        </Link>
                        <Link 
                            href={route('home') + '#gallery'}
                            className={`text-sm font-medium py-2 px-4 transition-all duration-300 ${
                                activeSection === 'gallery' ? 'text-orange-500' : 'text-gray-300 hover:text-orange-400'
                            }`}
                        >
                            GALERIE
                        </Link>
                        <Link 
                            href={route('home') + '#trainers'}
                            className={`text-sm font-medium py-2 px-4 transition-all duration-300 ${
                                activeSection === 'trainers' ? 'text-orange-500' : 'text-gray-300 hover:text-orange-400'
                            }`}
                        >
                            ENTRAINEURS
                        </Link>
                        <Link 
                            href={route('home') + '#testimonials'}
                            className={`text-sm font-medium py-2 px-4 transition-all duration-300 ${
                                activeSection === 'testimonials' ? 'text-orange-500' : 'text-gray-300 hover:text-orange-400'
                            }`}
                        >
                            TÉMOIGNAGES
                        </Link>
                        <Link 
                            href={route('home') + '#membership'}
                            className={`text-sm font-medium py-2 px-4 transition-all duration-300 ${
                                activeSection === 'membership' ? 'text-orange-500' : 'text-gray-300 hover:text-orange-400'
                            }`}
                        >
                            ABONNEMENTS
                        </Link>
                        {auth?.user?.is_admin && (
                            <>
                                <Link 
                                    href={route('users.index')}
                                    className={`text-sm font-medium py-2 px-4 transition-all duration-300 ${
                                        route().current('users.index') ? 'text-orange-500' : 'text-gray-300 hover:text-orange-400'
                                    }`}
                                >
                                    Users
                                </Link>
                                <Link 
                                    href={route('subscriptions.index')}
                                    className={`text-sm font-medium py-2 px-4 transition-all duration-300 ${
                                        route().current('subscriptions.index') ? 'text-orange-500' : 'text-gray-300 hover:text-orange-400'
                                    }`}
                                >
                                    Subscriptions
                                </Link>
                                <Link 
                                    href={route('discounts.index')}
                                    className={`text-sm font-medium py-2 px-4 transition-all duration-300 ${
                                        route().current('discounts.index') ? 'text-orange-500' : 'text-gray-300 hover:text-orange-400'
                                    }`}
                                >
                                    Promo Codes
                                </Link>
                            </>
                        )}

                        {/* Mobile Authentication Links */}
                        {auth?.user ? (
                            <div className="flex flex-col">
                                <Link
                                    href={route('profile.edit')}
                                    className="block py-2 px-4 text-sm text-gray-300 hover:bg-gray-800 hover:text-orange-400"
                                >
                                    Modifier Profil
                                </Link>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="block w-full text-left py-2 px-4 text-sm text-gray-300 hover:bg-gray-800 hover:text-orange-400"
                                >
                                    Déconnexion
                                </Link>
                            </div>
                        ) : (
                            <div className="flex flex-col space-y-2 px-4">
                                <Link
                                    href={route('login')}
                                    className="py-2 text-gray-300 hover:text-orange-400 transition-colors duration-300"
                                >
                                    Se connecter
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-center rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-300"
                                >
                                    S'inscrire
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
} 