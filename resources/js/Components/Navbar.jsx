import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

export default function Navbar({ activeSection = 'hero' }) {
    const [navVisible, setNavVisible] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Handle navigation visibility on scroll
    useEffect(() => {
        const handleScroll = () => {
            setNavVisible(window.scrollY > 100);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
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
                    </div>
                    
                    {/* Authentication Links */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link 
                            href={route('login')} 
                            className="px-4 py-2 transition-all duration-300 text-gray-300 hover:text-orange-400"
                        >
                            Connexion
                        </Link>
                        <Link 
                            href={route('register')} 
                            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:scale-105 transform shadow-md hover:shadow-orange-500/30"
                        >
                            Rejoindre
                        </Link>
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
                        <div className="pt-2 flex flex-col space-y-3 px-4">
                            <Link 
                                href={route('login')} 
                                className="py-2 text-gray-300 hover:text-orange-400 transition-all duration-300"
                            >
                                Connexion
                            </Link>
                            <Link 
                                href={route('register')} 
                                className="py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-center rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-300"
                            >
                                Rejoindre
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
} 