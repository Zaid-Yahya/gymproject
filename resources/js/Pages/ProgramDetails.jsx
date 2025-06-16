import React from 'react';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Navbar from '@/Components/Navbar';

const programs = {
    'force-conditionnement': {
        title: "FORCE & CONDITIONNEMENT",
        description: "Développez vos muscles, augmentez votre force et améliorez votre condition physique globale avec notre programme complet de force et de conditionnement.",
        longDescription: `Notre programme de Force & Conditionnement est conçu pour transformer votre corps et votre esprit. Que vous soyez débutant ou athlète avancé, nos entraîneurs experts vous guideront à travers un parcours personnalisé vers une meilleure version de vous-même.

        Ce programme combine des techniques éprouvées de musculation avec des exercices de conditionnement moderne pour maximiser vos résultats. Vous développerez non seulement votre force physique, mais aussi votre endurance, votre agilité et votre mentalité.

        Chaque séance est structurée pour vous pousser à vos limites tout en maintenant une forme parfaite et en prévenant les blessures.`,
        image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=750&q=80",
        features: [
            "Séances personnalisées selon votre niveau",
            "Techniques de musculation avancées",
            "Programme de progression structuré",
            "Suivi des performances",
            "Nutrition et récupération"
        ],
        schedule: [
            { day: "Lundi", time: "8:00 - 20:00" },
            { day: "Mardi", time: "8:00 - 20:00" },
            { day: "Mercredi", time: "8:00 - 20:00" },
            { day: "Jeudi", time: "8:00 - 20:00" },
            { day: "Vendredi", time: "8:00 - 20:00" },
            { day: "Samedi", time: "9:00 - 17:00" },
            { day: "Dimanche", time: "9:00 - 15:00" }
        ]
    },
    'cardio-hiit': {
        title: "CARDIO & HIIT",
        description: "Maximisez la perte de graisse et la santé cardiovasculaire grâce à notre entraînement par intervalles à haute intensité et nos programmes cardio variés.",
        longDescription: `Notre programme Cardio & HIIT est conçu pour maximiser la combustion des calories et améliorer votre condition cardiovasculaire. Les séances d'entraînement par intervalles à haute intensité (HIIT) alternent entre des périodes d'effort intense et des périodes de récupération active.

        Ce programme est parfait pour ceux qui veulent des résultats rapides et efficaces. Vous brûlerez des calories non seulement pendant l'entraînement, mais aussi pendant les heures qui suivent grâce à l'effet "afterburn".

        Nos entraîneurs vous guideront à travers des séances dynamiques et variées qui maintiennent votre motivation à son maximum.`,
        image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=750&q=80",
        features: [
            "Séances HIIT variées",
            "Cardio-training intensif",
            "Suivi de la fréquence cardiaque",
            "Programme adaptatif",
            "Techniques de récupération"
        ],
        schedule: [
            { day: "Lundi", time: "7:00 - 21:00" },
            { day: "Mardi", time: "7:00 - 21:00" },
            { day: "Mercredi", time: "7:00 - 21:00" },
            { day: "Jeudi", time: "7:00 - 21:00" },
            { day: "Vendredi", time: "7:00 - 21:00" },
            { day: "Samedi", time: "8:00 - 18:00" },
            { day: "Dimanche", time: "8:00 - 16:00" }
        ]
    },
    'yoga-mobilite': {
        title: "YOGA & MOBILITÉ",
        description: "Améliorez votre flexibilité, votre équilibre et votre bien-être mental grâce à nos programmes de yoga et de mobilité.",
        longDescription: `Notre programme Yoga & Mobilité est conçu pour améliorer votre flexibilité, votre équilibre et votre bien-être mental. Ces séances sont parfaites pour les jours de récupération ou comme pratique autonome.

        Le programme combine différentes formes de yoga et d'exercices de mobilité pour favoriser la longévité dans votre parcours de fitness tout en réduisant les risques de blessures.

        Nos instructeurs certifiés vous guideront à travers des séances adaptées à tous les niveaux, du débutant au pratiquant avancé.`,
        image: "/storage/join_us.jpg",
        features: [
            "Différents styles de yoga",
            "Exercices de mobilité",
            "Techniques de respiration",
            "Méditation guidée",
            "Séances adaptatives"
        ],
        schedule: [
            { day: "Lundi", time: "7:00 - 20:00" },
            { day: "Mardi", time: "7:00 - 20:00" },
            { day: "Mercredi", time: "7:00 - 20:00" },
            { day: "Jeudi", time: "7:00 - 20:00" },
            { day: "Vendredi", time: "7:00 - 20:00" },
            { day: "Samedi", time: "8:00 - 17:00" },
            { day: "Dimanche", time: "8:00 - 15:00" }
        ]
    }
};

export default function ProgramDetails({ slug }) {
    const program = programs[slug];

    if (!program) {
        return (
            <div className="min-h-screen bg-black text-white">
                <Navbar />
                <div className="container mx-auto px-4 py-20">
                    <h1 className="text-4xl font-bold text-center">Programme non trouvé</h1>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head title={program.title} />
            <div className="min-h-screen bg-black text-white">
                <Navbar />
                
                {/* Hero Section */}
                <div className="relative h-[60vh] overflow-hidden">
                    <div className="absolute inset-0">
                        <img 
                            src={program.image} 
                            alt={program.title}
                            className="w-full h-full object-cover filter brightness-50"
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/80"></div>
                    <div className="relative h-full flex items-center justify-center">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center px-4"
                        >
                            <h1 className="text-5xl md:text-6xl font-bold mb-6">
                                {program.title}
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                                {program.description}
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="container mx-auto px-4 py-20">
                    <div className="max-w-4xl mx-auto">
                        {/* Description */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="mb-16"
                        >
                            <h2 className="text-3xl font-bold mb-6">À propos du programme</h2>
                            <div className="prose prose-invert max-w-none">
                                {program.longDescription.split('\n\n').map((paragraph, index) => (
                                    <p key={index} className="text-gray-300 mb-4">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </motion.div>

                        {/* Features */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="mb-16"
                        >
                            <h2 className="text-3xl font-bold mb-6">Caractéristiques</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {program.features.map((feature, index) => (
                                    <div 
                                        key={index}
                                        className="bg-gray-900 rounded-lg p-6 border border-gray-800"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                            </div>
                                            <span className="text-lg font-medium">{feature}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Schedule */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="mb-16"
                        >
                            <h2 className="text-3xl font-bold mb-6">Horaires</h2>
                            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                                <div className="space-y-4">
                                    {program.schedule.map((item, index) => (
                                        <div 
                                            key={index}
                                            className="flex justify-between items-center py-3 border-b border-gray-800 last:border-0"
                                        >
                                            <span className="font-medium">{item.day}</span>
                                            <span className="text-gray-400">{item.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* CTA Section */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <h2 className="text-3xl font-bold mb-6">Prêt à commencer ?</h2>
                            <p className="text-gray-300 mb-8">
                                Rejoignez-nous aujourd'hui et commencez votre voyage vers une meilleure version de vous-même.
                            </p>
                            <a 
                                href={route('reservations.create')}
                                className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-orange-600 hover:to-red-600 transition duration-300 transform hover:scale-105"
                            >
                                Réserver maintenant
                            </a>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
} 