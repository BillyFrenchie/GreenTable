import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Truck, MapPin, Package, Users, Heart, Smile, ArrowRight, 
  ChevronRight, Award, RotateCcw, Camera, Plus, Minus, Compass,
  Clock, Check, Utensils, Home, ArrowUp, Gift, Trees
} from 'lucide-react';

const DeliverySimulation = ({ delivery = {} }) => {
  // Core state
  const [viewMode, setViewMode] = useState('ar'); // 'map', 'ar', 'impact'
  const [simulationStage, setSimulationStage] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showImpact, setShowImpact] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [showAchievement, setShowAchievement] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [foodItems, setFoodItems] = useState([]);
  const [zoom, setZoom] = useState(1);
  const [arAngle, setArAngle] = useState(0);
  const [deliverySpeed, setDeliverySpeed] = useState(1);
  
  // Refs for interactions
  const mapRef = useRef(null);
  const arViewRef = useRef(null);
  
  // Dynamic calculations
  const initialServings = delivery?.servingSize ? parseInt(delivery.servingSize) || 4 : 4;
  const [impactMetrics, setImpactMetrics] = useState({
    peopleHelped: Math.floor(initialServings / 2),
    co2Saved: Math.round(initialServings * 0.7),
    caloriesProvided: initialServings * 550
  });

  // Define donation types with visual representations
  const donationTypes = [
    { id: 'vegetables', name: 'Fresh Vegetables', color: 'bg-green-500', icon: '🥦' },
    { id: 'fruit', name: 'Fruits', color: 'bg-orange-400', icon: '🍎' },
    { id: 'grains', name: 'Grains & Pasta', color: 'bg-yellow-500', icon: '🌾' },
    { id: 'protein', name: 'Protein', color: 'bg-red-400', icon: '🥩' },
    { id: 'dairy', name: 'Dairy', color: 'bg-blue-300', icon: '🥛' }
  ];

  // Define route waypoints for more realistic delivery
  const waypoints = [
    { id: 1, name: 'Donor Location', position: { x: 10, y: 50 } },
    { id: 2, name: 'Pickup', position: { x: 25, y: 40 } },
    { id: 3, name: 'Distribution Center', position: { x: 50, y: 60 } },
    { id: 4, name: 'In Transit', position: { x: 75, y: 45 } },
    { id: 5, name: 'Recipient Location', position: { x: 90, y: 50 } }
  ];

  // Calculate truck position based on simulation stage
  const getTruckPosition = () => {
    if (!isSimulating) return waypoints[0].position;
    
    const progressPercentage = (simulationStage / 3) * 100;
    
    // Find current and next waypoints
    const currentWaypointIndex = Math.min(
      Math.floor((progressPercentage / 100) * (waypoints.length - 1)),
      waypoints.length - 2
    );
    
    const currentWaypoint = waypoints[currentWaypointIndex];
    const nextWaypoint = waypoints[currentWaypointIndex + 1];
    
    // Calculate progress between these two waypoints
    const segmentSize = 100 / (waypoints.length - 1);
    const segmentProgress = (progressPercentage % segmentSize) / segmentSize;
    
    // Interpolate position
    return {
      x: currentWaypoint.position.x + (nextWaypoint.position.x - currentWaypoint.position.x) * segmentProgress,
      y: currentWaypoint.position.y + (nextWaypoint.position.y - currentWaypoint.position.y) * segmentProgress
    };
  };

  // Initialize food items
  useEffect(() => {
    const items = [];
    const types = Object.keys(donationTypes);
    
    // Create 3-5 random food items
    const itemCount = Math.floor(Math.random() * 3) + 3;
    
    for (let i = 0; i < itemCount; i++) {
      const typeIndex = Math.floor(Math.random() * types.length);
      const type = donationTypes[typeIndex];
      
      items.push({
        id: `item-${i}`,
        type: type.id,
        name: type.name,
        quantity: Math.floor(Math.random() * 3) + 1,
        icon: type.icon,
        color: type.color
      });
    }
    
    setFoodItems(items);
  }, []);

  // Stages with detailed information
  const stages = [
    {
      title: "Preparing Your Donation",
      description: "Carefully packaging nutritious food items for delivery",
      icon: <Package className="w-8 h-8 text-amber-500" />,
      bg: "bg-amber-50",
      details: "Volunteers are sorting and packing your donation with care",
      arObjects: ['package', 'food'],
    },
    {
      title: "En Route",
      description: "Our eco-friendly delivery partner is on the way",
      icon: <Truck className="w-8 h-8 text-blue-500" />,
      bg: "bg-blue-50",
      details: "Tracking your donation in real-time as it makes its journey",
      arObjects: ['truck', 'route'],
    },
    {
      title: "Almost There",
      description: "Just minutes away from the destination",
      icon: <MapPin className="w-8 h-8 text-green-500" />,
      bg: "bg-green-50",
      details: "Your donation will soon reach those who need it most",
      arObjects: ['location', 'people'],
    },
    {
      title: "Delivery Complete",
      description: "Your food donation has been successfully delivered!",
      icon: <Check className="w-8 h-8 text-emerald-500" />,
      bg: "bg-emerald-50",
      details: "Creating positive impact in your community",
      arObjects: ['celebration', 'impact'],
    },
  ];
  
  // Weather effects for AR view
  const weatherEffects = {
    raindrops: Array(20).fill().map((_, i) => ({
      id: `rain-${i}`,
      x: Math.random() * 100,
      y: -10 - (Math.random() * 10),
      size: Math.random() * 3 + 1
    })),
    sunbeams: Array(5).fill().map((_, i) => ({
      id: `sun-${i}`,
      rotation: i * 72,
      opacity: 0.4 + (Math.random() * 0.4)
    }))
  };

  // Achievements system
  const possibleAchievements = [
    { id: 'first_donation', title: 'First Steps', description: 'Complete your first donation', icon: '🌱' },
    { id: 'speedy_delivery', title: 'Speed Demon', description: 'Delivery completed in record time', icon: '⚡' },
    { id: 'eco_friendly', title: 'Planet Saver', description: 'Saved 5kg of CO2 emissions', icon: '🌍' },
    { id: 'nutritionist', title: 'Balanced Diet', description: 'Donated a balanced meal with all food groups', icon: '🥗' },
    { id: 'community_helper', title: 'Community Champion', description: 'Helped feed 10+ people', icon: '🏆' },
  ];

  // Handle simulation start
  const startSimulation = () => {
    setIsSimulating(true);
    setSimulationStage(0);
    setShowTutorial(false);
    
    // Progressive simulation with dynamic speed
    const interval = setInterval(() => {
      setSimulationStage(prev => {
        if (prev >= stages.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            setShowImpact(true);
            checkForAchievements();
          }, 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 3000 / deliverySpeed);
  };

  // Reset the simulation
  const resetSimulation = () => {
    setIsSimulating(false);
    setShowImpact(false);
    setSimulationStage(0);
    setViewMode('map');
    setZoom(1);
    setArAngle(0);
  };

  // Check and award achievements
  const checkForAchievements = () => {
    const newAchievements = [];
    
    // First donation achievement
    if (!achievements.find(a => a.id === 'first_donation')) {
      newAchievements.push(possibleAchievements.find(a => a.id === 'first_donation'));
    }
    
    // Eco-friendly achievement
    if (impactMetrics.co2Saved >= 5) {
      const ecoAchievement = possibleAchievements.find(a => a.id === 'eco_friendly');
      if (!achievements.find(a => a.id === 'eco_friendly')) {
        newAchievements.push(ecoAchievement);
      }
    }
    
    // Community helper achievement
    if (impactMetrics.peopleHelped >= 10) {
      const communityAchievement = possibleAchievements.find(a => a.id === 'community_helper');
      if (!achievements.find(a => a.id === 'community_helper')) {
        newAchievements.push(communityAchievement);
      }
    }
    
    // Check if we have all food groups
    const foodGroups = foodItems.map(item => item.type);
    const uniqueGroups = [...new Set(foodGroups)];
    
    if (uniqueGroups.length >= 4) {
      const nutritionistAchievement = possibleAchievements.find(a => a.id === 'nutritionist');
      if (!achievements.find(a => a.id === 'nutritionist')) {
        newAchievements.push(nutritionistAchievement);
      }
    }
    
    // Speed achievement
    if (deliverySpeed >= 2) {
      const speedAchievement = possibleAchievements.find(a => a.id === 'speedy_delivery');
      if (!achievements.find(a => a.id === 'speedy_delivery')) {
        newAchievements.push(speedAchievement);
      }
    }
    
    // If new achievements, show notification and update state
    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
      setTimeout(() => {
        setShowAchievement(newAchievements[0]);
        setTimeout(() => setShowAchievement(false), 3000);
      }, 2000);
    }
  };

  // Handle AR view interactions
  const handleARInteraction = (e) => {
    if (!arViewRef.current || !isSimulating) return;
    
    const rect = arViewRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Change AR view angle based on click/touch position
    const centerX = rect.width / 2;
    const angleChange = ((x - centerX) / centerX) * 30;
    setArAngle(prev => Math.max(-45, Math.min(45, prev + angleChange)));
  };
  
  // Zoom control handlers
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.75));
  
  // Speed control handler
  const handleSpeedChange = (speed) => setDeliverySpeed(speed);

  // Share feature
  const handleShare = () => {
    // In a real implementation, this would generate a shareable link
    alert("Sharing your donation journey! (This would open a share dialog in a real app)");
  };

  // Custom hook for handling device orientation (would need permissions in a real app)
  useEffect(() => {
    const handleOrientation = (event) => {
      if (viewMode === 'ar' && event.gamma) {
        // Use device orientation to change AR angle
        const newAngle = Math.max(-45, Math.min(45, event.gamma));
        setArAngle(newAngle);
      }
    };
    
    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [viewMode]);

  // Truck position animation
  const truckPosition = getTruckPosition();

  return (
    <div className="w-full h-full min-h-[400px] md:min-h-[500px] lg:min-h-[600px] bg-white rounded-xl overflow-hidden border border-gray-200 shadow-lg relative">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700">Live Tracking</span>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setViewMode('map')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${viewMode === 'map' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Map
          </button>
          <button 
            onClick={() => setViewMode('ar')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${viewMode === 'ar' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            AR View
          </button>
          <button 
            onClick={() => setViewMode('impact')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${viewMode === 'impact' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Impact
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-xs text-gray-500">
            {isSimulating ? `${Math.floor(simulationStage * 5)} min` : '0 min'}
          </span>
        </div>
      </div>
      
      {/* Main Viewport - Map View */}
      {viewMode === 'map' && (
        <div 
          ref={mapRef}
          className="relative h-64 sm:h-80 md:h-96 bg-blue-50 overflow-hidden"
          style={{transform: `scale(${zoom})`}}
        >
          {/* Map Background with Roads */}
          <div className="absolute inset-0 bg-blue-50">
            {/* Main road */}
            <div className="absolute top-1/2 left-0 w-full h-6 bg-gray-200 transform -translate-y-1/2"></div>
            
            {/* Crossing roads */}
            <div className="absolute top-0 left-1/4 w-6 h-full bg-gray-200"></div>
            <div className="absolute top-0 left-3/4 w-6 h-full bg-gray-200"></div>
            
            {/* Buildings */}
            {Array(12).fill().map((_, i) => (
              <div 
                key={`building-${i}`}
                className="absolute bg-gray-300 rounded-md opacity-70"
                style={{
                  width: `${20 + Math.random() * 30}px`,
                  height: `${20 + Math.random() * 30}px`,
                  top: `${10 + Math.random() * 80}%`,
                  left: `${5 + Math.random() * 90}%`,
                  transform: `rotate(${Math.random() * 5}deg)`,
                  display: (i === 3 || i === 8) ? 'none' : 'block' // Make space for waypoints
                }}
              ></div>
            ))}
            
            {/* Trees */}
            {Array(8).fill().map((_, i) => (
              <div 
                key={`tree-${i}`}
                className="absolute"
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `${10 + Math.random() * 80}%`,
                }}
              >
                <Trees className="w-6 h-6 text-green-600" />
              </div>
            ))}
          </div>
          
          {/* Route line */}
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
          
            {/* Draw route between waypoints */}
            <path 
              d={`M ${waypoints.map(wp => `${wp.position.x}% ${wp.position.y}%`).join(' L ')}`}
              stroke="#c2c2c2"
              strokeWidth="5"
              fill="none"
            />
            
            {/* Animated progress path */}
            <motion.path 
              d={`M ${waypoints.map(wp => `${wp.position.x}% ${wp.position.y}%`).join(' L ')}`}
              stroke="#4ade80"
              strokeWidth="5"
              fill="none"
              filter="url(#glow)"
              strokeDasharray="1000"
              initial={{ strokeDashoffset: 1000 }}
              animate={{ 
                strokeDashoffset: isSimulating ? 1000 - (simulationStage / (stages.length - 1)) * 1000 : 1000 
              }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          </svg>
          
          {/* Waypoints */}
          {waypoints.map((waypoint, index) => (
            <div 
              key={waypoint.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center`}
              style={{ 
                left: `${waypoint.position.x}%`, 
                top: `${waypoint.position.y}%`,
                opacity: isSimulating ? 1 : index === 0 || index === waypoints.length - 1 ? 1 : 0.5
              }}
            >
              <div className={`w-4 h-4 rounded-full ${
                simulationStage >= (index / (waypoints.length - 1)) * (stages.length - 1) && isSimulating
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              }`}></div>
              <span className="text-xs font-medium mt-1 text-gray-700">{waypoint.name}</span>
            </div>
          ))}
          
          {/* Delivery truck */}
          <motion.div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
            animate={{ 
              left: `${truckPosition.x}%`,
              top: `${truckPosition.y}%`,
              rotate: isSimulating ? [0, 5, 0, -5, 0] : 0
            }}
            transition={{ 
              duration: 1, 
              ease: "easeInOut",
              rotate: { repeat: Infinity, duration: 0.5 }
            }}
          >
            <div className="relative">
              <Truck className="w-10 h-10 text-blue-600" />
              
              {/* Signal waves animation */}
              {isSimulating && (
                <>
                  <motion.div 
                    className="absolute inset-0 w-10 h-10 border-2 border-blue-500 rounded-full opacity-50"
                    animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                  ></motion.div>
                  <motion.div 
                    className="absolute inset-0 w-10 h-10 border-2 border-blue-500 rounded-full opacity-50"
                    animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                    transition={{ delay: 0.5, duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                  ></motion.div>
                </>
              )}
            </div>
          </motion.div>
          
          {/* Start and end markers */}
          <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${waypoints[0].position.x}%`, top: `${waypoints[0].position.y}%` }}
          >
            <Home className="w-6 h-6 text-amber-500" />
          </div>
          
          <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${waypoints[waypoints.length - 1].position.x}%`, top: `${waypoints[waypoints.length - 1].position.y}%` }}
          >
            <Users className="w-6 h-6 text-emerald-500" />
          </div>
          
          {/* Food items floating animation */}
          {isSimulating && foodItems.map((item, index) => (
            <motion.div
              key={item.id}
              className="absolute z-20"
              style={{ 
                left: `${truckPosition.x + (index * 5) - 10}%`, 
                top: `${truckPosition.y - 10}%` 
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: index * 0.5,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              <div className="text-xl">{item.icon}</div>
            </motion.div>
          ))}
          
          {/* Map Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col space-y-2 bg-white/80 p-2 rounded-lg backdrop-blur-sm">
            <button 
              onClick={handleZoomIn}
              className="w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-100"
            >
              <Plus className="w-4 h-4 text-gray-700" />
            </button>
            <button 
              onClick={handleZoomOut}
              className="w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-100"
            >
              <Minus className="w-4 h-4 text-gray-700" />
            </button>
          </div>
          
          {/* Weather Effect - Sun or Rain based on delivery progress */}
          {isSimulating && simulationStage > 1 && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {simulationStage === 3 ? (
                // Sunshine effect for completed delivery
                weatherEffects.sunbeams.map(beam => (
                  <motion.div
                    key={beam.id}
                    className="absolute top-0 right-0 origin-top-right bg-yellow-300"
                    style={{
                      height: '150%',
                      width: '2px',
                      opacity: beam.opacity,
                      rotate: beam.rotation
                    }}
                    animate={{
                      opacity: [beam.opacity, beam.opacity + 0.2, beam.opacity]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                ))
              ) : (
                // Light rain effect for en-route
                weatherEffects.raindrops.map(drop => (
                  <motion.div
                    key={drop.id}
                    className="absolute bg-blue-400 rounded-full"
                    style={{
                      left: `${drop.x}%`,
                      top: `${drop.y}%`,
                      width: `${drop.size}px`,
                      height: `${drop.size * 3}px`,
                      opacity: 0.4
                    }}
                    animate={{
                      y: ['0%', '120%'],
                      opacity: [0.4, 0.6, 0]
                    }}
                    transition={{
                      duration: 1 + Math.random(),
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                ))
              )}
            </div>
          )}
        </div>
      )}
      
      {/* AR View */}
      {viewMode === 'ar' && (
        <div 
          ref={arViewRef}
          className="relative h-64 sm:h-80 md:h-96 bg-gradient-to-b from-blue-400 to-blue-600 overflow-hidden cursor-move"
          onClick={handleARInteraction}
          style={{
            perspective: '1000px',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* AR Guidance */}
          {!isSimulating && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm text-white text-center p-4">
              <div>
                <Camera className="w-12 h-12 mx-auto mb-3 text-white" />
                <h3 className="text-xl font-bold">AR View</h3>
                <p className="mt-2">Start the simulation to see food delivery in augmented reality</p>
                <p className="text-sm mt-4 opacity-80">Click or move device to change perspective</p>
              </div>
            </div>
          )}
          
          {/* AR Environment */}
          {isSimulating && (
            <div 
              className="relative h-full w-full transform-gpu"
              style={{
                transform: `rotateY(${arAngle}deg)`,
                transition: 'transform 0.5s ease-out'
              }}
            >
              {/* Ground plane with grid */}
              <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-gray-800 to-transparent">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}></div>
              </div>
              
              {/* Street */}
              <div className="absolute bottom-0 left-0 w-full h-20 bg-gray-700">
                <div className="absolute top-1/2 left-0 w-full h-2 bg-yellow-400 dash-line"></div>
              </div>
              
              {/* Buildings in background */}
              <div className="absolute bottom-20 left-0 w-full flex justify-around">
                {Array(5).fill().map((_, i) => (
                  <div
                    key={`building-ar-${i}`}
                    className="w-24 bg-gray-800 relative"
                    style={{
                      height: `${80 + Math.random() * 120}px`,
                      transform: `translateZ(${-200 - i * 50}px) translateX(${(i - 2) * 150}px)`
                    }}
                  >
                    {/* Windows */}
                    {Array(6).fill().map((_, j) => (
                      <div
                        key={`window-${i}-${j}`}
                        className="absolute w-4 h-4 bg-yellow-300"
                        style={{
                          left: `${5 + (j % 3) * 8}px`,
                          top: `${5 + Math.floor(j / 3) * 20}px`,
                          opacity: Math.random() > 0.3 ? 0.8 : 0
                        }}
                      ></div>
                    ))}
                  </div>
                ))}
              </div>
              
              {/* 3D Truck */}
              <motion.div
                className="absolute"
                style={{
                  bottom: '20px',
                  left: `${simulationStage * 25}%`,
                  transform: `scale(${1 + (simulationStage === 3 ? 0.2 : 0)})`,
                  zIndex: 10
                }}
                animate={{
                  y: simulationStage < 3 ? [0, -5, 0] : 0
                }}
                transition={{
                  y: { duration: 0.5, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <div className="w-20 h-12 relative">
                  {/* Truck Body */}
                  <div className="absolute inset-0 bg-blue-600 rounded-md shadow-lg" style={{
                    clipPath: 'polygon(0% 50%, 30% 50%, 30% 0%, 100% 0%, 100% 100%, 0% 100%)'
                  }}></div>
                  
                  {/* Cab window */}
                  <div className="absolute top-1 left-1 w-6 h-4 bg-cyan-300 rounded-sm"></div>
                  
                  {/* Wheels */}
                  <motion.div 
                    className="absolute bottom-0 left-2 w-4 h-4 bg-gray-800 rounded-full border-2 border-gray-400"
                    animate={{ rotateZ: simulationStage < 3 ? [0, 360] : 0 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  ></motion.div>
                  <motion.div 
                    className="absolute bottom-0 right-2 w-4 h-4 bg-gray-800 rounded-full border-2 border-gray-400"
                    animate={{ rotateZ: simulationStage < 3 ? [0, 360] : 0 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  ></motion.div>
                  
                  {/* Logo */}
                  <div className="absolute top-2 right-2 w-8 h-3 bg-white rounded-sm flex items-center justify-center">
                    <Heart className="w-2 h-2 text-emerald-500" />
                  </div>
                </div>
                
                {/* Food particles effect when at destination */}
                {simulationStage === 3 && (
                  <div className="absolute inset-0">
                    {foodItems.map((item, i) => (
                      <motion.div
                        key={`food-particle-${i}`}
                        className="absolute left-1/2 top-1/2 text-lg"
                        initial={{ x: 0, y: 0, opacity: 0 }}
                        animate={{ 
                          x: (i % 2 === 0 ? 1 : -1) * (20 + (i * 10)), 
                          y: -30 - (i * 5), 
                          opacity: [0, 1, 0] 
                        }}
                        transition={{ 
                          duration: 2,
                          delay: i * 0.2,
                          repeat: Infinity,
                          repeatDelay: 1
                        }}
                      >
                        {item.icon}
                      </motion.div>
                    ))}
                  </div>
                )}
                
                {/* Light beam */}
                {simulationStage > 0 && simulationStage < 3 && (
                  <motion.div
                    className="absolute top-1 right-0 w-4 h-12 bg-yellow-300"
                    style={{
                      transformOrigin: 'top right',
                      transform: 'rotateZ(-30deg)',
                      opacity: 0.7,
                      filter: 'blur(2px)'
                    }}
                    animate={{ opacity: [0.7, 0.9, 0.7] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  ></motion.div>
                )}
              </motion.div>
              
              {/* People at destination */}
              {simulationStage >= 2 && (
                <div className="absolute bottom-20 right-10">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="flex space-x-2"
                  >
                    {/* Simplified people figures */}
                    {Array(3).fill().map((_, i) => (
                      <div 
                        key={`person-${i}`}
                        className="relative"
                      >
                        <div className="w-6 h-6 rounded-full bg-indigo-400"></div>
                        <div className="w-4 h-8 bg-indigo-500 mt-1 mx-auto rounded-md"></div>
                        <motion.div
                          animate={{ 
                            rotateZ: simulationStage === 3 ? [-5, 5, -5] : 0,
                            y: simulationStage === 3 ? [0, -3, 0] : 0
                          }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="absolute top-3 w-full flex justify-center"
                        >
                          {simulationStage === 3 && (
                            <Heart className="w-3 h-3 text-pink-500 fill-pink-500" />
                          )}
                        </motion.div>
                      </div>
                    ))}
                  </motion.div>
                </div>
              )}
              
              {/* AR completion celebration */}
              {simulationStage === 3 && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Confetti effect */}
                  {Array(20).fill().map((_, i) => (
                    <motion.div
                      key={`confetti-${i}`}
                      className="absolute w-2 h-2 rounded-full"
                      style={{ 
                        left: `${Math.random() * 100}%`,
                        top: '-10px',
                        backgroundColor: `hsl(${Math.random() * 360}, 80%, 60%)`
                      }}
                      animate={{
                        y: ['0vh', '100vh'],
                        x: [0, (Math.random() - 0.5) * 100],
                        rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)]
                      }}
                      transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 3
                      }}
                    />
                  ))}
                </div>
              )}
              
              {/* AR Interaction hint */}
              <div className="absolute bottom-4 left-4 bg-white/30 backdrop-blur-sm rounded-full p-2">
                <Compass className="w-5 h-5 text-white" />
              </div>
              
              {/* AR Objects for each stage */}
              {stages[simulationStage].arObjects.map((obj, i) => {
                if (obj === 'package' && simulationStage === 0) {
                  return (
                    <motion.div
                      key={`ar-obj-${obj}-${i}`}
                      className="absolute bottom-20 left-20"
                      animate={{ 
                        y: [0, -5, 0],
                        rotateY: [0, 180, 360]
                      }}
                      transition={{ 
                        y: { duration: 2, repeat: Infinity },
                        rotateY: { duration: 5, repeat: Infinity }
                      }}
                    >
                      <Package className="w-10 h-10 text-amber-400" />
                    </motion.div>
                  );
                }
                if (obj === 'food' && simulationStage === 0) {
                  return foodItems.map((item, idx) => (
                    <motion.div
                      key={`food-item-${idx}`}
                      className="absolute"
                      style={{ 
                        bottom: `${30 + (idx * 10)}px`, 
                        left: `${30 + (idx * 15)}px`,
                        zIndex: 5 - idx
                      }}
                      animate={{
                        y: [0, -8, 0],
                        rotate: [0, 5, 0, -5, 0]
                      }}
                      transition={{
                        duration: 3,
                        delay: idx * 0.2,
                        repeat: Infinity
                      }}
                    >
                      <div className="text-2xl">{item.icon}</div>
                    </motion.div>
                  ));
                }
                if (obj === 'route' && simulationStage === 1) {
                  return (
                    <motion.div
                      key={`ar-obj-${obj}-${i}`}
                      className="absolute bottom-20 left-0 w-full h-1 bg-emerald-400"
                      initial={{ width: '0%', opacity: 0.7 }}
                      animate={{ 
                        width: '100%',
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{ 
                        width: { duration: 2 },
                        opacity: { duration: 1.5, repeat: Infinity }
                      }}
                    />
                  );
                }
                if (obj === 'location' && simulationStage === 2) {
                  return (
                    <motion.div
                      key={`ar-obj-${obj}-${i}`}
                      className="absolute bottom-40 right-20"
                      animate={{
                        y: [0, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity
                      }}
                    >
                      <div className="relative">
                        <MapPin className="w-12 h-12 text-red-500" />
                        <motion.div
                          className="absolute inset-0 w-12 h-12 border-2 border-red-500 rounded-full opacity-60"
                          animate={{ scale: [1, 2], opacity: [0.6, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </div>
                    </motion.div>
                  );
                }
                if (obj === 'impact' && simulationStage === 3) {
                  return (
                    <motion.div
                      key={`ar-obj-${obj}-${i}`}
                      className="absolute top-10 left-1/2 transform -translate-x-1/2"
                      initial={{ y: -50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 1, delay: 0.5 }}
                    >
                      <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-lg text-center">
                        <Heart className="w-8 h-8 text-pink-500 fill-pink-500 mx-auto" />
                        <div className="mt-2 font-bold text-emerald-700">
                          {impactMetrics.peopleHelped} people helped
                        </div>
                      </div>
                    </motion.div>
                  );
                }
                return null;
              })}
            </div>
          )}
          
          {/* AR Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
            <button 
              onClick={() => setArAngle(prev => prev - 15)}
              className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full shadow flex items-center justify-center hover:bg-white"
            >
              <ChevronRight className="w-4 h-4 text-gray-700 rotate-180" />
            </button>
            <button 
              onClick={() => setArAngle(prev => prev + 15)}
              className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full shadow flex items-center justify-center hover:bg-white"
            >
              <ChevronRight className="w-4 h-4 text-gray-700" />
            </button>
            <button 
              onClick={() => setArAngle(0)}
              className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full shadow flex items-center justify-center hover:bg-white"
            >
              <RotateCcw className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        </div>
      )}
      
      {/* Impact View */}
      {viewMode === 'impact' && (
        <div className="relative h-64 sm:h-80 md:h-96 bg-gradient-to-br from-emerald-50 to-emerald-100 overflow-hidden">
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4">
            {!isSimulating ? (
              <div>
                <Gift className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800">Donation Impact</h3>
                <p className="text-gray-600 mt-2">
                  Start the simulation to see the impact of your donation
                </p>
              </div>
            ) : (
              <div className="w-full max-w-md">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Heart className="w-12 h-12 text-pink-500 fill-pink-500 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Impact</h3>
                </motion.div>
                
                {/* Impact Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div 
                    className="bg-white p-4 rounded-xl shadow-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-gray-800 text-center">
                      {impactMetrics.peopleHelped}
                    </div>
                    <div className="text-sm text-gray-500 text-center">People Helped</div>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-white p-4 rounded-xl shadow-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Trees className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-gray-800 text-center">
                      {impactMetrics.co2Saved}kg
                    </div>
                    <div className="text-sm text-gray-500 text-center">CO2 Emissions Saved</div>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-white p-4 rounded-xl shadow-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <Utensils className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-gray-800 text-center">
                      {impactMetrics.caloriesProvided}
                    </div>
                    <div className="text-sm text-gray-500 text-center">Calories Provided</div>
                  </motion.div>
                </div>
                
                {/* Food Items Donated */}
                <motion.div
                  className="mt-6 bg-white p-4 rounded-xl shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <h4 className="font-bold text-gray-700 mb-3">Food Items Donated</h4>
                  <div className="flex flex-wrap gap-2">
                    {foodItems.map(item => (
                      <div 
                        key={item.id}
                        className={`${item.color} px-3 py-1 rounded-full text-white flex items-center space-x-1`}
                      >
                        <span>{item.icon}</span>
                        <span className="text-sm">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
                
                {/* Achievements */}
                {achievements.length > 0 && (
                  <motion.div
                    className="mt-6 bg-white p-4 rounded-xl shadow-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <h4 className="font-bold text-gray-700 mb-3">Achievements Unlocked</h4>
                    <div className="flex flex-wrap gap-2">
                      {achievements.map(achievement => (
                        <div 
                          key={achievement.id}
                          className="bg-amber-100 border border-amber-300 px-3 py-1 rounded-full text-amber-800 flex items-center space-x-1"
                        >
                          <span>{achievement.icon}</span>
                          <span className="text-sm">{achievement.title}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
                
                {/* Share Button */}
                <motion.button
                  className="mt-6 w-full py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                  onClick={handleShare}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <span>Share Your Impact</span>
                  <ArrowUp className="w-4 h-4" />
                </motion.button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Bottom Controls */}
      <div className="bg-white border-t border-gray-200 p-4">
        {!isSimulating ? (
          <div className="text-center space-y-4">
            {/* Tutorial */}
            {showTutorial && (
              <div className="bg-blue-50 p-3 rounded-lg text-blue-800 mb-4 text-sm">
                <p>Experience the journey of your food donation and see its impact on communities in need.</p>
                <div className="flex items-center justify-center space-x-4 mt-3 text-xs">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" /> <span>Track route</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Camera className="w-4 h-4" /> <span>AR view</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" /> <span>See impact</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Donation Summary */}
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
              <div className="text-left">
                <div className="text-sm text-gray-500">Your donation</div>
                <div className="font-medium">{foodItems.length} items</div>
              </div>
              <div className="flex">
                {foodItems.slice(0, 3).map((item, i) => (
                  <div 
                    key={`summary-${i}`}
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center -ml-2 first:ml-0 border-2 border-white"
                    style={{ zIndex: 10 - i }}
                  >
                    <div className="text-lg">{item.icon}</div>
                  </div>
                ))}
                {foodItems.length > 3 && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 shadow-sm flex items-center justify-center -ml-2 border-2 border-white text-xs font-medium">
                    +{foodItems.length - 3}
                  </div>
                )}
              </div>
            </div>
            
            {/* Start Button */}
            <button
              onClick={startSimulation}
              className="w-full py-3 !bg-emerald-500 text-white rounded-lg font-bold hover:!bg-emerald-600 transition-colors shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
            >
              <Truck className="w-5 h-5" />
              <span>Start Delivery Simulation</span>
            </button>
          </div>
        ) : (
          <div>
            {showImpact ? (
              <button
                onClick={resetSimulation}
                className="w-full py-3 !bg-blue-500 text-white rounded-lg font-medium hover:!bg-blue-600 transition-colors shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Simulate Another Delivery</span>
              </button>
            ) : (
              <div className="space-y-4">
                {/* Current stage info */}
                <div className={`p-4 rounded-lg ${stages[simulationStage].bg} transition-colors duration-500`}>
                  <div className="flex items-center space-x-3">
                    {stages[simulationStage].icon}
                    <div>
                      <h4 className="font-bold text-gray-800">{stages[simulationStage].title}</h4>
                      <p className="text-sm text-gray-600">{stages[simulationStage].description}</p>
                      <p className="text-xs text-gray-500 mt-1">{stages[simulationStage].details}</p>
                    </div>
                  </div>
                </div>
                
                {/* Progress indicator */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${(simulationStage + 1) * 25}%` }}
                  />
                </div>
                
                {/* Speed Controls */}
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">Simulation Speed</div>
                  <div className="flex space-x-2">
                    {[1, 1.5, 2].map(speed => (
                      <button
                        key={`speed-${speed}`}
                        onClick={() => handleSpeedChange(speed)}
                        className={`px-3 py-1 text-xs rounded ${
                          deliverySpeed === speed 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {speed === 1 ? '1x' : speed === 1.5 ? '1.5x' : '2x'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Achievement Notification */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 flex items-center space-x-3 z-50 pointer-events-none"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-xl">
              {showAchievement.icon}
            </div>
            <div>
              <div className="text-xs text-amber-600 font-medium">Achievement Unlocked!</div>
              <div className="font-bold text-gray-800">{showAchievement.title}</div>
              <div className="text-xs text-gray-500">{showAchievement.description}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeliverySimulation;