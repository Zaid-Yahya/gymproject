import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import GalleryCarousel from './GalleryCarousel'; // Assuming this component exists
import { motion, AnimatePresence } from 'framer-motion';
import Comments from '@/Components/Comments';
import Navbar from '@/Components/Navbar';

// Add enhanced split-text animation for section titles
const SplitTextTitle = ({ text, color = "text-orange-600" }) => {
    const words = text.split(' ');
    
    return (
        <div className="relative flex flex-wrap justify-center mb-8">
            {words.map((word, wordIndex) => (
                <div key={wordIndex} className="mx-2 overflow-hidden">
                    <div className="flex">
                        {word.split('').map((char, charIndex) => (
                            <motion.div 
                                key={`${wordIndex}-${charIndex}`}
                                initial={{ y: "100%", filter: "blur(10px)", opacity: 0 }}
                                whileInView={{ y: 0, filter: "blur(0px)", opacity: 1 }}
                                transition={{ 
                                    duration: 0.8, 
                                    delay: 0.05 * charIndex + 0.1 * wordIndex,
                                    ease: [0.16, 1, 0.3, 1]
                                }}
                                viewport={{ once: true, margin: "-10%" }}
                                className={`font-bold ${color} text-4xl md:text-5xl`}
                            >
                                {char}
                            </motion.div>
                        ))}
                    </div>
                </div>
            ))}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-orange-400 to-red-500"></div>
        </div>
    );
};

// Circular Image Gallery Component
const CircularGallery = () => {
    const containerRef = useRef(null);
    const [paused, setPaused] = useState(false);
    
    // Gallery images data with labels - gym/fitness images
    const galleryImages = [
        {
            src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600&q=80",
            alt: "Weight Training",
            label: "Weight Training"
        },
        {
            src: "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600&q=80",
            alt: "Gym Equipment",
            label: "Gym Equipment"
        },
        {
            src: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600&q=80",
            alt: "Fitness Class",
            label: "Fitness Class"
        },
        {
            src: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600&q=80",
            alt: "Personal Training",
            label: "Personal Training"
        },
        {
            src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600&q=80",
            alt: "Strength Building",
            label: "Strength Building"
        }
    ];
    
    useEffect(() => {
        // Add animation styles for the carousel
        const style = document.createElement('style');
        style.textContent = `
            @keyframes scrollGallery {
                0% {
                    transform: translateX(0);
                }
                100% {
                    transform: translateX(calc(-320px * 5)); /* Width of images multiplied by number of items */
                }
            }
            
            .gallery-container {
                overflow: hidden;
                position: relative;
                width: 100%;
            }
            
            .gallery-track {
                display: flex;
                width: calc(320px * 10); /* Width of all images (including duplicates) */
                animation: scrollGallery 25s linear infinite;
            }
            
            .gallery-track:hover {
                animation-play-state: paused;
            }
            
            .gallery-item {
                width: 320px;
                flex-shrink: 0;
                padding: 0 10px;
            }
        `;
        document.head.appendChild(style);
        
        return () => {
            document.head.removeChild(style);
        };
    }, []);
    
    // Create two sets of the same images to ensure seamless looping
    const doubledImages = [...galleryImages, ...galleryImages];
    
    return (
        <div className="gallery-container">
            <div className="gallery-track">
                {doubledImages.map((image, index) => (
                    <div key={index} className="gallery-item">
                        <div className="relative rounded-lg overflow-hidden shadow-2xl h-[480px] transition-all duration-300 hover:scale-105">
                            <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-full object-cover filter grayscale"
                            />
                            <div className="absolute bottom-0 left-0 right-0 text-center p-4 bg-black bg-opacity-40">
                                <p className="text-white text-lg font-semibold">
                                    {image.label}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Black fade gradient on sides for seamless look */}
            <div className="absolute top-0 left-0 h-full w-16 bg-gradient-to-r from-black to-transparent z-10"></div>
            <div className="absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-black to-transparent z-10"></div>
        </div>
    );
};

// Custom components
const ParticleBackground = () => {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const mouseRef = useRef({ x: undefined, y: undefined, radius: 150 });
    
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };
        
        const handleMouseMove = (e) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY;
        };
        
        const handleMouseLeave = () => {
            mouseRef.current.x = undefined;
            mouseRef.current.y = undefined;
        };
        
        const initParticles = () => {
            const particles = [];
            const particleCount = Math.min(Math.floor(canvas.width * canvas.height / 12000), 150);
            
            for (let i = 0; i < particleCount; i++) {
                const size = Math.random() * 3 + 1;
                const x = Math.random() * (canvas.width - size * 2);
                const y = Math.random() * (canvas.height - size * 2);
                const directionX = Math.random() * 1 - 0.5;
                const directionY = Math.random() * 1 - 0.5;
                const color = `rgba(220, 38, 38, ${Math.random() * 0.5 + 0.2})`; // Red with varying opacity
                
                particles.push({
                    x, y, size, directionX, directionY, color
                });
            }
            
            particlesRef.current = particles;
        };
        
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particlesRef.current.forEach((particle, index) => {
                particle.x += particle.directionX;
                particle.y += particle.directionY;
                
                // Bounce off edges
                if (particle.x < 0 || particle.x > canvas.width) {
                    particle.directionX = -particle.directionX;
                }
                if (particle.y < 0 || particle.y > canvas.height) {
                    particle.directionY = -particle.directionY;
                }
                
                // Mouse interaction
                if (mouseRef.current.x !== undefined) {
                    const dx = mouseRef.current.x - particle.x;
                    const dy = mouseRef.current.y - particle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < mouseRef.current.radius) {
                        const angle = Math.atan2(dy, dx);
                        const force = (mouseRef.current.radius - distance) / mouseRef.current.radius;
                        particle.directionX -= Math.cos(angle) * force * 0.6;
                        particle.directionY -= Math.sin(angle) * force * 0.6;
                    }
                }
                
                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
                
                // Connect nearby particles
                particlesRef.current.forEach((otherParticle, otherIndex) => {
                    if (index === otherIndex) return;
                    
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(220, 38, 38, ${0.2 * (1 - distance / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.stroke();
                    }
                });
            });
            
            animationFrameId = requestAnimationFrame(animate);
        };
        
        window.addEventListener('resize', handleResize);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);
        
        handleResize();
        animate();
        
        return () => {
            window.removeEventListener('resize', handleResize);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);
    
    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full -z-10 opacity-75"
        />
    );
};

