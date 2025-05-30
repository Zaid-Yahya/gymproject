import React, { useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/Components/Navbar';

const BmiCalculator = () => {
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('male');
    const [bmi, setBmi] = useState(null);
    const [bmiCategory, setBmiCategory] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [isMetric, setIsMetric] = useState(true);
    const [activeSection, setActiveSection] = useState('bmi');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [showInformation, setShowInformation] = useState(false);
    const [pointerPosition, setPointerPosition] = useState(50);
    const [isAnimating, setIsAnimating] = useState(true);
    const animationRef = useRef(null);
    const [direction, setDirection] = useState(1);
    
    // Animation for the BMI pointer
    useEffect(() => {
        const animate = () => {
            if (!bmi) {
                setPointerPosition(prev => {
                    const newPos = prev + (direction * 0.5);
                    if (newPos >= 90 || newPos <= 10) {
                        setDirection(d => -d);
                        return prev;
                    }
                    return newPos;
                });
            } else {
                const bmiValue = Math.min(parseFloat(bmi), 40);
                const targetPos = ((bmiValue - 15) / (40 - 15)) * 100;
                const clampedTargetPos = Math.min(Math.max(targetPos, 0), 100);
                
                setPointerPosition(prev => {
                    const diff = clampedTargetPos - prev;
                    if (Math.abs(diff) < 0.1) {
                        setIsAnimating(false);
                        return clampedTargetPos;
                    }
                    return prev + (diff * 0.03);
                });
            }
            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [bmi, direction]);

    const calculateBMI = (e) => {
        e.preventDefault();
        let bmiValue;
        
        if (isMetric) {
            const heightInMeters = height / 100;
            bmiValue = weight / (heightInMeters * heightInMeters);
        } else {
            bmiValue = (weight * 703) / (height * height);
        }
        
        setBmi(bmiValue.toFixed(1));
        
        if (bmiValue < 18.5) {
            setBmiCategory('Insuffisance pondérale');
        } else if (bmiValue >= 18.5 && bmiValue < 25) {
            setBmiCategory('Poids normal');
        } else if (bmiValue >= 25 && bmiValue < 30) {
            setBmiCategory('Surpoids');
        } else {
            setBmiCategory('Obésité');
        }

        setShowResult(true);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 5000);
    };

    const resetForm = () => {
        setHeight('');
        setWeight('');
        setAge('');
        setGender('male');
        setBmi(null);
        setBmiCategory('');
        setShowResult(false);
        setShowNotification(false);
    };

    // Function to get category color based on BMI value
    const getCategoryColor = (value) => {
        if (value < 18.5) return '#3b82f6'; // Blue for underweight
        if (value < 25) return '#10b981';   // Green for normal
        if (value < 30) return '#f59e0b';   // Yellow for overweight
        return '#ef4444';                    // Red for obese
    };

    // Function to get detailed information based on BMI category
    const getBmiInformation = () => {
        if (!bmi) return null;
        
        const bmiValue = parseFloat(bmi);
        if (bmiValue < 18.5) {
            return {
                title: "Insuffisance pondérale",
                description: "Un IMC inférieur à 18.5 indique une insuffisance pondérale.",
                risks: [
                    "Système immunitaire affaibli",
                    "Risque de carences nutritionnelles",
                    "Fatigue et manque d'énergie",
                    "Problèmes de fertilité"
                ],
                recommendations: [
                    "Consultez un professionnel de santé",
                    "Augmentez votre apport calorique sainement",
                    "Consommez plus de protéines",
                    "Pratiquez des exercices de renforcement musculaire"
                ]
            };
        } else if (bmiValue < 25) {
            return {
                title: "Poids normal",
                description: "Votre poids est dans la fourchette normale pour votre taille.",
                risks: [],
                recommendations: [
                    "Maintenez une alimentation équilibrée",
                    "Faites de l'exercice régulièrement",
                    "Dormez suffisamment",
                    "Gérez votre stress"
                ]
            };
        } else if (bmiValue < 30) {
            return {
                title: "Surpoids",
                description: "Un IMC entre 25 et 29.9 indique un surpoids.",
                risks: [
                    "Risque accru de diabète de type 2",
                    "Hypertension artérielle",
                    "Problèmes cardiovasculaires",
                    "Troubles du sommeil"
                ],
                recommendations: [
                    "Adoptez une alimentation équilibrée",
                    "Pratiquez une activité physique régulière",
                    "Consultez un nutritionniste",
                    "Fixez-vous des objectifs réalistes"
                ]
            };
        } else {
            return {
                title: "Obésité",
                description: "Un IMC de 30 ou plus indique une obésité.",
                risks: [
                    "Risque élevé de maladies cardiovasculaires",
                    "Diabète de type 2",
                    "Problèmes respiratoires",
                    "Impact sur la mobilité"
                ],
                recommendations: [
                    "Consultez un professionnel de santé",
                    "Suivez un programme personnalisé",
                    "Adoptez des changements progressifs",
                    "Rejoignez un groupe de soutien"
                ]
            };
        }
    };

    // Update the button styles in the form section
    const buttonStyle = {
        base: `relative overflow-hidden p-4 rounded-lg transition-all duration-300 border`,
        active: `bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm border-transparent`,
        inactive: `bg-white text-gray-600 hover:bg-gray-50 border-gray-200`
    };

    return (
        <>
            <Head title="Calculateur d'IMC - POWER GYM" />

            {/* Simple Background with Deep Orange Color */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                {/* Main deep orange background */}
                <div className="absolute inset-0 bg-gradient-to-b from-orange-600 to-orange-500 opacity-30"></div>
                
                {/* Simple animated gradient */}
                <motion.div 
                    className="absolute inset-0"
                    animate={{
                        opacity: [0.4, 0.5, 0.4],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut"
                    }}
                    style={{
                        backgroundImage: 'linear-gradient(120deg, rgba(234, 88, 12, 0.5) 0%, rgba(251, 146, 60, 0.3) 100%)'
                    }}
                />
                
                {/* Single simple floating orb */}
                <motion.div
                    className="absolute w-full h-full bg-gradient-to-br from-orange-600/10 to-orange-400/10 blur-3xl"
                    animate={{
                        scale: [1, 1.05, 1],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        repeatType: 'mirror',
                        ease: 'easeInOut'
                    }}
                />
            </div>

            {/* Import Navbar from Home page */}
            <Navbar activeSection={activeSection} />

            {/* Floating Notification */}
            <AnimatePresence>
                {showNotification && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50"
                    >
                        <div className="bg-white rounded-lg shadow-lg p-4 flex items-center space-x-3">
                            <div className="flex-shrink-0">
                                {bmiCategory === 'Poids normal' ? (
                                    <span className="text-2xl">🎉</span>
                                ) : (
                                    <span className="text-2xl">📊</span>
                                )}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Votre IMC: {bmi}</p>
                                <p className="text-sm text-gray-600">{bmiCategory}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="min-h-screen pt-32 pb-20 relative">
                <div className="container mx-auto px-4">
                    {/* Introduction Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-5xl mx-auto mb-16"
                    >
                        <div className="text-center mb-10">
                            <h1 className="text-4xl md:text-5xl font-bold text-orange-600 mb-4">
                                Indice de Masse Corporelle
                            </h1>
                            <p className="text-xl text-orange-500 max-w-3xl mx-auto">
                                Comprendre la composition de votre corps pour une meilleure gestion de votre santé
                            </p>
                        </div>
                        
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 shadow-lg border border-orange-200">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="md:w-1/2">
                                    <h2 className="text-2xl font-bold text-orange-700 mb-4">Qu'est-ce que l'IMC ?</h2>
                                    <p className="text-gray-700 mb-4">
                                        L'Indice de Masse Corporelle (IMC) est une valeur numérique dérivée du poids et de la taille d'une personne. 
                                        Il fournit un moyen simple et rapide d'évaluer si une personne a un poids corporel sain par rapport à sa taille.
                                    </p>
                                    <p className="text-gray-700 mb-4">
                                        Bien que l'IMC ne mesure pas directement la graisse corporelle, il sert d'outil de dépistage utile pour 
                                        identifier les problèmes de poids potentiels qui pourraient mener à des problèmes de santé.
                                    </p>
                                    <div className="mt-6 flex items-center bg-white p-4 rounded-lg shadow-sm border border-orange-100">
                                        <div className="mr-4 bg-orange-100 p-3 rounded-full">
                                            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-sm text-gray-700">
                                            L'IMC est calculé en divisant le poids en kilogrammes par le carré de la taille en mètres.
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="md:w-1/2">
                                    <h2 className="text-2xl font-bold text-orange-700 mb-4">Catégories d'IMC</h2>
                                    <div className="space-y-3">
                                        <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                                            <div className="w-16 h-1 bg-blue-500 rounded-full mr-3"></div>
                                            <div>
                                                <p className="font-medium text-gray-800">Insuffisance pondérale</p>
                                                <p className="text-sm text-gray-600">Inférieur à 18,5</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-100">
                                            <div className="w-16 h-1 bg-green-500 rounded-full mr-3"></div>
                                            <div>
                                                <p className="font-medium text-gray-800">Poids normal</p>
                                                <p className="text-sm text-gray-600">18,5 - 24,9</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                                            <div className="w-16 h-1 bg-yellow-500 rounded-full mr-3"></div>
                                            <div>
                                                <p className="font-medium text-gray-800">Surpoids</p>
                                                <p className="text-sm text-gray-600">25,0 - 29,9</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center p-3 bg-red-50 rounded-lg border border-red-100">
                                            <div className="w-16 h-1 bg-red-500 rounded-full mr-3"></div>
                                            <div>
                                                <p className="font-medium text-gray-800">Obésité</p>
                                                <p className="text-sm text-gray-600">30,0 et plus</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-orange-600 mb-4">
                            Calculez Votre IMC
                        </h1>
                        <p className="text-xl text-orange-500">
                            Suivez votre progression fitness avec notre calculateur d'IMC
                        </p>
                    </motion.div>

                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Form Section - Left Side */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-orange-200 backdrop-blur-sm"
                            style={{ 
                                background: 'linear-gradient(to bottom right, rgba(255, 237, 213, 0.9), rgba(254, 215, 170, 0.85))'
                            }}
                        >
                            <form onSubmit={calculateBMI} className="space-y-6">
                                {/* Unit Toggle */}
                                <div className="flex justify-center space-x-2 p-1 bg-white rounded-lg shadow-sm border border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() => setIsMetric(true)}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                                            isMetric 
                                                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm'
                                                : 'bg-white text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                        </svg>
                                        <span>Métrique</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsMetric(false)}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                                            !isMetric 
                                                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm'
                                                : 'bg-white text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                        <span>Impérial</span>
                                    </button>
                                </div>

                                {/* Gender Selection */}
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setGender('male')}
                                        className={`${buttonStyle.base} ${gender === 'male' ? buttonStyle.active : buttonStyle.inactive}`}
                                    >
                                        <div className="relative z-10 flex items-center justify-center space-x-3">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span className="font-medium">Homme</span>
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setGender('female')}
                                        className={`${buttonStyle.base} ${gender === 'female' ? buttonStyle.active : buttonStyle.inactive}`}
                                    >
                                        <div className="relative z-10 flex items-center justify-center space-x-3">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span className="font-medium">Femme</span>
                                        </div>
                                    </button>
                                </div>

                                {/* Input Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="relative">
                                        <label className="block text-gray-700 mb-1.5 text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                <span>Âge</span>
                                            </div>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={age}
                                                onChange={(e) => setAge(e.target.value)}
                                                className="w-full bg-gray-50 rounded-lg pl-3 pr-10 py-2 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                                                placeholder="Entrez votre âge"
                                                required
                                            />
                                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                                                ans
                                            </span>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <label className="block text-gray-700 mb-1.5 text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                                                </svg>
                                                <span>Taille</span>
                                            </div>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={height}
                                                onChange={(e) => setHeight(e.target.value)}
                                                className="w-full bg-gray-50 rounded-lg pl-3 pr-10 py-2 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                                                placeholder="Entrez votre taille"
                                                required
                                            />
                                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                                                {isMetric ? 'cm' : 'in'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <label className="block text-gray-700 mb-1.5 text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                                </svg>
                                                <span>Poids</span>
                                            </div>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={weight}
                                                onChange={(e) => setWeight(e.target.value)}
                                                className="w-full bg-gray-50 rounded-lg pl-3 pr-10 py-2 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                                                placeholder="Entrez votre poids"
                                                required
                                            />
                                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                                                {isMetric ? 'kg' : 'lbs'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex space-x-3">
                                    <button
                                        type="submit"
                                        className="flex-1 max-w-[300px] mx-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white py-2.5 rounded-lg font-medium text-sm transition-all duration-300 hover:shadow-md active:scale-[0.98]"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                        <span>Calculer l'IMC</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="px-4 py-2.5 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-all duration-300 active:bg-gray-200 w-[50px]"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    </button>
                                </div>
                            </form>
                        </motion.div>

                        {/* Results Section - Right Side */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-orange-200 backdrop-blur-sm"
                            style={{ 
                                background: 'linear-gradient(to bottom right, rgba(255, 237, 213, 0.9), rgba(254, 215, 170, 0.85))'
                            }}
                        >
                            <AnimatePresence mode="wait">
                                {!showInformation ? (
                                    <motion.div
                                        key="scale"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-2xl font-bold text-gray-900">Échelle d'IMC</h3>
                                            {bmi && (
                                                <button
                                                    onClick={() => setShowInformation(true)}
                                                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300"
                                                >
                                                    Voir les informations
                                                </button>
                                            )}
                                        </div>
                                        
                                        {/* BMI Scale */}
                                        <div className="relative mb-8">
                                            {/* Gradient Background */}
                                            <div className="h-12 w-full bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 to-red-500 rounded-lg relative mb-1">
                                                {/* Animated Pointer */}
                                                <motion.div
                                                    className="absolute top-0 transform -translate-y-full"
                                                    style={{ left: `${pointerPosition}%` }}
                                                >
                                                    {/* Value Box */}
                                                    <div className="bg-white border border-gray-200 rounded px-2 py-1 shadow-sm text-sm font-medium mb-1">
                                                        {bmi || (15 + (pointerPosition * 0.25)).toFixed(1)}
                                                    </div>
                                                    {/* Pointer Triangle */}
                                                    <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-gray-800 mx-auto" />
                                                </motion.div>
                                            </div>

                                            {/* Scale Labels */}
                                            <div className="flex justify-between text-sm text-gray-600 mt-1">
                                                <span>15</span>
                                                <span>18.5</span>
                                                <span>25</span>
                                                <span>30</span>
                                                <span>35</span>
                                                <span>40</span>
                                            </div>

                                            {/* Category Labels */}
                                            <div className="flex text-sm mt-4">
                                                <div className="flex-1">
                                                    <div className="font-medium text-blue-500">Insuffisance</div>
                                                    <div className="text-gray-500">&lt;18.5</div>
                                                </div>
                                                <div className="flex-1 text-center">
                                                    <div className="font-medium text-green-500">Normal</div>
                                                    <div className="text-gray-500">18.5-24.9</div>
                                                    </div>
                                                <div className="flex-1 text-center">
                                                    <div className="font-medium text-yellow-500">Surpoids</div>
                                                    <div className="text-gray-500">25-29.9</div>
                                                        </div>
                                                <div className="flex-1 text-right">
                                                    <div className="font-medium text-red-500">Obésité</div>
                                                    <div className="text-gray-500">30+</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Short BMI Information */}
                                        {bmi && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-8 p-6 rounded-lg bg-gradient-to-br from-white to-gray-50 border border-gray-100"
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <div>
                                                        <h4 className="text-lg font-semibold text-gray-700">Votre IMC</h4>
                                                        <p className="text-3xl font-bold" style={{ color: getCategoryColor(parseFloat(bmi)) }}>
                                                            {bmi}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <h4 className="text-lg font-semibold text-gray-700">Catégorie</h4>
                                                        <p className="text-lg font-medium" style={{ color: getCategoryColor(parseFloat(bmi)) }}>
                                                            {bmiCategory}
                                                        </p>
                                                    </div>
                                                </div>
                                                <motion.div 
                                                    className="w-full h-1 rounded-full bg-gray-200 overflow-hidden"
                                                    initial={{ scaleX: 0 }}
                                                    animate={{ scaleX: 1 }}
                                                    transition={{ duration: 1, delay: 0.5 }}
                                                >
                                                    <motion.div 
                                                        className="h-full rounded-full"
                                                        style={{ 
                                                            backgroundColor: getCategoryColor(parseFloat(bmi)),
                                                            width: `${Math.min((parseFloat(bmi) / 40) * 100, 100)}%`
                                                        }}
                                                        initial={{ scaleX: 0 }}
                                                        animate={{ scaleX: 1 }}
                                                        transition={{ duration: 1.5, delay: 0.7 }}
                                                    />
                                                </motion.div>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="information"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="relative"
                                    >
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-2xl font-bold text-gray-900">Informations détaillées</h3>
                                            <button
                                                onClick={() => setShowInformation(false)}
                                                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                                            >
                                                Retour à l'échelle
                                            </button>
                                        </div>

                                        {bmi && (
                                            <div className="space-y-6">
                                                <div className="p-4 rounded-lg bg-gray-50">
                                                    <h4 className="text-xl font-bold mb-2" style={{ color: getCategoryColor(parseFloat(bmi)) }}>
                                                        {getBmiInformation().title}
                                                    </h4>
                                                    <p className="text-gray-600">{getBmiInformation().description}</p>
                                                </div>

                                                {getBmiInformation().risks.length > 0 && (
                                                    <div className="p-4 rounded-lg bg-red-50">
                                                        <h5 className="font-bold text-red-600 mb-2">Risques potentiels</h5>
                                                        <ul className="space-y-1">
                                                            {getBmiInformation().risks.map((risk, index) => (
                                                                <li key={index} className="flex items-center text-gray-600">
                                                                    <span className="text-red-500 mr-2">•</span>
                                                                    {risk}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                <div className="p-4 rounded-lg bg-green-50">
                                                    <h5 className="font-bold text-green-600 mb-2">Recommandations</h5>
                                                    <ul className="space-y-1">
                                                        {getBmiInformation().recommendations.map((rec, index) => (
                                                            <li key={index} className="flex items-center text-gray-600">
                                                                <span className="text-green-500 mr-2">•</span>
                                                                {rec}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BmiCalculator; 