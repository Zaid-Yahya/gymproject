import React, { useState } from 'react';

export default function GalleryCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    
    // Gallery images - replace with your actual gym images
    const images = [
        {
            src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3",
            alt: "Modern gym equipment"
        },
        {
            src: "https://images.unsplash.com/photo-1574680088814-c9e8a10d8a4d?ixlib=rb-4.0.3",
            alt: "Dumbbells rack"
        },
        {
            src: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3",
            alt: "Cardio area"
        },
        {
            src: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3",
            alt: "Yoga area"
        }
    ];

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    return (
        <div className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-lg shadow-xl">
            {/* Main image */}
            <div className="relative h-[500px]">
                {images.map((image, index) => (
                    <div 
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                            index === currentIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <img 
                            src={image.src}
                            alt={image.alt}
                            className="object-cover w-full h-full"
                        />
                    </div>
                ))}
            </div>

            {/* Navigation arrows */}
            <button 
                onClick={prevSlide}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                aria-label="Previous slide"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button 
                onClick={nextSlide}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                aria-label="Next slide"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Dots indicators */}
            <div className="absolute bottom-4 left-0 right-0">
                <div className="flex justify-center space-x-2">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-3 h-3 rounded-full ${
                                index === currentIndex ? 'bg-red-600' : 'bg-white/70'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}