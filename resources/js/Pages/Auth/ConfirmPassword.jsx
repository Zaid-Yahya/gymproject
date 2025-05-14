import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    // Refs for the animated background
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const timeRef = useRef(0);
    const pointsRef = useRef([]);

    // Animation setup
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        contextRef.current = ctx;

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initPoints();
        };

        // Initialize floating points
        const initPoints = () => {
            const points = [];
            const numPoints = 50;
            
            for (let i = 0; i < numPoints; i++) {
                points.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    speedX: (Math.random() - 0.5) * 0.5,
                    speedY: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 3 + 1
                });
            }
            
            pointsRef.current = points;
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Geometric pattern animation
    const animate = () => {
        if (!contextRef.current || !canvasRef.current) return;

        const ctx = contextRef.current;
        const canvas = canvasRef.current;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        timeRef.current += 0.005;

        // Update and draw points
        pointsRef.current.forEach(point => {
            // Update position
            point.x += point.speedX;
            point.y += point.speedY;

            // Bounce off edges
            if (point.x < 0 || point.x > canvas.width) point.speedX *= -1;
            if (point.y < 0 || point.y > canvas.height) point.speedY *= -1;

            // Draw point
            ctx.beginPath();
            ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(220, 38, 38, 0.3)';
            ctx.fill();
        });

        // Draw connections
        pointsRef.current.forEach((point, i) => {
            pointsRef.current.slice(i + 1).forEach(otherPoint => {
                const dx = point.x - otherPoint.x;
                const dy = point.y - otherPoint.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(point.x, point.y);
                    ctx.lineTo(otherPoint.x, otherPoint.y);
                    ctx.strokeStyle = `rgba(220, 38, 38, ${(100 - distance) / 500})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            });
        });

        // Draw geometric shapes
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 100;
        const points = 6;

        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            for (let j = 0; j <= points; j++) {
                const angle = (j * 2 * Math.PI / points) + timeRef.current + (i * Math.PI / 6);
                const x = centerX + (radius + i * 30) * Math.cos(angle);
                const y = centerY + (radius + i * 30) * Math.sin(angle);
                
                if (j === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.strokeStyle = `rgba(220, 38, 38, ${0.1 + i * 0.1})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        requestAnimationFrame(animate);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-gray-50">
            <Head title="Confirm Password" />
            
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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                            </div>

                            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 tracking-tight">
                                Confirm Password
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                This is a secure area. Please confirm your password before continuing.
                            </p>
                        </div>

                        <form onSubmit={submit} className="mt-8 space-y-6">
                            <div>
                                <InputLabel htmlFor="password" value="Password" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm transition-all duration-300 ease-in-out"
                                    autoComplete="current-password"
                                    isFocused={true}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <InputError message={errors.password} className="mt-2" />
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
                                    ) : 'Confirm Password'}
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
