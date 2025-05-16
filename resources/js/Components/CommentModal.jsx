import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from '@inertiajs/react';

const CommentModal = ({ isOpen, onClose }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    const { data, setData, post, processing, errors, reset } = useForm({
        content: '',
        rating: 0
    });

    const handleStarClick = (ratingValue) => {
        setRating(ratingValue);
        setData('rating', ratingValue);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('comments.store'), {
            onSuccess: () => {
                reset();
                setRating(0);
                onClose();
            }
        });
    };

    const renderStars = (value, isInteractive = false) => {
        return [...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
                <button
                    key={index}
                    type={isInteractive ? "button" : "div"}
                    className={`text-3xl focus:outline-none transition-transform duration-300 ${
                        isInteractive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
                    }`}
                    onClick={() => isInteractive && handleStarClick(ratingValue)}
                    onMouseEnter={() => isInteractive && setHoverRating(ratingValue)}
                    onMouseLeave={() => isInteractive && setHoverRating(0)}
                >
                    <span className={`${
                        ratingValue <= (hoverRating || rating || value)
                            ? 'text-yellow-400'
                            : 'text-gray-600'
                    } ${isInteractive && ratingValue <= (hoverRating || rating) ? 'drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' : ''}`}>
                        ★
                    </span>
                </button>
            );
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />

                    {/* Centered Modal Wrapper */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", damping: 15, stiffness: 300 }}
                            className="w-full max-w-2xl mx-4 p-1 rounded-2xl bg-gradient-to-br from-red-600 via-red-500 to-orange-500 shadow-[0_20px_60px_-10px_rgba(220,38,38,0.7)]"
                        >
                            <div className="bg-gray-900 rounded-2xl w-full h-full overflow-hidden">
                                {/* Modal Header with Gradient */}
                                <div className="bg-gradient-to-r from-gray-800 to-gray-900 relative overflow-hidden">
                                    {/* Decorative elements */}
                                    <div className="absolute -right-10 -top-10 w-20 h-20 rounded-full bg-red-600 opacity-20 blur-xl"></div>
                                    <div className="absolute -left-10 -bottom-10 w-20 h-20 rounded-full bg-orange-500 opacity-20 blur-xl"></div>
                                    
                                    <div className="p-6 sm:p-8 relative z-10 flex justify-between items-start">
                                        <h2 className="text-2xl sm:text-3xl font-bold text-white">Share Your Experience</h2>
                                        <button
                                            onClick={onClose}
                                            className="text-gray-400 hover:text-white transition-colors duration-300 bg-gray-800 bg-opacity-50 rounded-full p-2 hover:bg-opacity-70"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Modal Body */}
                                <div className="p-6 sm:p-8 pt-4">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <label className="block text-white mb-3 text-lg font-medium">Your Rating</label>
                                            <div className="flex space-x-2 bg-gray-800 rounded-xl p-4 items-center justify-center">
                                                {renderStars(rating, true)}
                                            </div>
                                            {errors.rating && (
                                                <p className="text-red-500 text-sm mt-2">{errors.rating}</p>
                                            )}
                                        </div>
                                        
                                        <div>
                                            <label className="block text-white mb-3 text-lg font-medium">Your Comment</label>
                                            <div className="relative">
                                                <textarea
                                                    value={data.content}
                                                    onChange={e => setData('content', e.target.value)}
                                                    className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none min-h-[150px] placeholder-gray-500"
                                                    placeholder="Tell us about your experience at POWER GYM..."
                                                ></textarea>
                                                {/* Decorative quote mark */}
                                                <div className="absolute top-2 right-2 opacity-10 text-red-500 text-6xl font-serif pointer-events-none">
                                                    "
                                                </div>
                                            </div>
                                            {errors.content && (
                                                <p className="text-red-500 text-sm mt-2">{errors.content}</p>
                                            )}
                                        </div>
                                        
                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full py-4 px-6 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-red-600/30 relative overflow-hidden group"
                                        >
                                            {/* Animated shine effect */}
                                            <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 blur-xl transform -translate-x-full group-hover:translate-x-full transition-all duration-1000"></span>
                                            
                                            {processing ? (
                                                <div className="flex items-center justify-center">
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Submitting...
                                                </div>
                                            ) : 'Submit Review'}
                                        </button>
                                    </form>
                                </div>
                                
                                {/* Modal Footer */}
                                <div className="px-6 sm:px-8 py-3 border-t border-gray-800 text-center text-sm text-gray-500">
                                    <p>Your review helps other members learn about our gym. Thank you!</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CommentModal; 