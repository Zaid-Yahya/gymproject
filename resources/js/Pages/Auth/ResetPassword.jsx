import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    // Refs for the animated background
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const symbolsRef = useRef([]);

    // Animation setup
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        contextRef.current = ctx;

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initSymbols();
        };

        // Initialize matrix symbols
        const initSymbols = () => {
            const symbols = [];
            const columns = Math.floor(canvas.width / 20);
            
            for (let i = 0; i < columns; i++) {
                symbols[i] = {
                    x: i * 20,
                    y: Math.random() * canvas.height,
                    text: String.fromCharCode(0x30A0 + Math.random() * 96),
                    speed: 1 + Math.random() * 3,
                    opacity: Math.random() * 0.5 + 0.1
                };
            }
            
            symbolsRef.current = symbols;
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Matrix rain animation
    const animate = () => {
        if (!contextRef.current || !canvasRef.current) return;

        const ctx = contextRef.current;
        const canvas = canvasRef.current;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        symbolsRef.current.forEach(symbol => {
            // Update symbol
            symbol.y = (symbol.y + symbol.speed) % canvas.height;
            if (Math.random() > 0.98) {
                symbol.text = String.fromCharCode(0x30A0 + Math.random() * 96);
            }

            // Draw symbol
            ctx.font = '20px monospace';
            ctx.fillStyle = `rgba(220, 38, 38, ${symbol.opacity})`;
            ctx.fillText(symbol.text, symbol.x, symbol.y);
        });

        requestAnimationFrame(animate);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-gray-50">
            <Head title="Reset Password" />
            
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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                    </svg>
                                </div>
                            </div>

                            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 tracking-tight">
                                Reset Password
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Please enter your new password below.
                            </p>
                        </div>

                        <form onSubmit={submit} className="mt-8 space-y-6">
                            <div>
                                <InputLabel htmlFor="email" value="Email" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm transition-all duration-300 ease-in-out"
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password" value="New Password" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm transition-all duration-300 ease-in-out"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm transition-all duration-300 ease-in-out"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                />
                                <InputError message={errors.password_confirmation} className="mt-2" />
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
                                    ) : 'Reset Password'}
                                </button>
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