// Title animation component with staggered letters
const AnimatedTitle = ({ text, delay = 0 }) => {
    const letters = text.split('');
    
    return (
        <div className="inline-block overflow-hidden">
            {letters.map((letter, index) => (
                <span 
                    key={index}
                    className="inline-block animate-title-enter"
                    style={{ 
                        animationDelay: `${delay + index * 0.05}s`,
                        opacity: 0
                    }}
                >
                    {letter === ' ' ? '\u00A0' : letter}
                </span>
            ))}
        </div>
    );
};

// FitnessIcon component for interactive icons
const FitnessIcon = ({ icon, label, description }) => {
    return (
        <div className="group transition-all duration-500 hover:scale-105">
            <div className="flex flex-col items-center">
                <div className="w-20 h-20 flex items-center justify-center text-4xl mb-4 bg-white bg-opacity-10 rounded-full shadow-glow transition-all duration-500 group-hover:shadow-glow-intense group-hover:bg-red-600 group-hover:text-white">
                    {icon}
                </div>
                <h3 className="text-xl font-bold mb-2 transition-all duration-300 group-hover:text-red-500">{label}</h3>
                <p className="text-center text-gray-400 max-w-xs">{description}</p>
            </div>
        </div>
    );
};

// FeatureCard component for program sections with enhanced animations
const FeatureCard = ({ title, description, image, reverse = false, animate = true }) => {
    const cardRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        if (!animate) {
            setIsVisible(true);
            return;
        }
        
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.2 }
        );
        
        if (cardRef.current) {
            observer.observe(cardRef.current);
        }
        
        return () => {
            if (cardRef.current) {
                observer.unobserve(cardRef.current);
            }
        };
    }, [animate]);
    
    return (
        <div 
            ref={cardRef} 
            className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center mb-24 last:mb-0 overflow-hidden`}
        >
            <motion.div 
                className={`w-full md:w-1/2 transform rounded-xl overflow-hidden`}
                initial={{ x: reverse ? 40 : -40, opacity: 0 }}
                animate={isVisible ? { x: 0, opacity: 1 } : {}}
                transition={{ 
                    duration: 1.2, 
                    ease: [0.16, 1, 0.3, 1],
                    type: "spring", 
                    stiffness: 150
                }}
                whileHover={{ scale: 1.03 }}
            >
                <div className="relative overflow-hidden rounded-lg shadow-xl">
                    <img 
                        src={image} 
                        alt={title} 
                        className="w-full h-auto object-cover"
                        style={{ maxHeight: '450px' }}
                    />
                </div>
            </motion.div>
            <motion.div 
                className="w-full md:w-1/2 md:px-12 py-8"
                initial={{ y: 40, opacity: 0 }}
                animate={isVisible ? { y: 0, opacity: 1 } : {}}
                transition={{ 
                    duration: 0.9, 
                    delay: 0.3,
                    ease: [0.16, 1, 0.3, 1]
                }}
            >
                <h3 
                    className="text-2xl md:text-3xl font-bold mb-6 tracking-tight text-gray-800"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                    {title}
                </h3>
                <p 
                    className="text-gray-600 mb-8 font-light leading-relaxed"
                    style={{ fontFamily: "'Raleway', sans-serif" }}
                >
                    {description}
                </p>
                <motion.button 
                    className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg shadow-lg relative overflow-hidden group"
                    initial={{ 
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" 
                    }}
                    whileHover={{ 
                        scale: 1.05,
                        boxShadow: "0 20px 25px -5px rgba(249, 115, 22, 0.2), 0 10px 10px -5px rgba(249, 115, 22, 0.1)",
                        transition: {
                            type: "spring",
                            stiffness: 400,
                            damping: 10
                        }
                    }}
                    whileTap={{ scale: 0.95 }}
                >
                    <motion.span 
                        className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <span className="relative z-10 flex items-center space-x-1">
                        <span>En Savoir Plus</span>
                        <motion.span
                            initial={{ x: 0, opacity: 0 }}
                            whileHover={{ x: 4, opacity: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 10
                            }}
                        >
                            →
                        </motion.span>
                    </span>
                </motion.button>
            </motion.div>
        </div>
    );
};

// Testimonial card with animation
const TestimonialCard = ({ image, name, role, quote }) => {
    return (
        <div className="backdrop-blur-sm bg-black bg-opacity-30 p-8 rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl hover:scale-105">
            <div className="flex items-center mb-6">
                <img src={image} alt={name} className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-red-500" />
                <div>
                    <h4 className="text-lg font-bold">{name}</h4>
                    <p className="text-gray-400 text-sm">{role}</p>
                </div>
            </div>
            <div className="relative">
                <svg className="absolute -top-4 -left-4 w-10 h-10 text-red-600 opacity-30" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 14">
                    <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
                </svg>
                <p className="text-gray-300">{quote}</p>
            </div>
        </div>
    );
};

// Update the AnimatedText component for better text animations
const AnimatedText = ({ children, delay = 0, className = "" }) => {
    return (
        <div className={`overflow-hidden ${className}`}>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                    duration: 1,
                    delay,
                    ease: [0.16, 1, 0.3, 1]
                }}
            >
                {children}
            </motion.div>
        </div>
    );
};

// Updated color scheme
const colors = {
    primary: {
        light: "from-orange-300 to-red-400",
        medium: "from-orange-400 to-red-500",
        dark: "from-orange-500 to-red-600",
        solid: "bg-orange-500",
        text: "text-orange-600",
        hover: "hover:bg-orange-600",
    },
    secondary: {
        bg: "bg-orange-50",
        lighter: "bg-orange-100",
        text: "text-orange-800"
    }
};

// Update UserAvatar component to be more visually appealing
const UserAvatar = ({ user, size = 'md' }) => {
    // Determine size classes
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16'
    };
    
    const fontSize = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-lg'
    };
    
    // Get first letter of name if no avatar
    const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
    
    // If user has avatar, display it
    if (user?.avatar) {
        return (
            <div className="relative">
                <img 
                    src={user.avatar} 
                    alt={user.name || 'Utilisateur'} 
                    className={`${sizeClasses[size]} rounded-full object-cover border-2 border-orange-500 shadow-lg`}
                />
                <div className="absolute -bottom-1 -right-1 bg-orange-500 rounded-full w-4 h-4 flex items-center justify-center shadow-md">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                </div>
            </div>
        );
    }
    
    // Otherwise show first letter
    return (
        <div className="relative">
            <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center border-2 border-orange-500 shadow-lg text-white font-bold ${fontSize[size]}`}>
                {firstLetter}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-orange-500 rounded-full w-4 h-4 flex items-center justify-center shadow-md">
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
            </div>
        </div>
    );
};

