import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    // Updated rotating text configuration - single background color
    const rotatingWords = ['ATHLETE', 'FIGHTER', 'WINNER'];
    const [currentWord, setCurrentWord] = useState(rotatingWords[0]);
    const [animationState, setAnimationState] = useState('visible'); // 'visible', 'exiting', or 'entering'
    
    // Refs for interactive background
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const mouseRef = useRef({ x: 0, y: 0 });
    
    useEffect(() => {
        let wordIndex = 0;
        
        const rotateWords = () => {
            // Start exit animation
            setAnimationState('exiting');
            
            // After exit animation completes, change word and start entry animation
            setTimeout(() => {
                wordIndex = (wordIndex + 1) % rotatingWords.length;
                setCurrentWord(rotatingWords[wordIndex]);
                setAnimationState('entering');
                
                // Reset to visible state after entry animation
                setTimeout(() => {
                    setAnimationState('visible');
                }, 500); // Duration of entry animation
            }, 500); // Duration of exit animation
        };
        
        // Set interval for word rotation
        const interval = setInterval(rotateWords, 3000); // Total time for each word
        
        return () => clearInterval(interval);
    }, []);

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

    // Animation classes based on state
    const getAnimationClass = () => {
        switch(animationState) {
            case 'exiting':
                return 'animate-word-exit';
            case 'entering':
                return 'animate-word-enter';
            default:
                return '';
        }
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <style jsx>{`
                @keyframes wordExit {
                  0% {
                    transform: translateY(0);
                    opacity: 1;
                  }
                  100% {
                    transform: translateY(-20px);
                    opacity: 0;
                  }
                }

                @keyframes wordEnter {
                  0% {
                    transform: translateY(20px);
                    opacity: 0;
                  }
                  100% {
                    transform: translateY(0);
                    opacity: 1;
                  }
                }

                .animate-word-exit {
                  animation: wordExit 0.5s forwards;
                }

                .animate-word-enter {
                  animation: wordEnter 0.5s forwards;
                }
            `}</style>
            
            <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <Head title="Log in" />
                
                {/* Interactive background canvas */}
                <canvas 
                    ref={canvasRef} 
                    className="absolute inset-0 w-full h-full -z-10"
                ></canvas>
                
                <div className="max-w-4xl w-full flex overflow-hidden rounded-lg shadow-2xl mx-auto relative z-10">
                    {/* Form Side - with glassmorphism effect */}
                    <div className="w-full md:w-7/12 px-8 py-12 bg-white bg-opacity-80 backdrop-blur-md">
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl font-bold mb-2 flex flex-wrap items-center">
                                WELCOME BACK{' '}
                                <span className="ml-2 px-3 py-1 rounded text-white bg-red-500 overflow-hidden" style={{ display: 'inline-block', minWidth: '120px', textAlign: 'center' }}>
                                    <span className={`inline-block ${getAnimationClass()}`}>
                                        {currentWord}
                                    </span>
                                </span>
                            </h1>
                            <p className="text-gray-600 mb-8">Welcome back! Please enter your details.</p>
                        </div>

                        {status && (
                            <div className="mb-4 text-sm font-medium text-green-600">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit}>
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
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
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
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <InputError message={errors.password} className="mt-1" />
                            </div>

                            <div className="flex items-center justify-between mb-6">
                                <label className="flex items-center">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="text-red-500 focus:ring-red-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm text-red-500 hover:text-red-600 hover:underline transition duration-200"
                                    >
                                        Forgot password?
                                    </Link>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                Sign in
                            </button>
                            
                            <div className="mt-6 text-center text-sm text-gray-600">
                                Don't have an account?{' '}
                                <Link href={route('register')} className="text-red-500 hover:underline">
                                    Sign up for free!
                                </Link>
                            </div>
                        </form>
                    </div>

                    {/* Image Side */}
                    <div className="hidden md:block md:w-5/12 bg-gray-100 relative overflow-hidden">
                        <img 
                            src="/storage/bascket.png" 
                            alt="Athlete" 
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}