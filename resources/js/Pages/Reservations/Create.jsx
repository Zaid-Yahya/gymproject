import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; // Removed
import Navbar from '@/Components/Navbar'; // Import Navbar
import { Calendar } from '@/Components/ui/calendar';
import { Button } from '@/Components/ui/button';
import { Toaster, toast } from 'react-hot-toast';
import "react-day-picker/dist/style.css";
import { motion, AnimatePresence } from 'framer-motion'; // Import AnimatePresence

// New SuccessModal component
const SuccessModal = ({ isOpen, onClose, reservationDate }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 50 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="bg-gradient-to-br from-gray-800 to-black rounded-2xl shadow-2xl border border-gray-700 p-8 max-w-md w-full text-center relative"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>

                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                            className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                        >
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </motion.div>

                        <h3 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 text-transparent bg-clip-text mb-4">
                            Réservation Confirmée !
                        </h3>
                        <p className="text-gray-300 mb-6">
                            Votre séance d'entraînement a été réservée avec succès.
                        </p>
                        
                        {reservationDate && (
                            <p className="text-gray-400 text-sm mb-6">
                                Vous avez réservé pour le: <span className="font-semibold text-white">{reservationDate}</span>
                            </p>
                        )}

                        <p className="text-gray-400 text-sm mb-8">
                            Un e-mail de confirmation avec les détails de votre session et un code QR a été envoyé à votre adresse e-mail.
                        </p>

                        <Button onClick={onClose} className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-full py-3 hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                            Fermer
                        </Button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default function Create({ auth }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        date: null,
    });

    const [isDarkMode, setIsDarkMode] = useState(true); // Always dark mode for this page
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [confirmedReservationDate, setConfirmedReservationDate] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('reservations.store'), {
            onSuccess: () => {
                // Instead of toast, show the custom modal
                setShowSuccessModal(true);
                setConfirmedReservationDate(data.date ? new Date(data.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : null);
                reset({ date: null }); // Reset form after successful submission
            },
            onError: () => {
                toast.error('Échec de la réservation. Veuillez réessayer.');
            },
        });
    };

    return (
        <div className={`transition-colors duration-700 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <Head title="Réserver une Séance" />
            <Toaster position="top-right" />
            
            <Navbar activeSection="reservations" /> {/* Pass activeSection prop */}

            <section className="min-h-screen flex items-center justify-center py-20 relative overflow-hidden">
                {/* Background particles/elements - similar to Home.jsx */}
                <div className="absolute -top-40 -left-20 w-80 h-80 bg-gray-800 rounded-full opacity-10 blur-3xl animate-pulse-slow"></div>
                <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-gray-800 rounded-full opacity-10 blur-3xl animate-pulse-slow"></div>
                <div className="absolute inset-0 bg-pattern-overlay opacity-5"></div>

                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="bg-gradient-to-br from-gray-800 to-black rounded-2xl shadow-2xl overflow-hidden border border-gray-700 backdrop-blur-sm"
                    >
                        <div className="bg-gradient-to-r from-red-600 to-orange-500 px-6 md:px-10 py-6 text-white text-center">
                            <motion.h2 
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="text-3xl md:text-4xl font-bold mb-2"
                            >
                                Réserver Votre Séance d'Entraînement
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="text-lg text-red-100 opacity-90"
                            >
                                Choisissez la date qui vous convient
                            </motion.p>
                        </div>

                        <div className="p-6 md:p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                >
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Sélectionner une Date
                                    </label>
                                    <Calendar
                                        mode="single"
                                        selected={data.date}
                                        onSelect={(date) => setData('date', date)}
                                        className="rounded-md border border-gray-700 bg-gray-800 text-white w-full max-w-sm mx-auto"
                                        disabled={(date) => date < new Date()}
                                    />
                                    {errors.date && (
                                        <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                                    )}
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.5 }}
                                >
                                    <Button
                                        type="submit"
                                        disabled={processing || !data.date}
                                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-full py-3 hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                    >
                                        {processing ? 'Réservation en cours...' : 'Réserver la Séance'}
                                    </Button>
                                </motion.div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </section>
            
            {/* Success Modal */}
            <SuccessModal 
                isOpen={showSuccessModal} 
                onClose={() => setShowSuccessModal(false)} 
                reservationDate={confirmedReservationDate} 
            />

            {/* Add custom styles for animations if not already global */}
            <style>{`
                @keyframes pulse-slow {
                    0%, 100% { transform: scale(1); opacity: 0.8; }
                    50% { transform: scale(1.05); opacity: 1; }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 4s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
} 