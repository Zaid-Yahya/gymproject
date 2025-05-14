import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    // Refs for the animated background
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const gradientRef = useRef(null);
    const angleRef = useRef(0);
    const ripplesRef = useRef([]);
    const cursorRef = useRef({ x: 0, y: 0, radius: 20 });

    // Animation setup
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        contextRef.current = ctx;

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            // Create gradient
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, 'rgba(220, 38, 38, 0.1)');  // Red with low opacity
            gradient.addColorStop(0.5, 'rgba(220, 38, 38, 0.05)'); // Even lower opacity
            gradient.addColorStop(1, 'rgba(220, 38, 38, 0.1)');
            gradientRef.current = gradient;
        };

        // Track mouse movement for cursor and ripples
        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Update cursor position
            cursorRef.current = {
                x,
                y,
                radius: 20
            };

            // Create new ripple
            if (Math.random() > 0.8) { // Only create ripple 20% of the time for performance
                ripplesRef.current.push({
                    x,
                    y,
                    radius: 2,
                    opacity: 0.5,
                    expanding: true
                });
            }
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        handleResize();

        // Handle mouse clicks for bigger ripples
        const handleClick = (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Create multiple ripples for click effect
            for (let i = 0; i < 3; i++) {
                ripplesRef.current.push({
                    x,
                    y,
                    radius: 5,
                    opacity: 0.7,
                    expanding: true,
                    delay: i * 100 // Stagger the ripples
                });
            }
        };

        window.addEventListener('click', handleClick);

        // Start animation
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('click', handleClick);
        };
    }, []);

    // Wave and cursor animation
    const animate = () => {
        if (!contextRef.current || !canvasRef.current || !gradientRef.current) return;

        const ctx = contextRef.current;
        const canvas = canvasRef.current;
        const gradient = gradientRef.current;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update angle for waves
        angleRef.current += 0.005;

        // Draw multiple waves
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(0, canvas.height / 2);

            for (let x = 0; x < canvas.width; x++) {
                const y = Math.sin(x * 0.003 + angleRef.current + i) * 50 + canvas.height / 2;
                ctx.lineTo(x, y);
            }

            ctx.strokeStyle = `rgba(220, 38, 38, ${0.1 - i * 0.02})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Draw floating circles
        const time = Date.now() * 0.001;
        for (let i = 0; i < 20; i++) {
            const x = Math.sin(time + i * 0.5) * 100 + canvas.width / 2;
            const y = Math.cos(time + i * 0.5) * 100 + canvas.height / 2;
            const size = Math.sin(time + i) * 2 + 4;

            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(220, 38, 38, ${0.1 - i * 0.005})`;
            ctx.fill();
        }

        // Draw and update ripples
        ripplesRef.current = ripplesRef.current.filter(ripple => {
            if (ripple.delay && ripple.delay > 0) {
                ripple.delay -= 16; // Assuming 60fps
                return true;
            }

            ctx.beginPath();
            ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(220, 38, 38, ${ripple.opacity})`;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Update ripple
            if (ripple.expanding) {
                ripple.radius += 2;
                ripple.opacity -= 0.02;
            }

            return ripple.opacity > 0;
        });

        // Draw cursor effect
        const cursor = cursorRef.current;
        
        // Outer glow
        const gradient1 = ctx.createRadialGradient(
            cursor.x, cursor.y, 0,
            cursor.x, cursor.y, cursor.radius * 2
        );
        gradient1.addColorStop(0, 'rgba(220, 38, 38, 0.2)');
        gradient1.addColorStop(1, 'rgba(220, 38, 38, 0)');
        
        ctx.beginPath();
        ctx.arc(cursor.x, cursor.y, cursor.radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient1;
        ctx.fill();

        // Inner circle
        ctx.beginPath();
        ctx.arc(cursor.x, cursor.y, cursor.radius / 2, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(220, 38, 38, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Rotating particles around cursor
        for (let i = 0; i < 8; i++) {
            const angle = (time * 2 + i * Math.PI / 4) % (Math.PI * 2);
            const particleX = cursor.x + Math.cos(angle) * cursor.radius;
            const particleY = cursor.y + Math.sin(angle) * cursor.radius;
            
            ctx.beginPath();
            ctx.arc(particleX, particleY, 2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(220, 38, 38, 0.5)';
            ctx.fill();
        }

        requestAnimationFrame(animate);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-gray-50">
            <Head title="Forgot Password" />
            
            {/* Animated background */}
            <canvas 
                ref={canvasRef} 
                className="absolute inset-0 w-full h-full cursor-none"
                style={{ opacity: 0.7 }}
            />

            {/* Main content */}
            <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
                <div className="max-w-md w-full space-y-8 relative">
                    {/* Decorative elements */}
                    <div className="absolute -top-20 -left-20 w-40 h-40 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                    <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                    
                    {/* Card content */}
                    <div className="bg-white backdrop-filter backdrop-blur-lg bg-opacity-90 rounded-2xl shadow-xl p-8 transform hover:scale-[1.01] transition-all duration-300">
                        <div className="text-center relative">
                            <div className="absolute -top-24 left-1/2 transform -translate-x-1/2">
                                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                    </svg>
                                </div>
                            </div>

                            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 tracking-tight">
                                Password Recovery
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Don't worry! It happens. Please enter the email address associated with your account.
                            </p>
                        </div>

                        {status && (
                            <div className="mt-4 p-4 rounded-lg bg-green-50 border-l-4 border-green-400">
                                <p className="text-sm text-green-700">{status}</p>
                            </div>
                        )}

                        <form onSubmit={submit} className="mt-8 space-y-6">
                            <div className="relative group">
                                <label 
                                    htmlFor="email" 
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Email Address
                                </label>
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm transition-all duration-300 ease-in-out"
                                    placeholder="Enter your email address"
                                    autoComplete="email"
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} className="mt-1" />
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transform transition-all duration-300 ease-in-out hover:-translate-y-0.5"
                                >
                                    {processing ? (
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : 'Send Recovery Link'}
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 text-center">
                            <Link 
                                href={route('login')} 
                                className="text-sm text-gray-600 hover:text-red-500 transition-colors duration-300"
                            >
                                ← Back to login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add keyframe animations */}
            <style jsx>{`
                @keyframes blob {
                    0% {
                        transform: translate(0px, 0px) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                    100% {
                        transform: translate(0px, 0px) scale(1);
                    }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
            `}</style>
        </div>
    );
}
