import React from 'react';
import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';

export default function Home() {
    const services = [
        {
            title: "Personal Training",
            description: "Get personalized workout plans and one-on-one guidance from our expert trainers.",
            icon: "💪"
        },
        {
            title: "Group Classes",
            description: "Join our energetic group classes including yoga, HIIT, spinning, and more.",
            icon: "👥"
        },
        {
            title: "Nutrition Plans",
            description: "Receive custom nutrition advice to complement your fitness routine.",
            icon: "🍎"
        }
    ];

    const testimonials = [
        {
            text: "GymMaster changed my life! Best fitness experience. The trainers are professional and the equipment is top-notch.",
            author: "Sarah M."
        },
        {
            text: "The trainers are amazing and the atmosphere is motivating! I've achieved results I never thought possible.",
            author: "John D."
        }
    ];

    return (
        <>
            <Head title="Welcome to GymMaster" />
            
            {/* Navigation */}
            <nav className="fixed w-full bg-white shadow-md z-50">
                <div className="container mx-auto px-6 py-3">
                    <div className="flex items-center justify-between">
                        <div className="text-xl font-bold">GymMaster</div>
                        <div className="hidden md:flex items-center space-x-8">
                            <Link href="/" className="text-gray-800 hover:text-red-600">Home</Link>
                            <Link href="#about" className="text-gray-800 hover:text-red-600">About Us</Link>
                            <Link href="#services" className="text-gray-800 hover:text-red-600">Membership Plans</Link>
                            <Link href="#contact" className="text-gray-800 hover:text-red-600">Contact Us</Link>
                            <Link href="/register" className="bg-white text-red-600 border border-red-600 px-4 py-2 rounded-md hover:bg-red-50">Sign Up</Link>
                            <Link href="/login" className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">Log In</Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative h-screen">
                <div className="absolute inset-0">
                    <img 
                        src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3"
                        className="w-full h-full object-cover"
                        alt="Gym Equipment"
                    />
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                </div>
                <div className="relative h-full flex items-center justify-center">
                    <div className="text-center text-white px-4">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">Welcome to GymMaster!</h1>
                        <p className="text-xl md:text-2xl mb-8">Your fitness journey starts here.</p>
                        <div className="space-x-4">
                            <button className="bg-red-600 text-white px-8 py-3 rounded-md hover:bg-red-700 text-lg">
                                Get Started
                            </button>
                            <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-md hover:bg-white hover:text-black text-lg">
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* About Section */}
            <section id="about" className="py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-8">About Our Gym</h2>
                    <p className="text-gray-600 text-center max-w-3xl mx-auto mb-8">
                        GymMaster offers state-of-the-art fitness equipment and professional trainers to help
                        you reach your fitness goals. Our facility is designed to provide you with the best
                        possible environment for your workout routine, whether you're a beginner or an
                        experienced athlete.
                    </p>
                    <div className="text-center">
                        <button className="bg-red-600 text-white px-8 py-3 rounded-md hover:bg-red-700">
                            Join Now
                        </button>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-12">Our Services</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <div 
                                key={index}
                                className="bg-white p-8 rounded-lg shadow-lg text-center"
                            >
                                <div className="text-5xl mb-4">{service.icon}</div>
                                <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                                <p className="text-gray-600">{service.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-12">What Our Members Say</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div 
                                key={index}
                                className="bg-white p-8 rounded-lg shadow-lg"
                            >
                                <p className="text-gray-600 italic mb-4">"{testimonial.text}"</p>
                                <p className="font-bold">- {testimonial.author}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
} 