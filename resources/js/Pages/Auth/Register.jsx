import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    // Refs for interactive background
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const mouseRef = useRef({ x: 0, y: 0 });
    
    // Interactive background animation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        
        // Set canvas dimensions
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };
        
        // Track mouse position
        const handleMouseMove = (e) => {
            mouseRef.current = {
                x: e.clientX,
                y: e.clientY
            };
        };
        
        // Create particles
        const initParticles = () => {
            const particles = [];
            const particleCount = 100;
            
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 3 + 1,
                    color: `rgba(220, 38, 38, ${Math.random() * 0.5 + 0.1})`, // Red with varying opacity
                    speedX: Math.random() * 2 - 1,
                    speedY: Math.random() * 2 - 1
                });
            }
            
            particlesRef.current = particles;
        };
        
        // Animate particles
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particlesRef.current.forEach(particle => {
                // Move particles
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                
                // Bounce off edges
                if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
                
                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
                
                // React to mouse
                const dx = mouseRef.current.x - particle.x;
                const dy = mouseRef.current.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const angle = Math.atan2(dy, dx);
                    const force = (150 - distance) / 150;
                    
                    particle.speedX -= Math.cos(angle) * force * 0.2;
                    particle.speedY -= Math.sin(angle) * force * 0.2;
                    
                    // Connect nearby particles with lines
                    particlesRef.current.forEach(otherParticle => {
                        const dx2 = particle.x - otherParticle.x;
                        const dy2 = particle.y - otherParticle.y;
                        const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
                        
                        if (distance2 < 70) {
                            ctx.beginPath();
                            ctx.moveTo(particle.x, particle.y);
                            ctx.lineTo(otherParticle.x, otherParticle.y);
                            ctx.strokeStyle = `rgba(220, 38, 38, ${0.1 * (70 - distance2) / 70})`;
                            ctx.lineWidth = 0.5;
                            ctx.stroke();
                        }
                    });
                }
            });
            
            animationFrameId = requestAnimationFrame(animate);
        };
        
        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        
        handleResize();
        animate();
        
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <Head title="Register" />
            
            {/* Interactive background canvas */}
            <canvas 
                ref={canvasRef} 
                className="absolute inset-0 w-full h-full -z-10"
            ></canvas>
            
            <div className="max-w-4xl w-full flex overflow-hidden rounded-lg shadow-2xl mx-auto relative z-10">
                {/* Form Side - with glassmorphism effect */}
                <div className="w-full md:w-1/2 px-8 py-10 bg-white bg-opacity-80 backdrop-blur-md">
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-bold mb-2">CREATE ACCOUNT</h1>
                        <p className="text-gray-600 mb-6">Please fill in your information to get started.</p>
                    </div>

                    <form onSubmit={submit}>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
                                Name
                            </label>
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="Enter your full name"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className="mt-1" />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                                Email
                            </label>
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="Enter your email"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            <InputError message={errors.email} className="mt-1" />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
                                Password
                            </label>
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="Create a strong password"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            <InputError message={errors.password} className="mt-1" />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="password_confirmation" className="block text-gray-700 font-medium mb-1">
                                Confirm Password
                            </label>
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="Confirm your password"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                            <InputError message={errors.password_confirmation} className="mt-1" />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                            Register
                        </button>
                        
                        <div className="mt-6 text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link href={route('login')} className="text-red-500 hover:underline">
                                Sign in
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Image Side */}
                <div className="hidden md:block md:w-1/2 bg-gray-100 relative overflow-hidden">
                    <img 
                        src="/storage/bascket.png" 
                        alt="Athlete" 
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
}