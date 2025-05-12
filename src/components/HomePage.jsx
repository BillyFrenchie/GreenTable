import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Heart, Leaf, Users, ChevronRight, Apple, Brain, 
  Battery, Utensils, ShoppingBag, ArrowRight, 
  Clock, Award, Globe, ChevronDown, Info
} from 'lucide-react';
import axios from 'axios';
import Navbar from './Navbar';
import DeliverySimulation from './DeliverySimulation';

const HomePage = () => {
  const [userName, setUserName] = useState('');
  const [backgroundImages, setBackgroundImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [activeLink, setActiveLink] = useState('/home');
  const [factsIndex, setFactsIndex] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const impactRef = useRef(null);
  const statsRef = useRef(null);
  const ctaRef = useRef(null);

  // Scroll animations
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsImageLoading(true);
        const foodCategories = [
          { query: 'food donation community kitchen', orientation: 'landscape' },
          { query: 'fresh vegetables market', orientation: 'landscape' },
          { query: 'sharing food community', orientation: 'landscape' },
          { query: 'farm to table fresh food', orientation: 'landscape' },
          { query: 'sustainable food market', orientation: 'landscape' },
          { query: 'food waste reduction', orientation: 'landscape' },
        ];

        const imagePromises = foodCategories.map(category =>
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
        setIsImageLoading(false);
      } catch (error) {
        console.error('Error fetching images:', error);
        setIsImageLoading(false);
      }
    };

    fetchImages();
    
    // Show notification after 5 seconds
    const timer = setTimeout(() => {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 10000);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (backgroundImages.length > 0) {
        setCurrentImageIndex(prev => (prev + 1) % backgroundImages.length);
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [backgroundImages]);

  useEffect(() => {
    const factsInterval = setInterval(() => {
      setFactsIndex(prev => (prev + 1) % foodWasteFacts.length);
    }, 5000);
    return () => clearInterval(factsInterval);
  }, []);

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
    
    // Intersection Observer for stats animation
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.5 }
    );
    
    if (statsRef.current) {
      observer.observe(statsRef.current);
    }
    
    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  const features = [
    {
      icon: <Leaf className="w-12! h-12! text-emerald-400!" />,
      title: "Reduce Food Waste",
      description: "Transform surplus food into meaningful donations and reduce your environmental footprint with our seamless platform."
    },
    {
      icon: <Users className="w-12! h-12! text-emerald-400!" />,
      title: "Community Impact",
      description: "Connect with local organizations making a difference. Track your contribution's impact in real-time."
    },
    {
      icon: <Heart className="w-12! h-12! text-emerald-400!" />,
      title: "Simple Donations",
      description: "Our intelligent system makes food donation effortless. Schedule pickups, track deliveries, and receive impact reports."
    },
    {
      icon: <Utensils className="w-12! h-12! text-emerald-400!" />,
      title: "Food Education",
      description: "Access resources on food preservation, creative reuse of leftovers, and sustainable consumption practices."
    },
    {
      icon: <ShoppingBag className="w-12! h-12! text-emerald-400!" />,
      title: "Donation Tracking",
      description: "Monitor your donations with our transparent tracking system. See where your food goes and who it helps."
    },
    {
      icon: <Award className="w-12! h-12! text-emerald-400!" />,
      title: "Recognition Program",
      description: "Earn badges and certificates for your contributions. Show your commitment to sustainable practices."
    }
  ];

  const nutritionFacts = [
    {
      icon: <Apple className="w-12! h-12! text-emerald-400!" />,
      title: "Food Waste Crisis",
      fact: "One-third of all food produced globally goes to waste, while 828 million people face hunger daily."
    },
    {
      icon: <Brain className="w-12! h-12! text-emerald-400!" />,
      title: "Environmental Impact",
      fact: "Food waste generates 8-10% of global greenhouse emissions. Reducing waste directly fights climate change."
    },
    {
      icon: <Battery className="w-12! h-12! text-emerald-400!" />,
      title: "Resource Conservation",
      fact: "Wasted food consumes 25% of global freshwater used in agriculture and land area the size of China."
    },
    {
      icon: <Globe className="w-12! h-12! text-emerald-400!" />,
      title: "Economic Value",
      fact: "The economic cost of food waste amounts to $1 trillion annually. Redistributing just 25% could feed all hungry people."
    }
  ];

  const foodWasteFacts = [
    "Over 1.3 billion tons of food is wasted globally each year.",
    "The average American family throws away $1,600 worth of produce annually.",
    "Reducing food waste is ranked as the #3 solution to climate change.",
    "Just one-fourth of all wasted food could feed 870 million hungry people.",
    "Food waste in landfills creates methane, a greenhouse gas 25x more potent than CO2.",
    "Restaurants generate 11.4 million tons of food waste annually in the US alone.",
    "About 40% of food waste occurs at retail and consumer levels in developed countries."
  ];

  const impactStatistics = [
    { value: 1300000000, label: "Tons of Food Wasted Annually", prefix: "", suffix: "+" },
    { value: 3700000, label: "CO₂ Emissions from Food Waste (tons)", prefix: "", suffix: "+" },
    { value: 25, label: "% of Global Water Used for Wasted Food", prefix: "", suffix: "%" },
    { value: 870000000, label: "People Who Could Be Fed", prefix: "", suffix: "+" }
  ];

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Counter animation for statistics
  const Counter = ({ value, duration = 2000, prefix = "", suffix = "" }) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
     if (!value) return;

    let start = 0;
    const end = value;
    const stepTime = (duration * 1000) / 60; // around 60 frames

    const formatNumber = (num) => {
      if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
      if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
      if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
      return num.toString();
    };

    const step = () => {
      start += end / 60;
      if (start >= end) {
        setCount(formatNumber(end));
        return;
      }
      setCount(formatNumber(start));
      requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [value]);
    
    return (
      <div className="font-bold! text-emerald-300! text-4xl! md:text-5xl! lg:text-6xl!">
        {prefix}{count}{suffix}
      </div>
    );
  };

  return (
    <div className="min-h-screen! relative! overflow-x-hidden!">
      {/* Background Slideshow */}
      <AnimatePresence mode="wait">
        {!isImageLoading && (
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="fixed! inset-0! w-full! h-full!"
            style={{
              backgroundImage: `url(${backgroundImages[currentImageIndex]?.regular})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute! inset-0! bg-gradient-to-b! from-black/80! via-black/60! to-emerald-900/90!" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div 
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="fixed! top-20! right-4! z-50! bg-emerald-500! text-white! p-4! rounded-lg! shadow-lg! max-w-xs! flex! items-center! space-x-3!"
          >
            <Info className="w-5! h-5!" />
            <p className="text-sm!">Did you know? {foodWasteFacts[factsIndex]}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar Component */}
      <Navbar activeLink={activeLink} setActiveLink={setActiveLink} />

      {/* Main Content */}
      <main className="relative!">
        <div className="flex! flex-col! items-center! w-full!">
          {/* Hero Section */}
          <section ref={heroRef} className="w-full! min-h-screen! flex! items-center! justify-center! text-center!">
            <motion.div 
              style={{ opacity, scale }}
              className="max-w-7xl! mx-auto! px-4! sm:px-6! lg:px-8! py-16! relative!"
            >
              {userName ? (
                <div className="space-y-4!">
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-5xl! sm:text-6xl! md:text-7xl! font-bold! leading-tight! text-white!"
                  >
                    Welcome back, <span className="text-emerald-400! relative! inline-block!">
                      {userName}
                      <motion.span 
                        className="absolute! bottom-0! left-0! h-1! bg-emerald-400!"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                      />
                    </span>
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-xl! sm:text-2xl! text-emerald-100!"
                  >
                    Ready to make a difference today?
                  </motion.p>
                </div>
              ) : (
                <div className="h-16! w-64! mx-auto! bg-emerald-800/50! animate-pulse! rounded-lg!" />
              )}
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="relative! mt-8! mb-12! max-w-3xl! mx-auto!"
              >
                <p className="text-xl! sm:text-2xl! text-emerald-100! leading-relaxed!">
                  Together, we're creating a sustainable future by connecting surplus food
                  with those who need it most.
                </p>
                
                {/* Real-time food waste counter */}
                <div className="mt-8! p-4! bg-black/30! backdrop-blur-sm! rounded-xl! border! border-emerald-500/30!">
                  <p className="text-emerald-300! mb-2!">Food wasted since you opened this page:</p>
                  <FoodWasteCounter />
                </div>
              </motion.div>
              
              <motion.div 
                className="flex! flex-col! sm:flex-row! gap-4! justify-center! items-center! mt-8!"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection(featuresRef)}
                  className="inline-flex! items-center! px-8! py-4! bg-emerald-500! text-white! rounded-full! font-semibold! text-lg! hover:bg-emerald-600! transition-all! shadow-lg! hover:shadow-emerald-500/50!"
                >
                  See How It Works
                  <ChevronRight className="ml-2! w-5! h-5!" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection(impactRef)}
                  className="inline-flex! items-center! px-8! py-4! bg-transparent! text-white! border-2! border-white/30! rounded-full! font-semibold! text-lg! hover:bg-white/10! transition-all!"
                >
                  Learn Impact
                  <ArrowRight className="ml-2! w-5! h-5!" />
                </motion.button>
              </motion.div>
              
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8, type: "spring" }}
                className="absolute! bottom-10! left-1/2! -translate-x-1/2! animate-bounce! text-white!"
              >
                <ChevronDown className="w-8! h-8!" />
              </motion.div>
            </motion.div>
          </section>

          {/* Features Section */}
          <section ref={featuresRef} className="w-full! min-h-screen! flex! items-center! justify-center! py-16! sm:py-20! lg:py-24!">

            <div className="max-w-7xl! mx-auto! px-4! sm:px-6! lg:px-8!">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="text-center! mb-16!"
              >
                <span className="inline-block! px-3! py-1! bg-emerald-900/50! text-emerald-300! rounded-full! text-sm! font-medium! mb-4!">
                  WHAT WE OFFER
                </span>
                <h2 className="text-3xl! sm:text-4xl! lg:text-5xl! font-bold! text-white! mb-6!">
                  Key <span className="text-emerald-400! relative! inline-block!">Features
                    <motion.span 
                      className="absolute! bottom-0! left-0! h-1! bg-emerald-400!"
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                    />
                  </span>
                </h2>
                <p className="text-lg! text-emerald-100! max-w-3xl! mx-auto!">
                  Our platform provides comprehensive tools to maximize your impact and streamline the food donation process.
                </p>
              </motion.div>
              
          <DeliverySimulation/>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="grid! grid-cols-1! sm:grid-cols-2! lg:grid-cols-3! gap-6! lg:gap-8! w-full!"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    whileHover={{ y: -10, scale: 1.03 }}
                    className="bg-white/10! backdrop-blur-lg! rounded-2xl! p-6! sm:p-8! text-white! border! border-white/20! flex! flex-col! h-full! relative! overflow-hidden!"
                  >
                    <div className="absolute! -right-4! -top-4! w-24! h-24! rounded-full! bg-emerald-500/20! blur-2xl! z-0!" />
                    <div className="flex! flex-col! items-center! text-center! space-y-4! relative! z-10!">
                      <div className="p-3! rounded-full! bg-emerald-900/50! border! border-emerald-500/30!">
                        {feature.icon}
                      </div>
                      <h3 className="text-2xl! font-bold! text-white!">
                        {feature.title}
                      </h3>
                      <p className="text-emerald-100! text-base! lg:text-lg!">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Statistics Section */}
          <section ref={statsRef} className="w-full! py-16! sm:py-20!">
            <div className="max-w-7xl! mx-auto! px-4! sm:px-6! lg:px-8!">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-black/40! backdrop-blur-lg! rounded-3xl! p-6! sm:p-10! border! border-emerald-600/20! relative! overflow-hidden!"
              >
                <div className="absolute! -right-10! -top-10! w-40! h-40! rounded-full! bg-emerald-500/20! blur-3xl! z-0!" />
                <div className="absolute! -left-10! -bottom-10! w-40! h-40! rounded-full! bg-emerald-700/20! blur-3xl! z-0!" />
                
                <div className="relative! z-10!">
                  <h2 className="text-3xl! sm:text-4xl! font-bold! text-center! text-white! mb-12!">
                    The <span className="text-emerald-400!">Global Impact</span> of Food Waste
                  </h2>
                  
                  <div className="grid! grid-cols-1! sm:grid-cols-2! lg:grid-cols-4! gap-6! sm:gap-8!">
                    {impactStatistics.map((stat, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex! flex-col! items-center! justify-center! text-center! p-4! sm:p-6! bg-emerald-900/30! rounded-xl! border! border-emerald-500/20!"
                      >
                        {statsVisible && <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />}
                        <p className="text-emerald-100! text-sm! sm:text-base! mt-3!">
                          {stat.label}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Impact Facts Section */}
          <section ref={impactRef} className="w-full! min-h-screen! flex! items-center! justify-center! py-16! sm:py-20! lg:py-24!">
            <div className="max-w-7xl! mx-auto! px-4! sm:px-6! lg:px-8!">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="text-center! mb-16!"
              >
                <span className="inline-block! px-3! py-1! bg-emerald-900/50! text-emerald-300! rounded-full! text-sm! font-medium! mb-4!">
                  WHY IT MATTERS
                </span>
                <h2 className="text-3xl! sm:text-4xl! lg:text-5xl! font-bold! text-white! mb-6!">
                  Food Waste <span className="text-emerald-400! relative! inline-block!">Impact
                    <motion.span 
                      className="absolute! bottom-0! left-0! h-1! bg-emerald-400!"
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                    />
                  </span>
                </h2>
                <p className="text-lg! text-emerald-100! max-w-3xl! mx-auto!">
                  Understanding the far-reaching consequences of food waste is the first step toward creating meaningful change.
                </p>
              </motion.div>
              
              <div className="grid! grid-cols-1! lg:grid-cols-2! gap-8! lg:gap-12!">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="flex! flex-col! space-y-6!"
                >
                  {nutritionFacts.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white/10! backdrop-blur-lg! rounded-xl! p-6! text-white! border! border-white/20! flex! items-start! space-x-4!"
                    >
                      <div className="p-2! rounded-lg! bg-emerald-900/50! border! border-emerald-500/30! flex-shrink-0!">
                        {item.icon}
                      </div>
                      <div className="space-y-2!">
                        <h3 className="text-xl! font-bold! text-emerald-300!">
                          {item.title}
                        </h3>
                        <p className="text-emerald-100! text-base! lg:text-lg!">
                          {item.fact}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="bg-black/30! backdrop-blur-lg! rounded-3xl! p-6! lg:p-8! relative! border! border-emerald-500/30! h-full! flex! flex-col! justify-center!"
                >
                  <div className="absolute! -right-10! -top-10! w-40! h-40! rounded-full! bg-emerald-500/10! blur-3xl! z-0!" />
                  
                  <div className="relative! z-10! space-y-8!">
                    <h3 className="text-2xl! font-bold! text-white!">Tackling Food Waste Together</h3>
                    
                    <div className="space-y-4!">
                      <div className="flex! items-center! space-x-3!">
                        <div className="w-10! h-10! rounded-full! bg-emerald-500! flex! items-center! justify-center! text-white! font-bold!">1</div>
                        <p className="text-emerald-100! text-lg!">Every donation connects surplus food with people in need</p>
                      </div>
                      
                      <div className="flex! items-center! space-x-3!">
                        <div className="w-10! h-10! rounded-full! bg-emerald-500! flex! items-center! justify-center! text-white! font-bold!">2</div>
                        <p className="text-emerald-100! text-lg!">Our platform reduces CO₂ emissions by optimizing delivery routes</p>
                      </div>
                      
                      <div className="flex! items-center! space-x-3!">
                        <div className="w-10! h-10! rounded-full! bg-emerald-500! flex! items-center! justify-center! text-white! font-bold!">3</div>
                        <p className="text-emerald-100! text-lg!">Organizations save on disposal costs while helping communities</p>
                      </div>
                      
                      <div className="flex! items-center! space-x-3!">
                        <div className="w-10! h-10! rounded-full! bg-emerald-500! flex! items-center! justify-center! text-white! font-bold!">4</div>
                        <p className="text-emerald-100! text-lg!">Every 1kg of food saved prevents 4.2kg of CO₂ emissions</p>
                      </div>
                    </div>
                    
                    <div className="pt-4!">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex! items-center! px-6! py-3! bg-emerald-500! text-white! rounded-full! font-semibold! text-lg! hover:bg-emerald-600! transition-all! shadow-lg! hover:shadow-emerald-500/30!"
                      >
                        Join The Movement
                        <ArrowRight className="ml-2! w-5! h-5!" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Success Stories */}
          <section className="w-full! py-16! sm:py-20!">
  <div className="max-w-7xl! mx-auto! px-4! sm:px-6! lg:px-8!">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="text-center! mb-16!"
    >
      <span className="inline-block! px-3! py-1! bg-emerald-900/50! text-emerald-300! rounded-full! text-sm! font-medium! mb-4!">
        SUCCESS STORIES
      </span>
      <h2 className="text-3xl! sm:text-4xl! lg:text-5xl! font-bold! text-white! mb-6!">
        Making a <span className="text-emerald-400! relative! inline-block!">Difference
          <motion.span 
            className="absolute! bottom-0! left-0! h-1! bg-emerald-400!"
            initial={{ width: 0 }}
            whileInView={{ width: '100%' }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
          />
        </span>
      </h2>
      <p className="text-lg! text-emerald-100! max-w-3xl! mx-auto!">
        See how organizations like yours are creating positive change in their communities.
      </p>
    </motion.div>
    
    <div className="grid! grid-cols-1! md:grid-cols-3! gap-6! lg:gap-8!">
      {[
        {
          title: "Local Restaurant Chain",
          description: "Reduced weekly food waste by 75% while supporting three local shelters with fresh, nutritious meals.",
          impact: "2,500+ meals donated",
          image: "https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D"
        },
        {
          title: "Community Grocery Store",
          description: "Rescued over 5,000 pounds of produce in six months, providing fresh food to underserved communities.",
          impact: "85% waste reduction",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGMKXMVM7mNtAE4XIyxCue5xvVhDkePuJUJg&s"
        },
        {
          title: "University Dining Hall",
          description: "Implemented a campus-wide solution that converted 90% of potential food waste into donations.",
          impact: "10,000+ people served",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLUjpOlXXf1K5md8z4E-Z-9HfJysmzHrZQBw&s"
        }
      ].map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 + 0.3 }}
          whileHover={{ y: -10, scale: 1.03 }}
          className="bg-white/10! backdrop-blur-lg! rounded-2xl! p-6! text-white! border! border-white/20! flex! flex-col! h-full! relative! overflow-hidden!"
        >
          <div className="absolute! -right-4! -top-4! w-24! h-24! rounded-full! bg-emerald-500/20! blur-2xl! z-0!" />
                    <div className="space-y-4! relative! z-10!">
                      <div className="h-48! bg-blue-900/30! rounded-lg!  overflow-hidden!">
                      <img 
                src={item.image} 
                alt={item.title} 
                className="w-full! h-full! object-cover! object-center! rounded-lg!"
              />
                        <div className="w-full! h-full! bg-emerald-800/50! animate-pulse! rounded-lg!" />
                      </div> 
            <h3 className="text-xl! font-bold! text-white!">
              {item.title}
            </h3>
            <p className="text-emerald-100!">
              {item.description}
            </p>
            <p className="text-emerald-300! font-medium!">
              {item.impact}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>

          {/* CTA Section */}
          <section ref={ctaRef} className="w-full! py-16! sm:py-20!">
            <div className="max-w-7xl! mx-auto! px-4! sm:px-6! lg:px-8!">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="relative! overflow-hidden! rounded-3xl! border! border-emerald-500/30!"
              >
                <div className="absolute! inset-0! bg-gradient-to-br! from-emerald-600/20! to-emerald-900/90! z-0!" />
                
                <div className="relative! z-10! p-8! sm:p-12! lg:p-16! flex! flex-col! items-center! text-center!">
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-3xl! sm:text-4xl! lg:text-5xl! font-bold! text-white! mb-6!"
                  >
                    Ready to Make a Difference?
                  </motion.h2>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-xl! text-emerald-100! max-w-3xl! mb-8!"
                  >
                    Join thousands of organizations that are transforming surplus food into positive community impact.
                  </motion.p>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    className="flex! flex-col! sm:flex-row! gap-4! justify-center! items-center!"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex! items-center! px-8! py-4! bg-emerald-500! text-white! rounded-full! font-semibold! text-lg! hover:bg-emerald-600! transition-all! shadow-lg! hover:shadow-emerald-500/50!"
                    >
                      Start Donating Today
                      <ArrowRight className="ml-2! w-5! h-5!" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex! items-center! px-8! py-4! bg-white/10! text-white! border-2! border-white/30! rounded-full! font-semibold! text-lg! hover:bg-white/20! transition-all!"
                    >
                      Schedule Demo
                      <Clock className="ml-2! w-5! h-5!" />
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative! pt-16! pb-8! text-white! bg-black/50! backdrop-blur-lg! mt-12!">
        <div className="max-w-7xl! mx-auto! px-4! sm:px-6! lg:px-8!">
          <div className="grid! grid-cols-1! md:grid-cols-4! gap-8! mb-12!">
            <div className="col-span-1! md:col-span-2!">
              <h3 className="text-2xl! font-bold! mb-4! text-emerald-400!">FoodShare</h3>
              <p className="text-emerald-100! mb-6! max-w-sm!">
                Connecting surplus food with those who need it most. We're building a more sustainable and equitable food system, one donation at a time.
              </p>
              <div className="flex! space-x-4!">
                {['facebook', 'twitter', 'instagram', 'linkedin'].map((social, i) => (
                  <a key={i} href="#" className="p-2! bg-emerald-800/50! rounded-full! hover:bg-emerald-700/50! transition-all!">
                    <span className="sr-only!">{social}</span>
                    <div className="w-5! h-5! bg-emerald-300! rounded-full!" />
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg! font-semibold! mb-4! text-white!">Quick Links</h4>
              <ul className="space-y-2!">
                {['About Us', 'Features', 'Impact', 'Partners', 'Testimonials'].map((link, i) => (
                  <li key={i}>
                    <a href="#" className="text-emerald-100! hover:text-emerald-300! transition-colors!">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg! font-semibold! mb-4! text-white!">Resources</h4>
              <ul className="space-y-2!">
                {['Blog', 'Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service'].map((link, i) => (
                  <li key={i}>
                    <a href="#" className="text-emerald-100! hover:text-emerald-300! transition-colors!">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="pt-8! border-t! border-emerald-800/50! text-center! text-emerald-200! text-sm!">
            <p>&copy; {new Date().getFullYear()} FoodShare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Food Waste Counter Component
const FoodWasteCounter = () => {
  const [wasteTons, setWasteTons] = useState(0);
  
  useEffect(() => {
    // Global food waste is approx. 1.3 billion tons per year
    // Which is about 41.2 tons per second
    const interval = setInterval(() => {
      setWasteTons(prev => prev + 0.0412);
    }, 100);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex! justify-center! items-center! text-center!">
      <div className="text-3xl! sm:text-4xl! font-mono! font-bold! text-emerald-400!">
        {wasteTons.toFixed(2)} <span className="text-lg! sm:text-xl! text-emerald-200!">tons</span>
      </div>
    </div>
  );
};

export default HomePage;