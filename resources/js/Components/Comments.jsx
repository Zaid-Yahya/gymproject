import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from '@inertiajs/react';
import CommentModal from './CommentModal';

const Comments = ({ comments = [] }) => {
    const [showForm, setShowForm] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const scrollContainerRef = useRef(null);
    const [scrollable, setScrollable] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [maxScroll, setMaxScroll] = useState(0);
    const [autoScrolling, setAutoScrolling] = useState(true);
    const [scrollDirection, setScrollDirection] = useState('right');
    const autoScrollRef = useRef(null);
    const scrollSpeedRef = useRef(2); // Increased from 0.5 to 2 pixels per frame for more noticeable animation
    const [hoveredCard, setHoveredCard] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        content: '',
        rating: 0
    });

    // Check if scrolling is needed based on content width
    useEffect(() => {
        if (scrollContainerRef.current) {
            const checkScrollable = () => {
                const container = scrollContainerRef.current;
                const isScrollable = container.scrollWidth > container.clientWidth;
                setScrollable(isScrollable);
                setMaxScroll(container.scrollWidth - container.clientWidth);
            };
            
            checkScrollable();
            window.addEventListener('resize', checkScrollable);
            
            // Monitor scroll position
            const handleScroll = () => {
                if (scrollContainerRef.current) {
                    setScrollPosition(scrollContainerRef.current.scrollLeft);
                }
            };
            
            scrollContainerRef.current.addEventListener('scroll', handleScroll);
            
            return () => {
                window.removeEventListener('resize', checkScrollable);
                if (scrollContainerRef.current) {
                    scrollContainerRef.current.removeEventListener('scroll', handleScroll);
                }
            };
        }
    }, [comments]);

    // Auto-scrolling animation - Modified and fixed
    useEffect(() => {
        // Clear any existing animation frame
        if (autoScrollRef.current) {
            cancelAnimationFrame(autoScrollRef.current);
            autoScrollRef.current = null;
        }
        
        // Only run animation if scrollable and autoScrolling is true
        if (!scrollable || !autoScrolling) return;
        
        let lastTimestamp = 0;
        const FRAME_RATE = 60; // Frames per second target
        const MS_PER_FRAME = 1000 / FRAME_RATE;
        
        const animateScroll = (timestamp) => {
            if (!scrollContainerRef.current) return;
            
            // Throttle to desired frame rate
            if (timestamp - lastTimestamp < MS_PER_FRAME) {
                autoScrollRef.current = requestAnimationFrame(animateScroll);
                return;
            }
            
            lastTimestamp = timestamp;
            
            // Get current scroll position
            const currentScroll = scrollContainerRef.current.scrollLeft;
            
            // Calculate new position based on direction
            let newScrollPosition;
            
            if (scrollDirection === 'right') {
                newScrollPosition = currentScroll + scrollSpeedRef.current;
                
                // If we reach the end, change direction
                if (newScrollPosition >= maxScroll - 5) {
                    setScrollDirection('left');
                }
            } else {
                newScrollPosition = currentScroll - scrollSpeedRef.current;
                
                // If we reach the start, change direction
                if (newScrollPosition <= 5) {
                    setScrollDirection('right');
                }
            }
            
            // Apply scroll
            scrollContainerRef.current.scrollLeft = newScrollPosition;
            
            // Continue animation
            autoScrollRef.current = requestAnimationFrame(animateScroll);
        };
        
        // Start the animation
        autoScrollRef.current = requestAnimationFrame(animateScroll);
        
        // Cleanup function
        return () => {
            if (autoScrollRef.current) {
                cancelAnimationFrame(autoScrollRef.current);
                autoScrollRef.current = null;
            }
        };
    }, [scrollable, autoScrolling, scrollDirection, maxScroll]);

    // Add keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (scrollable) {
                if (e.key === 'ArrowLeft') {
                    pauseAutoScroll();
                    scroll('left');
                } else if (e.key === 'ArrowRight') {
                    pauseAutoScroll();
                    scroll('right');
                }
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [scrollable]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('comments.store'), {
            onSuccess: () => {
                reset();
                setRating(0);
                setShowForm(false);
            }
        });
    };

    const pauseAutoScroll = () => {
        setAutoScrolling(false);
        // Resume after 10 seconds of inactivity
        setTimeout(() => setAutoScrolling(true), 10000);
    };

    const scroll = (direction) => {
        console.log(`Attempting to scroll ${direction}`);
        pauseAutoScroll();
        
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollAmount = container.clientWidth * 0.8; // Scroll 80% of visible width
            const currentScroll = container.scrollLeft;
            const targetScroll = currentScroll + (direction === 'left' ? -scrollAmount : scrollAmount);
            
            console.log(`Current scroll: ${currentScroll}, Target scroll: ${targetScroll}`);
            
            container.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        } else {
            console.error("Scroll container ref not available");
        }
    };

    const renderStars = (value, isInteractive = false) => {
        return [...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
                <button
                    key={index}
                    type={isInteractive ? "button" : "div"}
                    className={`text-2xl focus:outline-none ${
                        isInteractive ? 'cursor-pointer' : 'cursor-default'
                    }`}
                    onClick={() => isInteractive && setRating(ratingValue)}
                    onMouseEnter={() => isInteractive && setHoverRating(ratingValue)}
                    onMouseLeave={() => isInteractive && setHoverRating(0)}
                >
                    <span className={`${
                        ratingValue <= (hoverRating || rating || value)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                    }`}>
                        ★
                    </span>
                </button>
            );
        });
    };

    // Can we scroll further in each direction?
    const canScrollLeft = scrollPosition > 0;
    const canScrollRight = scrollPosition < maxScroll;

    return (
        <section className="py-24 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-600 rounded-full opacity-10 blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-600 rounded-full opacity-10 blur-3xl"></div>
            
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="inline-block text-3xl md:text-5xl font-bold text-white mb-4 relative">
                        MEMBER TESTIMONIALS
                        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-red-600"></div>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Hear what our members have to say about their experience at POWER GYM
                    </p>
                </div>

                {/* Add Comment Button */}
                <div className="max-w-2xl mx-auto mb-16">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-600/30"
                    >
                        Share Your Experience
                    </button>
                </div>

                {/* Comments Scroll Section with Indicator */}
                <div className="relative mb-4">
                    {/* Mobile Scroll Instructions */}
                    <div className="md:hidden text-center text-gray-400 text-sm mb-4">
                        <p>Swipe left or right to see more testimonials</p>
                    </div>
                    
                    {/* Left Scroll Button - Only show if scrollable and can scroll left */}
                    {scrollable && canScrollLeft && (
                        <button
                            onClick={() => scroll('left')}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)] hover:shadow-[0_0_25px_rgba(220,38,38,0.8)] hover:scale-110 transition-all duration-300 focus:outline-none"
                            aria-label="Scroll left"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}

                    {/* Comments Container */}
                    <div
                        ref={scrollContainerRef}
                        className="flex space-x-8 overflow-x-auto scrollbar-hide px-4 pb-8 -mx-4 px-4"
                        style={{ 
                            scrollbarWidth: 'none', 
                            msOverflowStyle: 'none',
                            scrollSnapType: 'x mandatory',
                            WebkitOverflowScrolling: 'touch'
                        }}
                        onMouseEnter={() => setAutoScrolling(false)}
                        onMouseLeave={() => setAutoScrolling(true)}
                        onTouchStart={() => setAutoScrolling(false)}
                        onTouchEnd={() => setTimeout(() => setAutoScrolling(true), 5000)}
                    >
                        {comments && comments.length > 0 ? (
                            comments.map((comment, index) => (
                                <motion.div
                                    key={comment.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`flex-none w-[280px] sm:w-[320px] md:w-[380px] rounded-xl p-0.5 transform transition-all duration-500 ${
                                        hoveredCard === comment.id 
                                            ? 'scale-105 bg-gradient-to-br from-red-600 via-red-500 to-orange-500 shadow-[0_10px_30px_-5px_rgba(220,38,38,0.5)]'
                                            : 'bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 shadow-xl'
                                    }`}
                                    style={{ scrollSnapAlign: 'start' }}
                                    onMouseEnter={() => setHoveredCard(comment.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                >
                                    <div className="bg-gray-900 rounded-xl p-6 h-full relative overflow-hidden">
                                        {/* Background accents */}
                                        <div className="absolute -right-8 -top-8 w-16 h-16 rounded-full bg-red-600 opacity-10 blur-xl"></div>
                                        <div className="absolute -left-8 -bottom-8 w-16 h-16 rounded-full bg-red-600 opacity-10 blur-xl"></div>
                                        
                                        {/* Quote mark */}
                                        <div className="absolute top-2 right-2 opacity-10 text-red-600 text-4xl font-serif">
                                            "
                                        </div>
                                    
                                        <div className="flex items-center mb-6 relative z-10">
                                            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                                {comment.user.name.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <h4 className="text-white font-bold text-lg">{comment.user.name}</h4>
                                                <div className="flex mt-1">
                                                    {renderStars(comment.rating)}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <p className="text-gray-300 mb-6 relative z-10">"{comment.content}"</p>
                                        
                                        <div className="mt-4 text-sm text-gray-500 border-t border-gray-800 pt-3 italic">
                                            {new Date(comment.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="w-full text-center text-gray-400 py-8">
                                No comments yet. Be the first to share your experience!
                            </div>
                        )}
                    </div>

                    {/* Right Scroll Button - Only show if scrollable and can scroll right */}
                    {scrollable && canScrollRight && (
                        <button
                            onClick={() => scroll('right')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-red-700 to-red-600 text-white p-4 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)] hover:shadow-[0_0_25px_rgba(220,38,38,0.8)] hover:scale-110 transition-all duration-300 focus:outline-none"
                            aria-label="Scroll right"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}
                </div>
                
                {/* Scroll Position Indicator */}
                {scrollable && (
                    <div className="flex justify-center space-x-2 mt-6">
                        <div className="w-24 md:w-40 h-1 bg-gray-700 rounded-full relative">
                            <div 
                                className="absolute top-0 left-0 h-1 bg-gradient-to-r from-red-500 to-red-700 rounded-full transition-all duration-300"
                                style={{ 
                                    width: `${Math.min(100, (scrollPosition / maxScroll) * 100)}%`
                                }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Comment Modal */}
            <CommentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </section>
    );
};

export default Comments; 