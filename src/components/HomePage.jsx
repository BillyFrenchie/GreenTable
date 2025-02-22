// HomePage.js
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart, Leaf, Users,
    ChevronRight, Apple, Brain, Battery
} from 'lucide-react';
import axios from 'axios';
import Navbar from './Navbar'; // Import Navbar component

const HomePage = () => {
    const [userName, setUserName] = useState('');
    const [backgroundImages, setBackgroundImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [activeLink, setActiveLink] = useState('/home');
    const featuresSectionRef = useRef(null); // Ref for smooth scrolling

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const categories = [
                    { query: 'food donation charity', orientation: 'landscape' },
                    { query: 'community kitchen', orientation: 'landscape' },
                    { query: 'food sharing', orientation: 'landscape' },
                    { query: 'bakery', orientation: 'landscape' },
                    { query: 'kids playing', orientation: 'landscape' },
                    { query: 'helping', orientation: 'landscape' },
                ];

                const imagePromises = categories.map(category =>
                    axios.get('https://api.unsplash.com/search/photos', {
                        params: {
                            query: category.query,
                            orientation: category.orientation,
                            per_page: 3,
                            client_id: 'wxDg2ql8m2gaSVrzQ03UuS4E-OPfXb5Xnc26hzzeTW8',
                        }
                    })
                );

                const responses = await Promise.all(imagePromises);
                const images = responses.flatMap(response =>
                    response.data.results.map(img => ({
                        regular: img.urls.regular,
                        description: img.alt_description
                    }))
                );
                setBackgroundImages(images);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching images:', error);
                setIsLoading(false);
            }
        };

        fetchImages();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (backgroundImages.length > 0) {
                setCurrentImageIndex(prev => (prev + 1) % backgroundImages.length);
            }
        }, 6000);
        return () => clearInterval(interval);
    }, [backgroundImages]);

    const fetchUserName = async () => {
        try {
            const response = await axios.get('http://localhost:3001/user', {
                withCredentials: true,
            });
            if (response.data?.organizationName) {
                setUserName(response.data.organizationName);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        fetchUserName();
    }, []);

    const features = [
        {
            icon: <Leaf className="w-12 h-12 text-emerald-400" />,
            title: "Reduce Food Waste",
            description: "Transform surplus food into meaningful donations. Help reduce environmental impact."
        },
        {
            icon: <Users className="w-12 h-12 text-emerald-400" />,
            title: "Community Impact",
            description: "Connect with local organizations and make a difference. Support those in need."
        },
        {
            icon: <Heart className="w-12 h-12 text-emerald-400" />,
            title: "Simple Donations",
            description: "Easy-to-use platform for managing food donations. Donate simply and efficiently."
        }
    ];

    const nutritionFacts = [
        {
            icon: <Apple className="w-12 h-12 text-emerald-400" />,
            title: "Did You Know?",
            fact: "One-third of food produced globally goes to waste, impacting the environment and economy."
        },
        {
            icon: <Brain className="w-12 h-12 text-emerald-400" />,
            title: "Food for Thought",
            fact: "Reducing food waste can save up to 8% of global greenhouse gas emissions. A small change with a big impact."
        },
        {
            icon: <Battery className="w-12 h-12 text-emerald-400" />,
            title: "Energy Impact",
            fact: "The energy to produce wasted food could power millions of homes. Conserve resources by reducing waste."
        }
    ];

    // Function to determine if the background is light or dark
    const isBackgroundLight = () => {
        if (backgroundImages.length > 0 && !isLoading) {
            const imageUrl = backgroundImages[currentImageIndex]?.regular;
            if (!imageUrl) return false;

            const img = new Image();
            img.src = imageUrl;

            const calculateAverageBrightness = (image) => {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');

                canvas.width = image.width;
                canvas.height = image.height;

                context.drawImage(image, 0, 0);

                const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
                let totalBrightness = 0;

                for (let i = 0; i < imageData.length; i += 4) {
                    const red = imageData[i];
                    const green = imageData[i + 1];
                    const blue = imageData[i + 2];

                    const brightness = (red + green + blue) / 3;
                    totalBrightness += brightness;
                }

                const averageBrightness = totalBrightness / (canvas.width * canvas.height);
                return averageBrightness;
            };

            return new Promise((resolve) => {
                img.onload = () => {
                    const averageBrightness = calculateAverageBrightness(img);
                    resolve(averageBrightness > 128); // Threshold
                };
                img.onerror = () => resolve(false);  // Handle errors
            });
        }
        return Promise.resolve(false);
    };

    const scrollToFeatures = () => {
        featuresSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen relative">
            {/* Background Slideshow */}
            <AnimatePresence mode="wait">
                {!isLoading && (
                    <motion.div
                        key={currentImageIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="fixed inset-0 w-full h-full"
                        style={{
                            backgroundImage: `url(${backgroundImages[currentImageIndex]?.regular})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-emerald-900/80" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navbar Component */}
            <Navbar activeLink={activeLink} setActiveLink={setActiveLink} />

            {/* Main Content */}
            <main className="relative">
                <div className="flex flex-col items-center w-full">

                    {/* Hero Section */}
                    <section className="w-full min-h-screen flex items-center justify-center text-center">
                        <div className="max-w-7xl mx-auto px-4 py-16">
                            {userName ? (
                                <div className="space-y-4">
                                    <motion.h1
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className={`text-6xl font-bold leading-tight ${isBackgroundLight() ? 'text-emerald-400' : 'text-white'}`}
                                    >
                                        Welcome back, <span className="text-emerald-400">{userName}</span>
                                    </motion.h1>
                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                        className={`text-xl ${isBackgroundLight() ? 'text-black' : 'text-white'}`}
                                    >
                                        Ready to make a difference today?
                                    </motion.p>
                                </div>
                            ) : (
                                <div className="h-16 w-64 mx-auto bg-emerald-800/50 animate-pulse rounded-lg" />
                            )}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className={`text-2xl text-emerald-100 max-w-3xl mx-auto leading-relaxed mt-8`}
                            >
                                Together, we're creating a sustainable future by connecting surplus food
                                with those who need it most.
                            </motion.p>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                                className="inline-flex items-center px-8 py-3 bg-emerald-500 text-white rounded-full font-semibold text-lg hover:bg-emerald-600 transition-colors"
                                onClick={scrollToFeatures} // Add smooth scrolling
                            >
                                Learn More
                                <ChevronRight className="ml-2 w-5 h-5" />
                            </motion.button>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section ref={featuresSectionRef} className="w-full min-h-screen flex items-center justify-center">
                        <div className="max-w-7xl mx-auto px-4 py-16">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className={`text-4xl font-bold mb-12 text-white`}
                            >
                                Key <span className="text-emerald-400">Features</span>
                            </motion.h2>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 w-full" // Adjusted grid for larger screens
                            >
                                {features.map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ y: -10 }}
                                        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white border border-white/20 flex flex-col items-center"
                                    >
                                        <div className="flex flex-col items-center text-center space-y-4">
                                            {feature.icon}
                                            <motion.h3
                                                whileHover={{ scale: 1.1 }}
                                                className={`text-xl font-semibold ${isBackgroundLight() ? 'text-black' : 'text-white'}`}
                                            >
                                                {feature.title}
                                            </motion.h3>
                                            <motion.p
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: 0.2 }}
                                                className={`text-emerald-100`}
                                            >
                                                {feature.description}
                                            </motion.p>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </section>

                    {/* Nutrition Facts Section */}
                    <section className="w-full min-h-screen flex items-center justify-center">
                        <div className="max-w-7xl mx-auto px-4 py-16">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className={`text-4xl font-bold mb-12 text-white`}
                            >
                                Food Waste <span className="text-emerald-400">Impact</span>
                            </motion.h2>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 w-full" // Adjusted grid for larger screens
                            >
                                {nutritionFacts.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white border border-white/20 flex flex-col items-center"
                                        >
                                        <div className="flex flex-col items-center text-center space-y-4">
                                            {item.icon}
                                            <motion.h3
                                                whileHover={{ scale: 1.1 }}
                                                className={`text-xl font-semibold ${isBackgroundLight() ? 'text-black' : 'text-white'}`}
                                            >
                                                {item.title}
                                            </motion.h3>
                                            <motion.p
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.5, delay: 0.2 }}
                                                className={`text-emerald-100`}
                                            >
                                                {item.fact}
                                            </motion.p>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </section>

                    {/* Call to Action Section */}
                    <section className="w-full min-h-screen flex items-center justify-center">
                        <div className="max-w-4xl mx-auto px-4">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className={`text-4xl font-bold mb-8 text-white`}
                            >
                                Ready to Get <span className="text-emerald-400">Started?</span>
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className={`text-xl leading-relaxed mb-12 text-white`}
                            >
                                Join our community and start making a difference in reducing food waste today.
                            </motion.p>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="inline-flex items-center px-8 py-3 bg-emerald-500 text-white rounded-full font-semibold text-lg hover:bg-emerald-600 transition-colors"
                            >
                                Sign Up Now
                                <ChevronRight className="ml-2 w-5 h-5" />
                            </motion.button>
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="bg-emerald-900/90 text-white text-center py-8 w-full">
                        <p>&copy; {new Date().getFullYear()} GreenTable. All rights reserved.</p>
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default HomePage;
