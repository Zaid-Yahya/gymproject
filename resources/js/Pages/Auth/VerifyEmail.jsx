import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    // Refs for the animated background
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const timeRef = useRef(0);

    // Animation setup
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        contextRef.current = ctx;

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // DNA helix animation
    const animate = () => {
        if (!contextRef.current || !canvasRef.current) return;

        const ctx = contextRef.current;
        const canvas = canvasRef.current;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const centerY = canvas.height / 2;
        const amplitude = 100;
        const frequency = 0.02;
        const speed = 0.03;
        timeRef.current += speed;

        // Draw multiple strands
        for (let j = 0; j < 2; j++) {
            const offset = j * Math.PI; // Offset for second strand
            
            for (let i = 0; i < canvas.width; i += 20) {
                const x = i;
                const y1 = centerY + Math.sin(i * frequency + timeRef.current + offset) * amplitude;
                const y2 = centerY + Math.sin(i * frequency + timeRef.current + Math.PI + offset) * amplitude;

                // Draw connecting lines
                ctx.beginPath();
                ctx.moveTo(x, y1);
                ctx.lineTo(x, y2);
                ctx.strokeStyle = `rgba(220, 38, 38, ${0.2 + Math.sin(i * frequency + timeRef.current) * 0.1})`;
                ctx.lineWidth = 2;
                ctx.stroke();

                // Draw nodes
                ctx.beginPath();
                ctx.arc(x, y1, 4, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(220, 38, 38, 0.5)';
                ctx.fill();

                ctx.beginPath();
                ctx.arc(x, y2, 4, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(220, 38, 38, 0.5)';
                ctx.fill();
            }
        }

        requestAnimationFrame(animate);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-gray-50">
            <Head title="Email Verification" />
            
            {/* Animated background */}
            <canvas 
                ref={canvasRef} 
                className="absolute inset-0 w-full h-full"
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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>

                            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 tracking-tight">
                                Verify Your Email
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you?
                            </p>
                        </div>

                        {status === 'verification-link-sent' && (
                            <div className="mt-4 p-4 rounded-lg bg-green-50 border-l-4 border-green-400">
                                <p className="text-sm text-green-700">
                                    A new verification link has been sent to your email address.
                                </p>
                            </div>
                        )}

                        <form onSubmit={submit} className="mt-8">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full sm:w-auto flex justify-center py-3 px-6 border border-transparent text-sm font-medium rounded-lg text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transform transition-all duration-300 ease-in-out hover:-translate-y-0.5"
                                >
                                    {processing ? (
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : 'Resend Verification Email'}
                                </button>

                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="text-sm text-gray-600 hover:text-red-500 transition-colors duration-300"
                                >
                                    Log Out
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Add keyframe animations */}
            <style jsx>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
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