// Helper function to format dates
const formatCommentDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMilliseconds = now - date;
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (isNaN(diffInDays)) {
        return "Récemment";
    }
    
    if (diffInSeconds < 60) {
        return "À l'instant";
    } else if (diffInMinutes < 60) {
        return `Il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
    } else if (diffInHours < 24) {
        return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
    } else if (diffInDays < 7) {
        return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
    } else {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('fr-FR', options);
    }
};

// Update CommentModal to include email display
const CommentModal = ({ isOpen, onClose, onSubmit }) => {
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(0);
    
    // Use Inertia form handling
    const { data, setData, post, processing, errors, reset } = useForm({
        content: '',
        rating: 0
    });
    
    if (!isOpen) return null;
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Update form data
        setData('content', content);
        setData('rating', rating);
        
        // Submit to backend using Inertia
        post(route('comments.store'), {
            onSuccess: () => {
                // Create a local copy of the comment for immediate display
                const localComment = {
                    name: window.auth?.user?.name || 'Utilisateur',
                    email: window.auth?.user?.email || 'utilisateur@example.com',
                    content,
                    rating,
                    date: new Date().toISOString(),
                };
                
                // Call the onSubmit prop to update UI immediately
                onSubmit(localComment);
                
                // Reset form
                setContent('');
                setRating(0);
                reset();
                
                // Close modal
                onClose();
            }
        });
    };
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full mx-4"
            >
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-xl font-bold text-gray-800">Laissez votre avis</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-red-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Votre évaluation</label>
                        <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                                <button 
                                    key={i} 
                                    type="button"
                                    onClick={() => {
                                        setRating(i + 1);
                                        setData('rating', i + 1);
                                    }}
                                    className="text-gray-300 hover:text-orange-500"
                                >
                                    <svg className={`w-6 h-6 ${i < rating ? 'text-orange-500' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                    </svg>
                                </button>
                            ))}
                        </div>
                        {errors.rating && (
                            <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Votre avis</label>
                        <textarea 
                            value={content}
                            onChange={(e) => {
                                setContent(e.target.value);
                                setData('content', e.target.value);
                            }}
                            className="w-full p-2 border border-gray-300 rounded-md h-24 focus:outline-none focus:ring-2 focus:ring-orange-500" 
                            placeholder="Partagez votre expérience avec nous"
                            required
                        ></textarea>
                        {errors.content && (
                            <p className="text-red-500 text-sm mt-1">{errors.content}</p>
                        )}
                    </div>
                    <div className="flex justify-end">
                        <button 
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-md hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105"
                        >
                            {processing ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Envoi en cours...
                                </div>
                            ) : 'Soumettre'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

// ProgramParticles component with color changing animations
const ProgramParticles = () => {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef(null);
    
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );
        
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }
        
        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, []);
    
    if (!isVisible) {
        return <div ref={containerRef} className="absolute inset-0 pointer-events-none"></div>;
    }
    
    return (
        <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Dynamic gradient lines with color transitions */}
            <motion.div 
                className="absolute left-0 h-[1px]"
                initial={{ width: 0, top: '30%', opacity: 0 }}
                animate={{ 
                    width: '50%', 
                    opacity: [0, 1, 0],
                    top: ['30%', '35%', '40%']
                }}
                transition={{ 
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
                style={{
                    background: 'linear-gradient(to right, #f97316, transparent)',
                    filter: 'blur(0.5px)'
                }}
            />
            <motion.div 
                className="absolute right-0 h-[1px]"
                initial={{ width: 0, top: '60%', opacity: 0 }}
                animate={{ 
                    width: '70%', 
                    opacity: [0, 1, 0],
                    top: ['60%', '65%', '70%']
                }}
                transition={{ 
                    duration: 10,
                    delay: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
                style={{
                    background: 'linear-gradient(to left, #ef4444, transparent)',
                    filter: 'blur(0.5px)'
                }}
            />
            <motion.div 
                className="absolute left-0 h-[1px]"
                initial={{ width: 0, top: '75%', opacity: 0 }}
                animate={{ 
                    width: '40%', 
                    opacity: [0, 1, 0],
                    top: ['75%', '70%', '65%']
                }}
                transition={{ 
                    duration: 12,
                    delay: 5,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
                style={{
                    background: 'linear-gradient(to right, #eab308, transparent)',
                    filter: 'blur(0.5px)'
                }}
            />
            
            {/* Color changing energy pulses */}
            <div className="absolute top-1/4 left-1/4">
                <motion.div 
                    className="w-4 h-4 rounded-full shadow-lg"
                    style={{ 
                        filter: "blur(0.5px)",
                        backgroundColor: "#f97316"
                    }}
                    initial={{ scale: 0.5, opacity: 1 }}
                    animate={{ 
                        scale: [0.5, 3, 0.5],
                        opacity: [1, 0, 1],
                        backgroundColor: ["#f97316", "#ef4444", "#f97316"]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>
            <div className="absolute bottom-1/3 right-1/4">
                <motion.div 
                    className="w-6 h-6 rounded-full shadow-lg"
                    initial={{ scale: 0.5, opacity: 1, backgroundColor: "#ef4444" }}
                    animate={{ 
                        scale: [0.5, 4, 0.5],
                        opacity: [1, 0, 1],
                        backgroundColor: ["#ef4444", "#f97316", "#ef4444"]
                    }}
                    transition={{
                        duration: 6,
                        delay: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{ filter: "blur(0.5px)" }}
                />
            </div>
            <div className="absolute top-2/3 left-1/3">
                <motion.div 
                    className="w-5 h-5 rounded-full shadow-lg"
                    initial={{ scale: 0.5, opacity: 1, backgroundColor: "#eab308" }}
                    animate={{ 
                        scale: [0.5, 3.5, 0.5],
                        opacity: [1, 0, 1],
                        backgroundColor: ["#eab308", "#f97316", "#eab308"]
                    }}
                    transition={{
                        duration: 5,
                        delay: 1,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{ filter: "blur(0.5px)" }}
                />
            </div>
            
            {/* New floating particles with color transitions */}
            <motion.div
                className="absolute w-3 h-3 rounded-full"
                initial={{ x: "10%", y: "20%", opacity: 0.7, backgroundColor: "#f97316" }}
                animate={{ 
                    x: ["10%", "15%", "10%"], 
                    y: ["20%", "25%", "20%"],
                    backgroundColor: ["#f97316", "#ef4444", "#f97316"],
                    scale: [1, 1.2, 1]
                }}
                transition={{ 
                    duration: 7, 
                    repeat: Infinity,
                    repeatType: "reverse" 
                }}
                style={{ filter: "blur(1px)" }}
            />
            <motion.div
                className="absolute w-4 h-4 rounded-full"
                initial={{ x: "80%", y: "40%", opacity: 0.6, backgroundColor: "#ef4444" }}
                animate={{ 
                    x: ["80%", "75%", "80%"], 
                    y: ["40%", "35%", "40%"],
                    backgroundColor: ["#ef4444", "#eab308", "#ef4444"],
                    scale: [1, 1.3, 1]
                }}
                transition={{ 
                    duration: 9, 
                    repeat: Infinity,
                    repeatType: "reverse" 
                }}
                style={{ filter: "blur(1px)" }}
            />
            <motion.div
                className="absolute w-2 h-2 rounded-full"
                initial={{ x: "30%", y: "70%", opacity: 0.8, backgroundColor: "#eab308" }}
                animate={{ 
                    x: ["30%", "35%", "30%"], 
                    y: ["70%", "65%", "70%"],
                    backgroundColor: ["#eab308", "#f97316", "#eab308"],
                    scale: [1, 1.5, 1]
                }}
                transition={{ 
                    duration: 8, 
                    repeat: Infinity,
                    repeatType: "reverse" 
                }}
                style={{ filter: "blur(1px)" }}
            />
        </div>
    );
};

// Main component
export default function Home({ comments: initialComments, auth }) {
    // Ref for sections scrolling
    const heroRef = useRef(null);
    const galleryRef = useRef(null);
    const programsRef = useRef(null);
    const trainersRef = useRef(null);
    const testimonialsRef = useRef(null);
    const membershipRef = useRef(null);
    
    // States
    const [navVisible, setNavVisible] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');
    const [isDarkMode, setIsDarkMode] = useState(false);
    
    // Fitness programs data
    const programs = [
        {
            title: "FORCE & CONDITIONNEMENT",
            description: "Développez vos muscles, augmentez votre force et améliorez votre condition physique globale avec notre programme complet de force et de conditionnement. Nos entraîneurs experts vous guideront à travers un régime personnalisé conçu pour répondre à vos objectifs spécifiques, que vous soyez débutant ou athlète avancé.",
            image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=750&q=80"
        },
        {
            title: "CARDIO & HIIT",
            description: "Maximisez la perte de graisse et la santé cardiovasculaire grâce à notre entraînement par intervalles à haute intensité et nos programmes cardio variés. Vivez des séances d'entraînement dynamiques qui maintiennent votre cœur en action et brûlent des calories longtemps après la fin de votre séance.",
            image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=750&q=80",
            reverse: true
        },
        {
            title: "YOGA & MOBILITÉ",
            description: "Améliorez votre flexibilité, votre équilibre et votre bien-être mental grâce à nos programmes de yoga et de mobilité. Parfaites pour les jours de récupération ou comme pratique autonome, ces séances favorisent la longévité dans votre parcours de fitness tout en réduisant les risques de blessures.",
            image: "/storage/join_us.jpg"
        }
    ];
    
    // Trainers data
    const trainers = [
        {
            name: "Alex Morgan",
            specialty: "Strength & Conditioning",
            image: "https://images.unsplash.com/photo-1597347343908-2937e7dcc560?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            bio: "Former professional athlete with 10+ years of coaching experience."
        },
        {
            name: "Sarah Chen",
            specialty: "Nutrition & Weight Loss",
            image: "https://images.unsplash.com/photo-1611672585731-fa10603fb9e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            bio: "Certified nutritionist specializing in transformation programs."
        },
        {
            name: "Marcus Johnson",
            specialty: "HIIT & Functional Training",
            image: "https://images.unsplash.com/photo-1567013127542-490d757e6349?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            bio: "CrossFit champion helping clients achieve their best performance."
        },
        {
            name: "Emma Rodriguez",
            specialty: "Yoga & Mobility",
            image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            bio: "15 years of yoga practice and holistic wellness coaching."
        }
    ];

    // Testimonials data
    const testimonials = [
        {
            name: "Jason Kim",
            role: "Member - 2 years",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
            quote: "Joining this gym was the best decision I've made for my health. The trainers are exceptional and the community is incredibly supportive. I've lost 45 pounds and gained confidence I never thought possible."
        },
        {
            name: "Priya Sharma",
            role: "Member - 1 year",
            image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
            quote: "The personalized approach makes all the difference. My trainer doesn't just help me work out—they've transformed my relationship with fitness. The facilities are state-of-the-art and always spotlessly clean."
        },
        {
            name: "Michael Torres",
            role: "Member - 3 years",
            image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
            quote: "As someone who tried multiple gyms before, this one stands out for its exceptional programming and supportive environment. The results speak for themselves—I'm stronger at 45 than I was at 25!"
        }
    ];
    
    // Membership plans
    const membershipPlans = [
        {
            title: "ESSENTIEL",
            price: "49",
            period: "mensuel",
            features: [
                "Accès pendant les heures creuses",
                "Évaluation fitness de base",
                "Accès vestiaire standard",
                "Ressources d'entraînement en ligne"
            ],
            popular: false,
            buttonText: "Commencer"
        },
        {
            title: "PREMIUM",
            price: "89",
            period: "mensuel",
            features: [
                "Accès illimité 24/7",
                "Tous les cours collectifs inclus",
                "Évaluation fitness mensuelle",
                "Une séance de coaching personnel/mois",
                "Vestiaire premium avec équipements"
            ],
            popular: true,
            buttonText: "Le Plus Populaire"
        },
        {
            title: "ÉLITE",
            price: "149",
            period: "mensuel",
            features: [
                "Toutes les fonctionnalités Premium",
                "Coaching personnel hebdomadaire",
                "Plan nutritionnel personnalisé",
                "Réservation prioritaire des cours",
                "Événements exclusifs pour membres",
                "Accès aux salles partenaires"
            ],
            popular: false,
            buttonText: "Expérience Ultime"
        }
    ];
    
    // Handle navigation visibility and dark mode on scroll
    useEffect(() => {
        const handleScroll = () => {
            setNavVisible(window.scrollY > 100);
            
            // Determine active section for navigation
            const scrollPosition = window.scrollY + 200;
            
            if (heroRef.current && scrollPosition < heroRef.current.offsetHeight) {
                setActiveSection('hero');
                setIsDarkMode(false);
            } else if (galleryRef.current && scrollPosition < galleryRef.current.offsetTop + galleryRef.current.offsetHeight) {
                setActiveSection('gallery');
                setIsDarkMode(true);
            } else if (programsRef.current && scrollPosition < programsRef.current.offsetTop + programsRef.current.offsetHeight) {
                setActiveSection('programs');
                setIsDarkMode(false);
            } else if (trainersRef.current && scrollPosition < trainersRef.current.offsetTop + trainersRef.current.offsetHeight) {
                setActiveSection('trainers');
                setIsDarkMode(false);
            } else if (testimonialsRef.current && scrollPosition < testimonialsRef.current.offsetTop + testimonialsRef.current.offsetHeight) {
                setActiveSection('testimonials');
                setIsDarkMode(false);
            } else if (membershipRef.current) {
                setActiveSection('membership');
                setIsDarkMode(false);
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    // Scroll to section function
    const scrollToSection = (ref, sectionId) => {
        setMobileMenuOpen(false);
        setActiveSection(sectionId);
        
        if (ref && ref.current) {
            window.scrollTo({
                top: ref.current.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    };
    
    // Add custom styles for animations
    useEffect(() => {
        const styles = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes titleEnter {
                0% { transform: translateY(100%); opacity: 0; }
                100% { transform: translateY(0); opacity: 1; }
            }
            
            @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-20px); }
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 0.8; }
                50% { transform: scale(1.05); opacity: 1; }
            }
            
            .animate-title-enter {
                animation: titleEnter 0.8s cubic-bezier(0.17, 0.55, 0.55, 1) forwards;
            }
            
            .animate-float {
                animation: float 6s ease-in-out infinite;
            }
            
            .animate-pulse-slow {
                animation: pulse 4s ease-in-out infinite;
            }
            
            .shadow-glow {
                box-shadow: 0 0 15px rgba(220, 38, 38, 0.3);
            }
            
            .shadow-glow-intense {
                box-shadow: 0 0 25px rgba(220, 38, 38, 0.8);
            }
        `;
        
        const styleElement = document.createElement('style');
        styleElement.innerHTML = styles;
        document.head.appendChild(styleElement);
        
        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);

    // Add a state for the modal
    const [commentModalOpen, setCommentModalOpen] = useState(false);
    
    // Add state for comments
    const [comments, setComments] = useState(initialComments || []);
    
    // Make sure we have properly formatted comments
    useEffect(() => {
        // Ensure each comment has the necessary properties
        if (comments && comments.length > 0) {
            const validatedComments = comments.map(comment => ({
                ...comment,
                name: comment.name || 'Client',
                content: comment.content || 'Excellent service!',
                rating: comment.rating || 5,
                program: comment.program || 'Membre Premium'
            }));
            setComments(validatedComments);
        }
    }, [initialComments]);
    
    // Add state for current testimonial index
    const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
    
    // Function to navigate to next testimonial
    const nextTestimonial = () => {
        if (comments && comments.length > 0) {
            setCurrentTestimonialIndex((prev) => 
                prev === comments.length - 1 ? 0 : prev + 1
            );
        }
    };
    
    // Function to navigate to previous testimonial
    const prevTestimonial = () => {
        if (comments && comments.length > 0) {
            setCurrentTestimonialIndex((prev) => 
                prev === 0 ? comments.length - 1 : prev - 1
            );
        }
    };
    
    // Ref for the comments scrolling container
    const commentsContainerRef = useRef(null);
    
    // Function to scroll comments left
    const scrollCommentsLeft = () => {
        if (commentsContainerRef.current) {
            const currentScroll = commentsContainerRef.current.scrollLeft;
            commentsContainerRef.current.scrollTo({
                left: currentScroll - 320,
                behavior: 'smooth'
            });
        }
    };
    
    // Function to scroll comments right
    const scrollCommentsRight = () => {
        if (commentsContainerRef.current) {
            const currentScroll = commentsContainerRef.current.scrollLeft;
            commentsContainerRef.current.scrollTo({
                left: currentScroll + 320,
                behavior: 'smooth'
            });
        }
    };
    
    // Function to add a new comment
    const addComment = (newComment) => {
        // Add user information from auth if available
        const commentWithUser = {
            ...newComment,
            name: auth?.user?.name || newComment.name || 'Client',
            email: auth?.user?.email || newComment.email || '',
            date: new Date().toISOString(),
        };
        
        setComments(prev => [commentWithUser, ...prev]);
        
        // Reset current index to show the new comment
        setCurrentTestimonialIndex(0);
    };

    return (
        <>
            <Head title="POWER GYM - Transform Your Body, Transform Your Life">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Poppins:wght@300;400;500&family=Raleway:wght@300;400;500;600&display=swap" rel="stylesheet" />
            </Head>
            
            {/* Main container with dark mode transition */}
            <div className={`transition-colors duration-700 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                {/* Navigation Bar */}
                <Navbar activeSection={activeSection} />

                {/* Hero Section */}
                <section ref={heroRef} className="relative h-[calc(100vh-76px)] mt-[76px]">
                    {/* Background image with overlay */}
                    <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-orange-900/50 z-10"></div>
                        <img 
                            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80"
                            alt="Fond Salle de Sport"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    
                    {/* Hero content */}
                    <div className="relative h-full z-20">
                        <div className="container mx-auto px-6 h-full">
                            <div className="flex flex-col justify-center items-center h-full">
                                <div className="max-w-4xl text-center">
                                    <motion.div
                                        initial="hidden"
                                        animate="visible"
                                        variants={{
                                            hidden: { opacity: 0 },
                                            visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
                                        }}
                                        className="mb-8"
                                    >
                                        <h1 className="text-[2.5rem] md:text-[3.5rem] font-bold leading-tight">
                                            <motion.div
                                                variants={{
                                                    hidden: { y: 100, opacity: 0 },
                                                    visible: { 
                                                        y: 0, 
                                                        opacity: 1,
                                                        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
                                                    }
                                                }}
                                                className="flex flex-wrap items-center justify-center mb-4"
                                            >
                                                <span className="text-white">TRANSFORMEZ VOTRE</span>
                                                <span className="bg-gradient-to-r from-orange-400 to-red-500 text-transparent bg-clip-text ml-3">CORPS</span>
                                                <span className="text-white">,</span>
                                            </motion.div>
                                            
                                            <motion.div
                                                variants={{
                                                    hidden: { y: 100, opacity: 0 },
                                                    visible: { 
                                                        y: 0, 
                                                        opacity: 1,
                                                        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
                                                    }
                                                }}
                                                className="flex flex-wrap items-center justify-center"
                                            >
                                                <span className="text-white">TRANSFORMEZ VOTRE</span>
                                                <span className="bg-gradient-to-r from-orange-400 to-red-500 text-transparent bg-clip-text ml-3">VIE</span>
                                            </motion.div>
                                        </h1>
                                        
                                        <motion.p 
                                            variants={{
                                                hidden: { y: 100, opacity: 0 },
                                                visible: { 
                                                    y: 0, 
                                                    opacity: 1,
                                                    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
                                                }
                                            }}
                                            className="text-xl text-gray-200 mt-12 mb-10"
                                        >
                                            Rejoignez l'élite du fitness à Paris et atteignez vos objectifs
                                        </motion.p>
                                        
                                        <motion.div
                                            variants={{
                                                hidden: { y: 100, opacity: 0 },
                                                visible: { 
                                                    y: 0, 
                                                    opacity: 1,
                                                    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
                                                }
                                            }}
                                        >
                                            <Link
                                                href={route('register')}
                                                className="inline-block px-10 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white text-lg font-medium rounded-lg hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-orange-500/30"
                                            >
                                                Découvrir nos offres
                                            </Link>
                                        </motion.div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Programs Section - With enhanced animations and custom fonts */}
<section ref={programsRef} className="py-24 relative overflow-hidden bg-gradient-to-b from-white to-gray-100">
    {/* Background with color changing elements */}
    <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-white to-transparent"></div>
    <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-gray-100 to-transparent"></div>
    
    {/* Animated color-changing diagonal stripes */}
    <motion.div 
        className="absolute -right-20 top-0 w-48 h-96 rotate-12"
        initial={{ y: -400 }}
        animate={{ y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{
            background: "linear-gradient(45deg, rgba(249, 115, 22, 0.2), rgba(239, 68, 68, 0.05))",
            filter: "blur(0.5px)",
        }}
        whileInView={{
            background: ["linear-gradient(45deg, rgba(249, 115, 22, 0.2), rgba(239, 68, 68, 0.05))", 
                         "linear-gradient(45deg, rgba(239, 68, 68, 0.2), rgba(249, 115, 22, 0.05))"],
        }}
        viewport={{ once: false }}
    ></motion.div>
    <motion.div 
        className="absolute -left-20 bottom-0 w-48 h-96 -rotate-12"
        initial={{ y: 400 }}
        animate={{ y: 0 }}
        transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        style={{
            background: "linear-gradient(45deg, rgba(239, 68, 68, 0.1), rgba(249, 115, 22, 0.05))",
            filter: "blur(0.5px)",
        }}
        whileInView={{
            background: ["linear-gradient(45deg, rgba(239, 68, 68, 0.1), rgba(249, 115, 22, 0.05))", 
                         "linear-gradient(45deg, rgba(249, 115, 22, 0.1), rgba(239, 68, 68, 0.05))"],
        }}
        viewport={{ once: false }}
    ></motion.div>
    
    {/* Enhanced moving gradient background with color transitions */}
    <motion.div
        className="absolute inset-0 opacity-70"
        animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "linear"
        }}
        style={{
            backgroundSize: '200% 200%',
            background: "radial-gradient(circle at 25% 25%, rgba(249, 115, 22, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(239, 68, 68, 0.05) 0%, transparent 50%)",
        }}
    ></motion.div>
    
    {/* Animated energy lines and particles for vitality */}
    <ProgramParticles />
                    
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="text-center mb-16">
                            <div className="relative mb-6 inline-block">
                                <span className="absolute -left-6 -top-6 w-12 h-12 border-t-2 border-l-2 border-orange-500"></span>
                                <span className="absolute -right-6 -bottom-6 w-12 h-12 border-b-2 border-r-2 border-orange-500"></span>
                                <SplitTextTitle text="NOS PROGRAMMES" />
                            </div>
                            <p className="text-gray-600 max-w-2xl mx-auto font-light tracking-wide" 
                               style={{ fontFamily: "'Raleway', sans-serif", letterSpacing: "0.5px" }}>
                                Découvrez notre gamme complète de programmes de fitness conçus pour vous aider à atteindre vos objectifs.
                            </p>
                        </div>
                        
                        <div className="space-y-32">
                            {programs.map((program, index) => (
                                <div
                                    key={index}
                                    className="transform transition-all duration-500 hover:scale-102"
                                >
                                    <div className="relative z-0 mb-8">
                                        {index % 2 === 0 && (
                                            <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full blur-3xl -z-10 bg-orange-500/10"></div>
                                        )}
                                        
                                        {index % 2 === 1 && (
                                            <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl -z-10 bg-red-500/10"></div>
                                        )}
                                        
                                        <FeatureCard
                                            title={program.title}
                                            description={program.description}
                                            image={program.image}
                                            reverse={program.reverse}
                                            animate={false}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Gallery Section - Kept original design as requested */}
                <section ref={galleryRef} className="py-32 relative overflow-hidden bg-black">
                    {/* Background gradient */}
                    <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-black to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black to-transparent"></div>
                    
                    {/* Accent shape removed */}
                    
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="text-center mb-16">
                            <SplitTextTitle text="NOTRE GALERIE" color="text-orange-500" />
                            <p className="max-w-2xl mx-auto text-gray-300">
                                Explorez nos installations de classe mondiale et notre communauté à travers ces superbes moments visuels.
                            </p>
                        </div>
                        
                        {/* Circular Image Gallery */}
                        <CircularGallery />
                    </div>
                </section>

                {/* Membership Plans Section - With vibrant gradient theme */}
                <section ref={membershipRef} className="py-24 relative overflow-hidden bg-gradient-to-b from-orange-100 via-orange-50 to-red-50">
                    {/* Background elements */}
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-orange-400 rounded-full opacity-30 blur-3xl animate-pulse-slow"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-400 rounded-full opacity-30 blur-3xl animate-pulse-slow"></div>
                    
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="text-center mb-16">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="mb-6"
                            >
                                <h2 className="text-4xl md:text-5xl font-bold mb-2">
                                    <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">NOS FORMULES D'ABONNEMENT</span>
                                </h2>
                                <div className="h-1 w-24 bg-gradient-to-r from-orange-400 to-red-500 mx-auto"></div>
                            </motion.div>
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                viewport={{ once: true }}
                                className="text-gray-700 max-w-2xl mx-auto"
                            >
                                Choisissez la formule d'abonnement qui correspond à votre parcours et à vos objectifs fitness.
                            </motion.p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {membershipPlans.map((plan, index) => {
                                const isPopular = plan.popular;
                                
                                return (
                                <motion.div 
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.1 * index }}
                                    viewport={{ once: true }}
                                    key={index}
                                        className={`relative rounded-2xl overflow-hidden transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl flex flex-col ${
                                            isPopular ? 'shadow-xl border-2 border-orange-500 scale-105 z-10 bg-gradient-to-b from-gray-900 to-black' : 'shadow-lg bg-gradient-to-b from-gray-800 to-gray-900'
                                        }`}
                                    >
                                        {isPopular && (
                                            <div className="absolute top-0 right-0 left-0 flex justify-center">
                                                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold py-1 px-4 rounded-b-lg">
                                                    LE PLUS POPULAIRE
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div className={`p-8 ${isPopular ? 'pt-10' : ''} flex-grow`}>
                                            <h3 className="text-2xl font-bold text-white mb-2">{plan.title}</h3>
                                            
                                            <div className="flex items-baseline mb-6">
                                                <span className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">{plan.price}€</span>
                                                <span className="text-gray-400 ml-2">/{plan.period}</span>
                                            </div>
                                            
                                            <ul className="space-y-3 mb-8 text-gray-300">
                                                {plan.features.map((feature, idx) => (
                                                    <li key={idx} className="flex items-start">
                                                        <svg className="w-5 h-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                                        </svg>
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        
                                        <div className="px-8 pb-8">
                                            <Link
                                                href={route('subscriptions.plans')}
                                                className={`block w-full py-3 px-4 rounded-full text-center font-bold transition-all duration-300 ${
                                                    isPopular 
                                                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-orange-600/30' 
                                                        : 'bg-transparent border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white'
                                                }`}
                                            >
                                                {plan.buttonText}
                                            </Link>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                        
                        {/* Membership note */}
                    
                    </div>
                </section>

                {/* IMC Calculator Section */}
                <section className="py-24 bg-black relative overflow-hidden">
                    {/* Background elements */}
                    <div className="absolute -top-40 -left-40 w-80 h-80 bg-orange-600 rounded-full opacity-10 blur-3xl"></div>
                    <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-orange-600 rounded-full opacity-10 blur-3xl"></div>
                    
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="inline-block text-3xl md:text-5xl font-bold text-white mb-4 relative">
                                CALCULEZ VOTRE IMC
                                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-orange-400 to-red-500"></div>
                            </h2>
                            <p className="text-gray-400 max-w-2xl mx-auto">
                                Suivez vos progrès fitness en calculant votre Indice de Masse Corporelle (IMC). Obtenez des conseils et recommandations personnalisés.
                            </p>
                        </div>

                        <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold text-white">Pourquoi calculer votre IMC ?</h3>
                                        <p className="text-gray-400">L'IMC est un indicateur important de votre état de santé et peut vous aider à :</p>
                                    </div>
                                    
                                    <ul className="space-y-4">
                                        <li className="flex items-start space-x-3">
                                            <svg className="w-6 h-6 text-orange-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                            <span className="text-gray-300">Évaluer votre catégorie de poids</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <svg className="w-6 h-6 text-orange-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                            <span className="text-gray-300">Suivre vos progrès fitness</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <svg className="w-6 h-6 text-orange-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                            <span className="text-gray-300">Obtenir des conseils santé personnalisés</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="text-center">
                                    <div className="mb-8">
                                        <img 
                                            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80"
                                            alt="Calculateur IMC"
                                            className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-orange-500 shadow-xl"
                                        />
                                    </div>
                                    <Link
                                        href={route('bmi.calculator')}
                                        className="inline-block px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-full hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-orange-600/30"
                                    >
                                        Calculez votre IMC maintenant
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* AVIS Section - Redesigned to match reference image with different colors */}
                <section className="py-16 bg-gradient-to-b from-white to-orange-50">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-10">
                            <div className="inline-block bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-sm font-medium mb-3">
                                Témoignages de Clients
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                                Ce Que Disent Nos Clients
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Ne vous contentez pas de notre parole. Voici ce que les personnes qui ont 
                                vécu l'expérience POWERGYM ont à dire sur leur parcours avec nous.
                            </p>
                        </div>

                        <div className="relative max-w-3xl mx-auto">
                            {comments && comments.length > 0 ? (
                                <div className="relative">
                                    {comments.map((comment, index) => (
                                        <div 
                                            key={index}
                                            className={`transition-opacity duration-500 ${
                                                index === currentTestimonialIndex ? 'block opacity-100' : 'hidden opacity-0'
                                            }`}
                                        >
                                            <div className="text-center bg-gradient-to-br from-orange-50 to-white p-8 rounded-xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.2)] transition-all duration-300 border border-orange-100">
                                                <div className="mb-6 flex justify-center">
                                                    <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                                                        {comment?.name ? comment.name.charAt(0) : '?'}{comment?.name?.split(' ')?.[1]?.charAt(0) || ''}
                                                    </div>
                                                </div>
                                                
                                                <div className="flex justify-center mb-6">
                                                    {[...Array(5)].map((_, i) => (
                                                        <svg 
                                                            key={i} 
                                                            className={`w-5 h-5 mx-0.5 ${i < (comment?.rating || 5) ? 'text-yellow-400' : 'text-gray-300'}`}
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                                        </svg>
                                                    ))}
                                                </div>
                                                
                                                <blockquote className="text-xl md:text-2xl font-medium text-gray-800 mb-8">
                                                    "{comment?.content || 'Excellent service!'}"
                                                </blockquote>
                                                
                                                <div className="mb-2">
                                                    <h3 className="text-lg font-bold text-gray-800">{comment?.name || 'Client'}</h3>
                                                </div>
                                                <p className="text-orange-600">
                                                    {comment?.program || 'Membre Premium'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center bg-gradient-to-br from-orange-50 to-white p-8 rounded-xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.2)] transition-all duration-300 border border-orange-100">
                                    <div className="mb-6 flex justify-center">
                                        <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                                            ML
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-center mb-6">
                                        {[...Array(5)].map((_, i) => (
                                            <svg 
                                                key={i} 
                                                className="w-5 h-5 mx-0.5 text-yellow-400"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                            </svg>
                                        ))}
                                    </div>
                                    
                                    <blockquote className="text-xl md:text-2xl font-medium text-gray-800 mb-8">
                                        "J'ai essayé de nombreuses salles de sport, mais POWERGYM est de loin la meilleure. Les équipements sont modernes, les coachs attentifs et mon corps n'a jamais été aussi en forme!"
                                    </blockquote>
                                    
                                    <div className="mb-2">
                                        <h3 className="text-lg font-bold text-gray-800">Marie Laurent</h3>
                                    </div>
                                    <p className="text-orange-600">
                                        Membre Premium
                                    </p>
                                </div>
                            )}

                            {/* Navigation Arrows */}
                            <button
                                onClick={prevTestimonial}
                                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-12 md:-translate-x-16 bg-white w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-orange-600 focus:outline-none"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                </svg>
                            </button>
                            
                            <button
                                onClick={nextTestimonial}
                                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-12 md:translate-x-16 bg-white w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-orange-600 focus:outline-none"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </button>
                        </div>
                        
                        {/* Pagination dots */}
                        <div className="flex justify-center mt-8">
                            {(comments && comments.length > 0) ? (
                                comments.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentTestimonialIndex(index)}
                                        className={`w-2.5 h-2.5 mx-1 rounded-full transition-all ${
                                            index === currentTestimonialIndex 
                                                ? 'bg-orange-500 w-8' 
                                                : 'bg-gray-300 hover:bg-gray-400'
                                        }`}
                                        aria-label={`Voir témoignage ${index + 1}`}
                                    />
                                ))
                            ) : (
                                <>
                                    <button className="w-8 h-2.5 mx-1 rounded-full bg-orange-500" aria-label="Voir témoignage 1" />
                                    <button className="w-2.5 h-2.5 mx-1 rounded-full bg-gray-300" aria-label="Voir témoignage 2" />
                                    <button className="w-2.5 h-2.5 mx-1 rounded-full bg-gray-300" aria-label="Voir témoignage 3" />
                                    <button className="w-2.5 h-2.5 mx-1 rounded-full bg-gray-300" aria-label="Voir témoignage 4" />
                                    <button className="w-2.5 h-2.5 mx-1 rounded-full bg-gray-300" aria-label="Voir témoignage 5" />
                                </>
                            )}
                        </div>
                        
                        {/* Add testimonial button */}
                        <div className="text-center mt-12">
                            <button 
                                onClick={() => {
                                    // Check if user is authenticated
                                    if (auth?.user) {
                                        // User is logged in, show comment modal
                                        setCommentModalOpen(true);
                                    } else {
                                        // User is not logged in, redirect to login page
                                        window.location.href = route('login');
                                    }
                                }}
                                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-md font-medium"
                            >
                                Partagez Votre Expérience
                            </button>
                        </div>
                        
                        {/* Comment Modal */}
                        <AnimatePresence>
                            {commentModalOpen && (
                                <CommentModal 
                                    isOpen={commentModalOpen} 
                                    onClose={() => setCommentModalOpen(false)} 
                                    onSubmit={addComment}
                                />
                            )}
                        </AnimatePresence>
                    </div>
                </section>
                
                {/* Promo Banner - Reduced height */}
                <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white relative overflow-hidden py-6">
                    <div className="absolute inset-0">
                        {/* Abstract pattern overlay */}
                        <svg className="absolute h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 0L100 0L100 100Z" fill="rgba(255,255,255,0.1)" />
                            <path d="M100 100L0 100L0 0Z" fill="rgba(0,0,0,0.1)" />
                        </svg>
                    </div>
                    
                    <div className="container mx-auto px-6 py-2 relative z-10">
                        <div className="flex flex-col md:flex-row items-center justify-between">
                            <div className="mb-4 md:mb-0 text-center md:text-left">
                                <h3 className="text-lg md:text-xl font-bold mb-1">Prêt à commencer votre parcours fitness ?</h3>
                                <p className="text-white text-opacity-90 text-sm">Inscrivez-vous aujourd'hui et obtenez 20% de réduction sur votre premier mois !</p>
                            </div>
                            
                            <Link href={route('register')} className="px-5 py-2 bg-white text-orange-600 font-bold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm">
                                COMMENCER MAINTENANT
                            </Link>
                        </div>
                    </div>
                </section>
                
                {/* Footer - Black theme with reduced height */}
                <footer className="bg-black text-white pt-10 pb-6">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                            <div>
                                <div className="text-2xl font-extrabold mb-4">
                                    <span className="text-orange-500">POWER</span>GYM
                                </div>
                                <p className="text-gray-400 mb-4 text-sm">
                                    Transformer des vies par le fitness depuis 2010. Notre mission est de fournir un environnement propice pour que chacun puisse atteindre ses objectifs.
                                </p>
                                <div className="flex space-x-4">
                                    <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                                        </svg>
                                    </a>
                                    <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                                        </svg>
                                    </a>
                                    <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-lg font-bold mb-3">Liens Rapides</h3>
                                <ul className="space-y-2 text-sm">
                                    <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300">Accueil</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300">À Propos</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300">Cours</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300">Entraineurs</a></li>
                                </ul>
                            </div> 
                            <div>
                                <h3 className="text-lg font-bold mb-3">Horaires</h3>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex justify-between">
                                        <span className="text-gray-400">Lundi - Vendredi</span>
                                        <span className="text-white">5:00 - 23:00</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="text-gray-400">Samedi</span>
                                        <span className="text-white">6:00 - 22:00</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="text-gray-400">Dimanche</span>
                                        <span className="text-white">7:00 - 21:00</span>
                                    </li>
                                </ul>
                            </div>
                            
                            <div>
                                <h3 className="text-lg font-bold mb-3">Contactez-Nous</h3>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-start">
                                        <svg className="w-4 h-4 text-orange-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                        </svg>
                                        <span className="text-gray-400">123 Rue du Fitness, Paris, 75001</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="w-4 h-4 text-orange-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                        </svg>
                                        <span className="text-gray-400">01 23 45 67 89</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="border-t border-gray-800 pt-4 mt-4 text-center text-sm text-gray-500">
                            © 2023 POWERGYM | Tous droits réservés
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}