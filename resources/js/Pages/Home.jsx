import React, { useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import GalleryCarousel from './GalleryCarousel'; // Assuming this component exists

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

// FeatureCard component for program sections
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
            <div 
                className={`w-full md:w-1/2 transform transition-all duration-1000 ease-out ${isVisible ? 'translate-x-0 opacity-100' : (reverse ? 'translate-x-40' : '-translate-x-40') + ' opacity-0'}`}
            >
                <img 
                    src={image} 
                    alt={title} 
                    className="w-full h-auto rounded-lg shadow-xl object-cover"
                    style={{ maxHeight: '450px' }}
                />
            </div>
            <div 
                className={`w-full md:w-1/2 md:px-12 py-8 transform transition-all duration-1000 ease-out delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
            >
                <h3 className="text-2xl md:text-3xl font-bold mb-6">{title}</h3>
                <p className="text-gray-400 mb-8">{description}</p>
                <button className="px-8 py-3 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    Learn More
                </button>
            </div>
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

// Main component
export default function Home() {
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
    
    // Fitness programs data
    const programs = [
        {
            title: "STRENGTH & CONDITIONING",
            description: "Build muscle, increase strength, and enhance overall fitness with our comprehensive strength and conditioning program. Our expert trainers will guide you through a personalized regimen designed to meet your specific goals, whether you're a beginner or an advanced athlete.",
            image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=750&q=80"
        },
        {
            title: "CARDIO & HIIT",
            description: "Maximize fat loss and cardiovascular health through our high-intensity interval training and varied cardio programs. Experience dynamic workouts that keep your heart pumping and calories burning long after your session ends.",
            image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=750&q=80",
            reverse: true
        },
        {
            title: "YOGA & MOBILITY",
            description: "Enhance flexibility, balance, and mental wellness with our yoga and mobility programs. Perfect for recovery days or as a standalone practice, these sessions promote longevity in your fitness journey while reducing injury risk.",
            image: "https://images.unsplash.com/photo-1599447292461-846e7d193883?ixlib=rb-4.0.3&auto=format&fit=crop&w=750&q=80"
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
            title: "BASIC",
            price: "49",
            period: "monthly",
            features: [
                "Access during off-peak hours",
                "Basic fitness assessment",
                "Standard locker access",
                "Online workout resources"
            ],
            popular: false,
            buttonText: "Get Started"
        },
        {
            title: "PREMIUM",
            price: "89",
            period: "monthly",
            features: [
                "24/7 unlimited access",
                "All group classes included",
                "Monthly fitness assessment",
                "One personal training session/month",
                "Premium locker with amenities"
            ],
            popular: true,
            buttonText: "Most Popular"
        },
        {
            title: "ELITE",
            price: "149",
            period: "monthly",
            features: [
                "All Premium features",
                "Weekly personal training",
                "Customized nutrition plan",
                "Priority class booking",
                "Exclusive member events",
                "Partner gym access"
            ],
            popular: false,
            buttonText: "Ultimate Experience"
        }
    ];
    
    // Handle navigation visibility on scroll
    useEffect(() => {
        const handleScroll = () => {
            setNavVisible(window.scrollY > 100);
            
            // Determine active section for navigation
            const scrollPosition = window.scrollY + 200;
            
            if (heroRef.current && scrollPosition < heroRef.current.offsetHeight) {
                setActiveSection('hero');
            } else if (galleryRef.current && scrollPosition < galleryRef.current.offsetTop + galleryRef.current.offsetHeight) {
                setActiveSection('gallery');
            } else if (programsRef.current && scrollPosition < programsRef.current.offsetTop + programsRef.current.offsetHeight) {
                setActiveSection('programs');
            } else if (trainersRef.current && scrollPosition < trainersRef.current.offsetTop + trainersRef.current.offsetHeight) {
                setActiveSection('trainers');
            } else if (testimonialsRef.current && scrollPosition < testimonialsRef.current.offsetTop + testimonialsRef.current.offsetHeight) {
                setActiveSection('testimonials');
            } else if (membershipRef.current) {
                setActiveSection('membership');
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

    return (
        <>
            <Head title="POWER GYM - Transform Your Body, Transform Your Life" />
            
            {/* Navigation Bar */}
            <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${navVisible ? 'bg-black bg-opacity-90 backdrop-blur-md py-3 shadow-xl' : 'bg-transparent py-6'}`}>
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <div className="text-2xl font-extrabold text-white">
                            <span className="text-red-500">POWER</span>GYM
                        </div>
                        
                        {/* Desktop Navigation */}
                        <div className="hidden md:flex space-x-8">
                            <button 
                                onClick={() => scrollToSection(heroRef, 'hero')}
                                className={`text-sm font-medium transition-all duration-300 ${activeSection === 'hero' ? 'text-red-500' : 'text-white hover:text-red-300'}`}
                            >
                                HOME
                            </button>
                            <button 
                                onClick={() => scrollToSection(galleryRef, 'gallery')}
                                className={`text-sm font-medium transition-all duration-300 ${activeSection === 'gallery' ? 'text-red-500' : 'text-white hover:text-red-300'}`}
                            >
                                GALLERY
                            </button>
                            <button 
                                onClick={() => scrollToSection(programsRef, 'programs')}
                                className={`text-sm font-medium transition-all duration-300 ${activeSection === 'programs' ? 'text-red-500' : 'text-white hover:text-red-300'}`}
                            >
                                PROGRAMS
                            </button>
                            <button 
                                onClick={() => scrollToSection(trainersRef, 'trainers')}
                                className={`text-sm font-medium transition-all duration-300 ${activeSection === 'trainers' ? 'text-red-500' : 'text-white hover:text-red-300'}`}
                            >
                                TRAINERS
                            </button>
                            <button 
                                onClick={() => scrollToSection(testimonialsRef, 'testimonials')}
                                className={`text-sm font-medium transition-all duration-300 ${activeSection === 'testimonials' ? 'text-red-500' : 'text-white hover:text-red-300'}`}
                            >
                                TESTIMONIALS
                            </button>
                            <button 
                                onClick={() => scrollToSection(membershipRef, 'membership')}
                                className={`text-sm font-medium transition-all duration-300 ${activeSection === 'membership' ? 'text-red-500' : 'text-white hover:text-red-300'}`}
                            >
                                MEMBERSHIP
                            </button>
                        </div>
                        
                        {/* Authentication Links */}
                        <div className="hidden md:flex items-center space-x-4">
                            <Link 
                                href={route('login')} 
                                className="px-4 py-2 text-white hover:text-red-300 transition-all duration-300"
                            >
                                Login
                            </Link>
                            <Link 
                                href={route('register')} 
                                className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-300 hover:scale-105 transform"
                            >
                                Join Now
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
                        <div className="flex flex-col space-y-4 pt-2 pb-4">
                            <button 
                                onClick={() => scrollToSection(heroRef, 'hero')}
                                className={`text-sm font-medium py-2 transition-all duration-300 ${activeSection === 'hero' ? 'text-red-500' : 'text-white'}`}
                            >
                                HOME
                            </button>
                            <button 
                                onClick={() => scrollToSection(galleryRef, 'gallery')}
                                className={`text-sm font-medium py-2 transition-all duration-300 ${activeSection === 'gallery' ? 'text-red-500' : 'text-white'}`}
                            >
                                GALLERY
                            </button>
                            <button 
                                onClick={() => scrollToSection(programsRef, 'programs')}
                                className={`text-sm font-medium py-2 transition-all duration-300 ${activeSection === 'programs' ? 'text-red-500' : 'text-white'}`}
                            >
                                PROGRAMS
                            </button>
                            <button 
                                onClick={() => scrollToSection(trainersRef, 'trainers')}
                                className={`text-sm font-medium py-2 transition-all duration-300 ${activeSection === 'trainers' ? 'text-red-500' : 'text-white'}`}
                            >
                                TRAINERS
                            </button>
                            <button 
                                onClick={() => scrollToSection(testimonialsRef, 'testimonials')}
                                className={`text-sm font-medium py-2 transition-all duration-300 ${activeSection === 'testimonials' ? 'text-red-500' : 'text-white'}`}
                            >
                                TESTIMONIALS
                            </button>
                            <button 
                                onClick={() => scrollToSection(membershipRef, 'membership')}
                                className={`text-sm font-medium py-2 transition-all duration-300 ${activeSection === 'membership' ? 'text-red-500' : 'text-white'}`}
                            >
                                MEMBERSHIP
                            </button>
                            <div className="pt-2 flex flex-col space-y-3">
                                <Link 
                                    href={route('login')} 
                                    className="py-2 text-white hover:text-red-300 transition-all duration-300"
                                >
                                    Login
                                </Link>
                                <Link 
                                    href={route('register')} 
                                    className="py-2 bg-red-600 text-white text-center rounded-full hover:bg-red-700 transition-all duration-300"
                                >
                                    Join Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section ref={heroRef} className="relative min-h-screen flex items-center">
                {/* Background video or image */}
                <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ 
                    backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')",
                    backgroundPosition: "center 25%"
                }}></div>
                
                {/* Particle overlay */}
                <ParticleBackground />
                
                {/* Hero content */}
                <div className="container mx-auto px-6 pt-32 pb-20 relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-white mb-8">
                                <AnimatedTitle text="TRANSFORM YOUR" delay={0.5} />
                                <br />
                                <span className="text-red-600">
                                    <AnimatedTitle text="BODY & MIND" delay={1.2} />
                                </span>
                            </h1>
                            
                            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto opacity-0 animate-fadeIn" style={{ animationDelay: '1.8s', animationDuration: '1s', animationFillMode: 'forwards' }}>
                                Experience fitness like never before with our state-of-the-art facilities and expert trainers dedicated to helping you achieve your goals.
                            </p>
                            
                            <div className="flex flex-wrap justify-center gap-4 opacity-0 animate-fadeIn" style={{ animationDelay: '2.2s', animationDuration: '1s', animationFillMode: 'forwards' }}>
                                <button onClick={() => scrollToSection(membershipRef, 'membership')} className="px-8 py-4 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-red-600/30">
                                    JOIN TODAY
                                </button>
                                <button onClick={() => scrollToSection(programsRef, 'programs')} className="px-8 py-4 bg-transparent text-white border-2 border-white font-bold rounded-full hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105">
                                    EXPLORE PROGRAMS
                                </button>
                            </div>
                        </div>
                        
                        {/* Features section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 opacity-0 animate-fadeIn" style={{ animationDelay: '2.6s', animationDuration: '1s', animationFillMode: 'forwards' }}>
                            <FitnessIcon 
                                icon={<svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>}
                                label="Expert Trainers"
                                description="Work with certified professionals who will guide and motivate you every step of the way."
                            />
                            <FitnessIcon 
                                icon={<svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"></path>
                                </svg>}
                                label="Premium Equipment"
                                description="Train with top-of-the-line fitness equipment designed for optimal performance and results."
                            />
                            <FitnessIcon 
                                icon={<svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                                </svg>}
                                label="Supportive Community"
                                description="Join a community of like-minded individuals who will support and inspire your fitness journey."
                            />
                        </div>
                    </div>
                </div>
                
                {/* Scroll indicator */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center opacity-0 animate-fadeIn" style={{ animationDelay: '3s', animationDuration: '1s', animationFillMode: 'forwards' }}>
                    <span className="text-white text-sm mb-2">Scroll to explore</span>
                    <svg className="w-6 h-6 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                    </svg>
                </div>
            </section>

            {/* Gallery Section */}
            <section ref={galleryRef} className="py-24 bg-black relative overflow-hidden">
                {/* Background gradient */}
                <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-black to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black to-transparent"></div>
                
                {/* Red accent shape */}
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-64 h-96 bg-red-600 rounded-r-full opacity-10 blur-3xl"></div>
                
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="inline-block text-3xl md:text-5xl font-bold text-white mb-4 relative">
                            OUR GALLERY
                            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-red-600"></div>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Explore our world-class facility and community through these stunning visual highlights.
                        </p>
                    </div>
                    
                    {/* Circular Image Gallery */}
                    <CircularGallery />
                </div>
            </section>

            {/* Programs Section */}
            <section ref={programsRef} className="py-24 bg-black relative overflow-hidden">
                {/* Background gradient */}
                <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-black to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black to-transparent"></div>
                
                {/* Red accent shape */}
                <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-64 h-96 bg-red-600 rounded-l-full opacity-10 blur-3xl"></div>
                
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="inline-block text-3xl md:text-5xl font-bold text-white mb-4 relative">
                            OUR PROGRAMS
                            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-red-600"></div>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Discover our comprehensive range of fitness programs designed to help you reach your goals, whether you're just starting out or looking to take your fitness to the next level.
                        </p>
                    </div>
                    
                    <div className="space-y-32">
                        {programs.map((program, index) => (
                            <FeatureCard
                                key={index}
                                title={program.title}
                                description={program.description}
                                image={program.image}
                                reverse={program.reverse}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Membership Plans Section */}
            <section ref={membershipRef} className="py-24 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
                {/* Background elements */}
                <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-black to-transparent"></div>
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-red-600 rounded-full opacity-10 blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-600 rounded-full opacity-10 blur-3xl"></div>
                
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="inline-block text-3xl md:text-5xl font-bold text-white mb-4 relative">
                            MEMBERSHIP PLANS
                            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-red-600"></div>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Choose the membership plan that fits your fitness journey and goals. Join our community today and start your transformation.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {membershipPlans.map((plan, index) => {
                            const isPopular = plan.popular;
                            
                            return (
                            <div 
                                key={index}
                                    className={`relative rounded-2xl overflow-hidden transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl ${
                                        isPopular ? 'shadow-xl border-2 border-red-600 scale-105 z-10 bg-gradient-to-b from-gray-900 to-black' : 'shadow-lg bg-gray-900'
                                    }`}
                                >
                                    {isPopular && (
                                        <div className="absolute top-0 right-0 left-0 flex justify-center">
                                            <div className="bg-red-600 text-white text-xs font-bold py-1 px-4 rounded-b-lg">
                                                MOST POPULAR
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className={`p-8 ${isPopular ? 'pt-10' : ''}`}>
                                        <h3 className="text-2xl font-bold text-white mb-2">{plan.title}</h3>
                                        
                                        <div className="flex items-baseline mb-6">
                                            <span className="text-4xl font-bold text-red-600">${plan.price}</span>
                                            <span className="text-gray-400 ml-2">/{plan.period}</span>
                            </div>
                                        
                                        <ul className="space-y-3 mb-8 text-gray-300">
                                            {plan.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-start">
                                                    <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                                    </svg>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                        
                                        <button className={`w-full py-3 px-4 rounded-full text-center font-bold transition-all duration-300 ${
                                            isPopular 
                                                ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-red-600/30' 
                                                : 'bg-transparent border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white'
                                        }`}>
                                            {plan.buttonText}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    {/* Membership note */}
                    <div className="text-center mt-12 text-gray-400 text-sm max-w-2xl mx-auto">
                        <p>All memberships include access to our mobile app, online workout library, and nutrition guides. No hidden fees or long-term contracts required. Cancel anytime.</p>
                    </div>
                </div>
            </section>

            {/* Promo Banner */}
            <section className="bg-red-600 text-white relative overflow-hidden">
                <div className="absolute inset-0">
                    {/* Abstract pattern overlay */}
                    <svg className="absolute h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0L100 0L100 100Z" fill="rgba(255,255,255,0.1)" />
                        <path d="M100 100L0 100L0 0Z" fill="rgba(0,0,0,0.1)" />
                    </svg>
                </div>
                
                <div className="container mx-auto px-6 py-12 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="mb-8 md:mb-0 text-center md:text-left">
                            <h3 className="text-2xl md:text-3xl font-bold mb-2">Ready to start your fitness journey?</h3>
                            <p className="text-white text-opacity-90">Join today and get 20% off your first month!</p>
                        </div>
                        
                        <Link href={route('register')} className="px-8 py-3 bg-white text-red-600 font-bold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl">
                            START NOW
                        </Link>
                    </div>
                </div>
            </section>
            
            {/* Footer */}
            <footer className="bg-black text-white pt-16 pb-8">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div>
                            <div className="text-2xl font-extrabold mb-6">
                                <span className="text-red-500">POWER</span>GYM
                            </div>
                            <p className="text-gray-400 mb-6">
                                Transforming lives through fitness since 2010. Our mission is to provide a supportive environment for everyone to achieve their health and fitness goals.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Home</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">About Us</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Classes</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Trainers</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Membership</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Contact</a></li>
                        </ul>
                    </div>
                        
                        <div>
                            <h3 className="text-lg font-bold mb-6">Gym Hours</h3>
                            <ul className="space-y-3">
                                <li className="flex justify-between">
                                    <span className="text-gray-400">Monday - Friday</span>
                                    <span className="text-white">5:00 AM - 11:00 PM</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-gray-400">Saturday</span>
                                    <span className="text-white">6:00 AM - 10:00 PM</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-gray-400">Sunday</span>
                                    <span className="text-white">7:00 AM - 9:00 PM</span>
                                </li>
                        </ul>
                    </div>
                        
                        <div>
                            <h3 className="text-lg font-bold mb-6">Contact Us</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    </svg>
                                    <span className="text-gray-400">123 Fitness Street, Gym City, 10001</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                    </svg>
                                    <span className="text-gray-400">(123) 456-7890</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                    </svg>
                                    <span className="text-gray-400">info@powergym.com</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
                        <p>&copy; {new Date().getFullYear()} POWER GYM. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </>
    );
}