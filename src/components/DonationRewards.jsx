import { useState, useEffect, useRef } from 'react';
import React from 'react'; // Even with React 17+, this may still be necessary depending on tooling

import { 
  Trophy, Truck, Heart, Gift, ChevronUp, ChevronDown, Star, Award, 
  Users, TreePalm, Leaf, Calendar, MapPin, ArrowUp, ThumbsUp, 
  Clock, Share2, UserPlus, Sparkles, Utensils, Coffee
} from 'lucide-react';

// Mock data for donation tiers with enhanced details
const tiers = [
  { 
    level: 1, 
    name: "Seed Planter", 
    threshold: 10,
    color: "#4ade80", // green-400
    description: "Your first step to fighting hunger in our community. Every meal counts!",
    benefits: [
      "Digital sustainability badge", 
      "Personalized thank you email",
      "Impact updates newsletter"
    ],
    icon: Leaf,
    impact: "Your donations at this level provide essential breakfast to children in need."
  },
  { 
    level: 2, 
    name: "Growth Nurturer", 
    threshold: 25,
    color: "#16a34a", // green-600
    description: "You're making a significant difference in our community's food security.",
    benefits: [
      "Personalized thank you card", 
      "Name on our digital donor wall",
      "Exclusive donor newsletter",
      "Early access to volunteer events"
    ],
    icon: TreePalm,
    impact: "You're helping provide fresh produce to families facing food insecurity."
  },
  { 
    level: 3, 
    name: "Harvest Provider", 
    threshold: 50,
    color: "#059669", // green-700
    description: "Your generosity is creating real change for hungry families in our area.",
    benefits: [
      "Limited edition sustainable tote bag", 
      "10% off at partner restaurants",
      "Donor spotlight opportunity",
      "Quarterly impact reports"
    ],
    icon: Truck,
    impact: "Your contributions help us distribute meals to homebound seniors and disabled individuals."
  },
  { 
    level: 4, 
    name: "Community Champion", 
    threshold: 100,
    color: "#047857", // green-800
    description: "You're a vital part of our mission to ensure no one goes hungry.",
    benefits: [
      "Invitation to exclusive donor events", 
      "Personalized impact report",
      "Featured donor spotlight",
      "Community garden dedication opportunity",
      "Early access to tickets for fundraisers"
    ],
    icon: Users,
    impact: "At this level, you're helping us operate food distribution centers in underserved neighborhoods."
  },
  { 
    level: 5, 
    name: "Sustainability Guardian", 
    threshold: 250,
    color: "#064e3b", // green-900
    description: "Your extraordinary commitment is transforming our community's fight against hunger.",
    benefits: [
      "Recognition plaque", 
      "VIP access to all organization events",
      "Personal tour of our facilities",
      "Annual dinner with our executive team",
      "Custom impact project opportunity",
      "Legacy donor recognition"
    ],
    icon: Trophy,
    impact: "Your generous support helps us implement sustainable food programs that create lasting change in our community."
  }
];

// Impact stories
const impactStories = [
  {
    name: "Sarah's Family",
    quote: "The meals provided by donors like you helped us through the hardest time of our lives. We couldn't be more grateful.",
    location: "Eastside Community",
    avatar: "/api/placeholder/40/40",
    meals: 27
  },
  {
    name: "Lincoln Elementary",
    quote: "Thanks to your donations, none of our students have to learn on an empty stomach. Their focus and happiness have improved dramatically.",
    location: "North District",
    avatar: "/api/placeholder/40/40",
    meals: 156
  },
  {
    name: "Veterans Support Center",
    quote: "Your generosity ensures our veterans receive nutritious meals along with their other services. This support is invaluable.",
    location: "Downtown",
    avatar: "/api/placeholder/40/40",
    meals: 85
  }
];

// Community challenges and events
const communityChallenges = [
  {
    id: 1,
    title: "Summer Hunger Challenge",
    description: "Help us provide 10,000 meals to children who lose access to school lunches during summer break.",
    goal: 10000,
    current: 6240,
    deadline: "June 30, 2025",
    icon: Utensils
  },
  {
    id: 2,
    title: "Holiday Meal Drive",
    description: "Join our effort to ensure every family enjoys a nutritious holiday meal this season.",
    goal: 5000,
    current: 1380,
    deadline: "December 15, 2025",
    icon: Gift
  },
  {
    id: 3,
    title: "Breakfast Club",
    description: "Help provide nutritious breakfasts to schoolchildren every morning.",
    goal: 8000,
    current: 2750,
    deadline: "Ongoing",
    icon: Coffee
  }
];

// Enhanced Main component
export default function DonationRewards() {
  // State management
  const [donations, setDonations] = useState(0);
  const [expanded, setExpanded] = useState(null);
  const [activeTab, setActiveTab] = useState('rewards');
  const [showConfetti, setShowConfetti] = useState(false);
  const [recentAchievement, setRecentAchievement] = useState(null);
  const [prevTier, setPrevTier] = useState(0);
  const [storyIndex, setStoryIndex] = useState(0);
  const [isExploding, setIsExploding] = useState(false);
  const [donationAmount, setDonationAmount] = useState(5);
  const [customAmount, setCustomAmount] = useState('');
  const [showImpactModal, setShowImpactModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const confettiRef = useRef(null);
  const donationRef = useRef(null);

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Auto-cycle through impact stories
  useEffect(() => {
    const interval = setInterval(() => {
      setStoryIndex((prevIndex) => (prevIndex + 1) % impactStories.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Calculate current tier based on donations
  const currentTier = tiers.reduce((acc, tier) => 
    donations >= tier.threshold ? tier.level : acc, 0);
  
  // Calculate progress to next tier
  const nextTierIndex = tiers.findIndex(tier => tier.level > currentTier);
  const nextTier = nextTierIndex !== -1 ? tiers[nextTierIndex] : tiers[tiers.length - 1];
  const currentTierObj = currentTier > 0 ? tiers[currentTier - 1] : null;
  
  const progressCalc = () => {
    if (currentTier === 0) {
      return (donations / nextTier.threshold) * 100;
    } else if (currentTier === tiers.length) {
      return 100;
    } else {
      const prevThreshold = tiers[currentTier - 1].threshold;
      return ((donations - prevThreshold) / (nextTier.threshold - prevThreshold)) * 100;
    }
  };
  
  const progress = progressCalc();

  // Handle donation submission
  const handleDonate = async () => {
    if (donationAmount <= 0) return;
    
    setIsLoading(true);
    
    // Create donation animation effect
    if (donationRef.current) {
      donationRef.current.classList.add('!animate-bounce');
      setTimeout(() => {
        if (donationRef.current) {
          donationRef.current.classList.remove('!animate-bounce');
        }
      }, 1000);
    }
    
    // Simulate API call with timeout
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newTotal = donations + donationAmount;
    setDonations(newTotal);
    setIsExploding(true);
    
    // Check if a new tier was reached
    const newTier = tiers.reduce((acc, tier) => 
      newTotal >= tier.threshold ? tier.level : acc, 0);
    
    if (newTier > prevTier) {
      setTimeout(() => {
        setShowConfetti(true);
        setRecentAchievement(tiers[newTier - 1]);
      }, 500);
    }
    
    setPrevTier(newTier);
    setIsLoading(false);
    
    setTimeout(() => {
      setIsExploding(false);
    }, 1000);
    
    // Reset custom amount
    setCustomAmount('');
    
    // Hide confetti after some time
    if (newTier > prevTier) {
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  // Toggle expanded tier view
  const toggleExpand = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  // Show impact modal
  const showImpact = (content) => {
    setModalContent(content);
    setShowImpactModal(true);
  };

  // Render donation buttons
  const renderDonationButtons = () => {
    const presetAmounts = [1, 5, 10, 25, 50];
    
    return (
      <div className="!mt-4">
        <p className="!text-green-800 !font-medium !mb-2">I want to donate:</p>
        <div className="!grid !grid-cols-5 !gap-2 !mb-3">
          {presetAmounts.map(amount => (
            <button
              key={amount}
              onClick={() => setDonationAmount(amount)}
              className={`!p-2 !rounded-lg !font-medium !transition-all !text-center
                ${donationAmount === amount 
                  ? '!bg-green-600 !text-white !shadow-md' 
                  : '!bg-green-100 !text-green-800 hover:!bg-green-200'}`}
            >
              {amount}
            </button>
          ))}
        </div>
        
        <div className="!flex !gap-2 !mb-4">
          <div className="!relative !flex-1">
            <input
              type="number"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                if (e.target.value) setDonationAmount(parseInt(e.target.value, 10));
              }}
              placeholder="Custom amount"
              className="!w-full !p-2 !pl-8 !rounded-lg !border !border-green-200 focus:!border-green-500 focus:!ring focus:!ring-green-200 !outline-none"
            />
            <span className="!absolute !left-3 !top-2.5 !text-green-600 !font-medium">+</span>
          </div>
          
          <button
            ref={donationRef}
            onClick={handleDonate}
            disabled={isLoading}
            className={`!px-4 !py-2 !bg-green-600 !text-white !rounded-lg !font-medium !transition-all !flex !items-center !justify-center !min-w-[120px] hover:!bg-green-700 hover:!shadow-lg active:!scale-95 disabled:!bg-green-400 disabled:!cursor-not-allowed`}
          >
            {isLoading ? (
              <div className="!animate-spin !w-5 !h-5 !border-2 !border-white !border-t-transparent !rounded-full"></div>
            ) : (
              <>Donate {donationAmount} meals</>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="!w-full !max-w-9xl !mx-auto !bg-gradient-to-br !from-green-50 !to-green-100 !rounded-2xl !shadow-xl !overflow-hidden">
      {/* Header Banner */}
      <div className="!relative !py-8 !px-6 md:!px-10 !bg-gradient-to-br !from-green-700 !to-green-900 !text-white">
        <div className="!max-w-3xl !mx-auto">
          <h1 className="!text-3xl md:!text-4xl !font-bold !mb-2">Food Donation Rewards</h1>
          <p className="!text-green-100 !mb-6">Join our mission to create a hunger-free community through sustainable food donations.</p>
          
          {/* Quick stats */}
          <div className="!grid !grid-cols-2 md:!grid-cols-4 !gap-3 !mb-2">
            <div className="!bg-white !bg-opacity-10 !p-3 !rounded-lg">
              <p className="!text-xs !text-green-500">Your Donations</p>
              <p className="!text-xl !font-bold text-green-900">{donations} meals</p>
            </div>
            <div className="!bg-white !bg-opacity-10 !p-3 !rounded-lg">
              <p className="!text-xs !text-green-500">Community Total</p>
              <p className="!text-xl !font-bold text-green-900">{135000 + donations} meals</p>
            </div>
            <div className="!bg-white !bg-opacity-10 !p-3 !rounded-lg">
              <p className="!text-xs !text-green-500">Your Current Tier</p>
              <p className="!text-xl !font-bold text-green-900">{currentTier > 0 ? currentTierObj?.name : 'None yet'}</p>
            </div>
            <div className="!bg-white !bg-opacity-10 !p-3 !rounded-lg">
              <p className="!text-xs !text-green-500">Next Milestone</p>
              <p className="!text-xl !font-bold text-green-900">{currentTier < tiers.length ? `${nextTier.threshold - donations} meals` : 'Max Tier'}</p>
            </div>
          </div>
        </div>
        
        {/* Animated background elements */}
        <div className="!hidden md:!block !absolute !top-0 !right-0 !w-64 !h-64 !bg-green-400 !rounded-full !filter !blur-3xl !opacity-10 !-mr-20 !-mt-20"></div>
        <div className="!hidden md:!block !absolute !bottom-0 !left-0 !w-48 !h-48 !bg-green-200 !rounded-full !filter !blur-3xl !opacity-10 !-ml-20 !-mb-20"></div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="!sticky !top-0 !z-10 !bg-white !shadow-md">
        <div className="!flex !overflow-x-auto !no-scrollbar">
          <button 
            onClick={() => setActiveTab('rewards')}
            className={`!flex-1 !px-4 !py-3 !text-center !font-medium !transition-colors !whitespace-nowrap
              ${activeTab === 'rewards' 
                ? '!text-green-700 !border-b-2 !border-green-600' 
                : '!text-gray-500 hover:!bg-green-50'}`}
          >
            <Trophy size={16} className="!inline !mr-1 !mb-0.5" />
            Rewards
          </button>
          <button 
            onClick={() => setActiveTab('impact')}
            className={`!flex-1 !px-4 !py-3 !text-center !font-medium !transition-colors !whitespace-nowrap
              ${activeTab === 'impact' 
                ? '!text-green-700 !border-b-2 !border-green-600' 
                : '!text-gray-500 hover:!bg-green-50'}`}
          >
            <Heart size={16} className="!inline !mr-1 !mb-0.5" />
            Your Impact
          </button>
          <button 
            onClick={() => setActiveTab('challenges')}
            className={`!flex-1 !px-4 !py-3 !text-center !font-medium !transition-colors !whitespace-nowrap
              ${activeTab === 'challenges' 
                ? '!text-green-700 !border-b-2 !border-green-600' 
                : '!text-gray-500 hover:!bg-green-50'}`}
          >
            <Star size={16} className="!inline !mr-1 !mb-0.5" />
            Challenges
          </button>
          <button 
            onClick={() => setActiveTab('community')}
            className={`!flex-1 !px-4 !py-3 !text-center !font-medium !transition-colors !whitespace-nowrap
              ${activeTab === 'community' 
                ? '!text-green-700 !border-b-2 !border-green-600' 
                : '!text-gray-500 hover:!bg-green-50'}`}
          >
            <Users size={16} className="!inline !mr-1 !mb-0.5" />
            Community
          </button>
        </div>
      </div>
      
      <div className="!p-5 md:!p-5">
        {/* Rewards Tab Content */}
        {activeTab === 'rewards' && (
          <div>
            {/* Current status and progress */}
            <div className={`!p-5 !bg-white !rounded-xl !shadow-lg !mb-8 !transition-all !relative !duration-300 ${isExploding ? '!animate-pulse' : ''}`}>
              <div className="!flex !flex-col md:!flex-row  !justify-between !items-start md:!items-center !mb-6">
                <div>
                  <h3 className="!text-2xl !font-bold !text-green-800 !mb-1">Your Donation Journey</h3>
                  <p className="!text-green-600">Track your progress and unlock exclusive rewards</p>
                </div>
                
                {currentTier > 0 && (
                  <div className="!mt-4 md:!mt-0 !flex !items-center !bg-green-50 !rounded-full !px-4 !py-2">
                    <div className="!bg-gradient-to-r !from-green-500 !to-green-600 !p-2 !rounded-full !mr-3">
                      {React.createElement(currentTierObj.icon, { 
                        size: 20, 
                        className: "!text-white" 
                      })}
                    </div>
                    <div>
                      <p className="!font-medium !text-green-800">{currentTierObj.name}</p>
                      <p className="!text-xs !text-green-600">Tier {currentTier}/{tiers.length}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Interactive tier progress bar */}
              <div className="!mb-6">
                <div className="!flex !justify-between !mb-2">
                  <p className="!text-sm !text-green-700 !font-medium">
                    {currentTier > 0 
                      ? `${donations} meals donated` 
                      : 'Start your donation journey'
                    }
                  </p>
                  <p className="!text-sm !text-green-700">
                    {currentTier < tiers.length 
                      ? `Next: ${nextTier.name} (${nextTier.threshold})` 
                      : 'Maximum tier achieved!'
                    }
                  </p>
                </div>
                
                <div className="!relative !w-full !h-6   !bg-yellow-300 !rounded-full !overflow-hidden">
                  {/* Main progress bar */}
                  <div 
                    className="!absolute !top-0 !left-0 !h-full !bg-gradient-to-r !from-green-600 !to-green-400 !transition-all !duration-500 !ease-out"
                    style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                  ></div>
                  
                  {/* Tier markers */}
                  {tiers.map((tier, index) => {
                    // Skip first tier marker at 0 and calculate position
                    if (index === 0) return null;
                    const prevThreshold = index > 0 ? tiers[index - 1].threshold : 0;
                    const totalRange = tiers[tiers.length - 1].threshold - 0;
                    const position = ((tier.threshold - 3) / totalRange) * 100;
                    
                    return (
                      <div 
                        key={tier.level}
                        className={`!absolute !top-0 !w-1 !h-full ${donations >= tier.threshold ? '!bg-white' : '!bg-gray-400'}`}
                        style={{ left: `${position}%` }}
                      ></div>
                    );
                  })}
                  
                  {/* Animated tier icons */}
                  {tiers.map((tier, index) => {
                    // Calculate position
                    const totalRange = tiers[tiers.length - 1].threshold - 0;
                    const position = ((tier.threshold - 3) / totalRange) * 100;
                    
                    return (
                      <div 
                        key={tier.level}
                        className={`!absolute !-top-2 !transform !-translate-x-1/2 !transition-all !duration-500
                          ${donations >= tier.threshold 
                            ? '!bg-green-600 !text-white' 
                            : '!bg-gray-300 !text-gray-600'}`}
                        style={{ 
                          left: `${position}%`,
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          display: 'flex',
                          marginTop:'9px',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {React.createElement(tier.icon, { size: 120 })}
                      </div>
                    );
                  })}
                </div>
                
                {/* Tier labels */}
                <div className="!flex !justify-between !mt-1">
                  {tiers.map((tier, index) => {
                    // Calculate position
                    const totalRange = tiers[tiers.length - 1].threshold - 0;
                    const position = ((tier.threshold - 0) / totalRange) * 100;
                    
                    // Only show first, last, and achieved tiers on mobile
                    if (isMobile && index !== 0 && index !== tiers.length - 1 && donations < tier.threshold) {
                      return null;
                    }
                    
                    return (
                      <div
                        key={tier.level}
                        className={`!absolute !text-xs !font-medium !transition-opacity
                          ${donations >= tier.threshold ? '!text-green-800' : '!text-blue-500'}`}
                        style={{ 
                          left: `${position}%`, 
                          top: '160px',
                          transform: 'translateX(-50%)',
                          maxWidth: '60px',
                          textAlign: 'center',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {tier.threshold}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Donation interface */}
              {renderDonationButtons()}
              
              {/* Quick benefits preview */}
              {currentTier > 0 && (
                <div className="!mt-6 !pt-4 !border-t !border-green-100">
                  <div className="!flex !justify-between !items-center !mb-2">
                    <h4 className="!font-medium !text-green-800">Your Current Benefits</h4>
                    <button 
                      onClick={() => toggleExpand(currentTier - 1)}
                      className="!text-xs !text-green-600 hover:!text-green-800 !flex !items-center"
                    >
                      View All <ChevronDown size={14} className="!ml-1" />
                    </button>
                  </div>
                  <div className="!flex !flex-wrap !gap-2">
                    {currentTierObj.benefits.slice(0, 3).map((benefit, i) => (
                      <span 
                        key={i} 
                        className="!bg-green-100 !text-green-800 !text-xs !font-medium !px-2 !py-1 !rounded-full"
                      >
                        {benefit}
                      </span>
                    ))}
                    {currentTierObj.benefits.length > 3 && (
                      <span className="!bg-green-50 !text-green-600 !text-xs !font-medium !px-2 !py-1 !rounded-full">
                        +{currentTierObj.benefits.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Rewards tiers accordion */}
            <div className="!bg-white !rounded-xl !shadow-lg !overflow-hidden !mb-8">
              <h3 className="!text-xl !font-semibold !text-green-800 !p-5 !border-b !border-green-100">Reward Tiers</h3>
              
              {tiers.map((tier, index) => (
                <div 
                  key={tier.level} 
                  className={`!border-b !border-green-100 !last:border-b-0 !transition-colors !duration-300
                    ${currentTier >= tier.level ? '!bg-green-50 !bg-opacity-40' : ''}`}
                >
                  <button 
                    onClick={() => toggleExpand(index)}
                    className="!w-full !flex !items-center !justify-between !p-4 md:!p-5 !text-left !transition-colors hover:!bg-green-50"
                  >
                    <div className="!flex !items-center">
                      <div 
                        className="!flex-shrink-0 !p-3 !mr-4 !rounded-full"
                        style={{
                          background: currentTier >= tier.level 
                            ? `linear-gradient(135deg, ${tier.color}, ${tier.color}cc)` 
                            : '#f3f4f6'
                        }}
                      >
                        {React.createElement(tier.icon, { 
                          size: 24, 
                          className: currentTier >= tier.level ? '!text-white' : '!text-gray-400' 
                        })}
                      </div>
                      <div>
                        <div className="!flex !items-center">
                          <p className={`!font-semibold !text-lg
                            ${currentTier >= tier.level ? '!text-green-800' : '!text-gray-600'}`}
                          >
                            {tier.name}
                          </p>
                          {currentTier >= tier.level && (
                            <span className="!ml-2 !flex-shrink-0 !text-xs !px-2 !py-0.5 !bg-green-100 !text-green-700 !rounded-full">
                              Unlocked
                            </span>
                          )}
                        </div>
                        <div className="!flex !items-center !mt-1">
                          <p className="!text-sm !text-gray-500">{tier.threshold} meals</p>
                          {donations < tier.threshold && currentTier < tier.level && (
                            <span className="!ml-2 !text-xs !text-green-600">
                              {tier.threshold - donations} meals to unlock
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="!flex !items-center !ml-4">
                      {expanded === index ? 
                        <ChevronUp size={20} className="!text-gray-500" /> : 
                        <ChevronDown size={20} className="!text-gray-500" />
                      }
                    </div>
                  </button>
                  
                  {expanded === index && (
                    <div className="!px-5 !pb-5 !pt-0 !text-sm !bg-green-50 !bg-opacity-30">
                      <div className="!pl-16">
                        <p className="!text-gray-700 !mb-4">{tier.description}</p>
                        
                        <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-6">
                          <div>
                            <p className="!font-medium !text-green-800 !mb-2">Benefits:</p>
                            <ul className="!space-y-2">
                              {tier.benefits.map((benefit, i) => (
                                <li key={i} className="!flex !items-start">
                                  <ThumbsUp size={16} className="!text-green-600 !mr-2 !mt-0.5" />
                                  <span className="!text-gray-700">{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <p className="!font-medium !text-green-800 !mb-2">Your Impact:</p>
                            <p className="!text-gray-700 !mb-3">{tier.impact}</p>
                            
                            <button
                              onClick={() => showImpact(tier)}
                              className="!text-green-600 !text-sm !font-medium !flex !items-center hover:!text-green-800"
                            >
                              See detailed impact <ArrowUp size={14} className="!ml-1 !rotate-45" />
                            </button>
                          </div>
                        </div>
                        
                        {donations < tier.threshold && (
                          <div className="!mt-6">
                          
                            <button
                              onClick={() => showImpact(tier)}
                              className="!text-green-600 !text-sm !font-medium !flex !items-center hover:!text-green-800"
                            >
                              See detailed impact <ArrowUp size={14} className="!ml-1 !rotate-45" />
                            </button>
                          </div>
                        )}
                        
                        {donations < tier.threshold && (
                          <div className="!mt-6">
                            <button
                              onClick={() => {
                                setDonationAmount(tier.threshold - donations);
                                setCustomAmount((tier.threshold - donations).toString());
                              }}
                              className="!bg-green-600 !text-white !px-4 !py-2 !rounded-lg !font-medium !transition-all hover:!bg-green-700 hover:!shadow-md active:!scale-95"
                            >
                              Donate {tier.threshold - donations} meals to unlock
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Impact Tab Content */}
        {activeTab === 'impact' && (
          <div>
            <div className="!bg-white !rounded-xl !shadow-lg !p-6 !mb-8">
              <h3 className="!text-xl !font-semibold !text-green-800 !mb-4">Your Donation Impact</h3>
              
              <div className="!grid !grid-cols-1 md:!grid-cols-3 !gap-4 !mb-6">
                <div className="!bg-green-50 !p-4 !rounded-lg">
                  <div className="!flex !items-center !mb-2">
                    <Utensils size={18} className="!text-green-600 !mr-2" />
                    <h4 className="!font-medium !text-green-800">Meals Provided</h4>
                  </div>
                  <p className="!text-3xl !font-bold !text-green-700">{donations}</p>
                  <p className="!text-sm !text-green-600">You've helped {Math.floor(donations/3)} people</p>
                </div>
                
                <div className="!bg-green-50 !p-4 !rounded-lg">
                  <div className="!flex !items-center !mb-2">
                    <MapPin size={18} className="!text-green-600 !mr-2" />
                    <h4 className="!font-medium !text-green-800">Communities Reached</h4>
                  </div>
                  <p className="!text-3xl !font-bold !text-green-700">{Math.max(1, Math.floor(donations/20))}</p>
                  <p className="!text-sm !text-green-600">Local neighborhoods supported</p>
                </div>
                
                <div className="!bg-green-50 !p-4 !rounded-lg">
                  <div className="!flex !items-center !mb-2">
                    <Calendar size={18} className="!text-green-600 !mr-2" />
                    <h4 className="!font-medium !text-green-800">Days of Support</h4>
                  </div>
                  <p className="!text-3xl !font-bold !text-green-700">{Math.max(1, Math.floor(donations/10))}</p>
                  <p className="!text-sm !text-green-600">For a family of four</p>
                </div>
              </div>
              
              <h4 className="!font-medium !text-green-800 !mb-3">Impact Stories</h4>
              <div className="!bg-green-50 !rounded-lg !p-4 !mb-4">
                <div className="!flex !items-start">
                  <div className="!flex-shrink-0 !mr-3">
                    <img 
                      src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmFklmiY_6hOR_WqP6O6bWt_Hg7Tj-nkOs4Y9yvhJ3bdtMQ9SU0MfutP0czgy5d82Fabk&usqp=CAU'
                      alt="Profile" 
                      className="!w-10 !h-10 !rounded-full !object-cover"
                    />
                  </div>
                  <div>
                    <p className="!text-green-800 !font-medium">{impactStories[storyIndex].name}</p>
                    <p className="!text-xs !text-green-600 !mb-2">
                      <MapPin size={12} className="!inline !mr-1" />
                      {impactStories[storyIndex].location} • Received {impactStories[storyIndex].meals} meals
                    </p>
                    <p className="!text-gray-700 !italic">"{impactStories[storyIndex].quote}"</p>
                  </div>
                </div>
              </div>
              
              <div className="!flex !justify-center !space-x-1">
                {impactStories.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setStoryIndex(i)}
                    className={`!w-2 !h-2 !rounded-full ${storyIndex === i ? '!bg-green-600' : '!bg-green-200'}`}
                  ></button>
                ))}
              </div>
            </div>
            
            <div className="!bg-white !rounded-xl !shadow-lg !p-6">
              <h3 className="!text-xl !font-semibold !text-green-800 !mb-4">Create Bigger Impact</h3>
              
              <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-6">
                <div className="!border !border-green-100 !rounded-lg !p-4">
                  <div className="!flex !items-center !mb-3">
                    <Share2 size={20} className="!text-green-600 !mr-2" />
                    <h4 className="!font-medium !text-green-800">Share Your Support</h4>
                  </div>
                  <p className="!text-gray-600 !mb-4">Invite friends to join our mission and multiply your impact.</p>
                  <button
                    onClick={() => setShowShareOptions(!showShareOptions)}
                    className="!bg-green-100 !text-green-700 !px-4 !py-2 !rounded-lg !font-medium !transition-all hover:!bg-green-200"
                  >
                    Share Your Journey
                  </button>
                  
                  {showShareOptions && (
                    <div className="!mt-4 !flex !space-x-4">
                      <button className="!text-green-600 hover:!text-green-800">
                        <span className="!sr-only">Facebook</span>
                        <svg className="!w-6 !h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M22,12.07A10,10,0,1,0,10.3,21.94V14.67H7.69V12.07H10.3V10.09c0-2.58,1.54-4,3.89-4a15.9,15.9,0,0,1,2.31.2V8.6H15.09a1.49,1.49,0,0,0-1.68,1.61v1.86h2.86l-.46,2.6H13.41v7.27A10,10,0,0,0,22,12.07Z"></path>
                        </svg>
                      </button>
                      <button className="!text-green-600 hover:!text-green-800">
                        <span className="!sr-only">Twitter</span>
                        <svg className="!w-6 !h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23,6.63a8.57,8.57,0,0,1-2.36.64A4.12,4.12,0,0,0,22.46,5a8.76,8.76,0,0,1-2.61,1A4.11,4.11,0,0,0,12,9.67a11.66,11.66,0,0,1-8.46-4.3,4.11,4.11,0,0,0,1.27,5.49A4.09,4.09,0,0,1,2.8,10.4v0a4.12,4.12,0,0,0,3.29,4,4.14,4.14,0,0,1-1.85.07,4.12,4.12,0,0,0,3.83,2.85A8.27,8.27,0,0,1,1,19.09,11.65,11.65,0,0,0,7.29,21c7.53,0,11.67-6.24,11.67-11.67,0-.18,0-.35,0-.52A8.1,8.1,0,0,0,23,6.63Z"></path>
                        </svg>
                      </button>
                      <button className="!text-green-600 hover:!text-green-800">
                        <span className="!sr-only">Email</span>
                        <svg className="!w-6 !h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20,4H4A2,2,0,0,0,2,6V18a2,2,0,0,0,2,2H20a2,2,0,0,0,2-2V6A2,2,0,0,0,20,4Zm0,4-8,5L4,8V6l8,5,8-5Z"></path>
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="!border !border-green-100 !rounded-lg !p-4">
                  <div className="!flex !items-center !mb-3">
                    <UserPlus size={20} className="!text-green-600 !mr-2" />
                    <h4 className="!font-medium !text-green-800">Volunteer With Us</h4>
                  </div>
                  <p className="!text-gray-600 !mb-4">Join our team to directly help with food distribution.</p>
                  <button className="!bg-green-100 !text-green-700 !px-4 !py-2 !rounded-lg !font-medium !transition-all hover:!bg-green-200">
                    Find Opportunities
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Challenges Tab Content */}
        {activeTab === 'challenges' && (
          <div>
            <div className="!bg-white !rounded-xl !shadow-lg !overflow-hidden !mb-8">
              <h3 className="!text-xl !font-semibold !text-green-800 !p-5 !border-b !border-green-100">Active Challenges</h3>
              
              {communityChallenges.map((challenge) => {
                const progress = (challenge.current / challenge.goal) * 100;
                
                return (
                  <div key={challenge.id} className="!p-5 !border-b !border-green-100 !last:border-b-0">
                    <div className="!flex !items-center !mb-3">
                      <div className="!bg-green-100 !p-2 !rounded-full !mr-3">
                        {React.createElement(challenge.icon, { 
                          size: 20, 
                          className: "!text-green-600" 
                        })}
                      </div>
                      <div>
                        <h4 className="!font-medium !text-green-800">{challenge.title}</h4>
                        <p className="!text-xs !text-green-600">
                          <Clock size={12} className="!inline !mr-1" />
                          Deadline: {challenge.deadline}
                        </p>
                      </div>
                    </div>
                    
                    <p className="!text-gray-600 !mb-4">{challenge.description}</p>
                    
                    <div className="!mb-4">
                      <div className="!flex !justify-between !mb-1">
                        <p className="!text-sm !text-green-700">{challenge.current.toLocaleString()} meals</p>
                        <p className="!text-sm !text-green-700">Goal: {challenge.goal.toLocaleString()}</p>
                      </div>
                      <div className="!w-full !h-2 !bg-gray-200 !rounded-full !overflow-hidden">
                        <div 
                          className="!h-full !bg-green-600"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="!flex !space-x-3">
                      <button
                        onClick={() => {
                          setDonationAmount(10);
                          setCustomAmount("10");
                        }}
                        className="!bg-green-600 !text-white !px-4 !py-2 !rounded-lg !font-medium !transition-all hover:!bg-green-700 hover:!shadow-md active:!scale-95"
                      >
                        Contribute
                      </button>
                      <button className="!bg-green-100 !text-green-700 !px-4 !py-2 !rounded-lg !font-medium !transition-all hover:!bg-green-200">
                        Learn More
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="!bg-white !rounded-xl !shadow-lg !p-6">
              <div className="!flex !items-center !justify-between !mb-4">
                <h3 className="!text-xl !font-semibold !text-green-800">Challenge Achievements</h3>
                <span className="!bg-green-100 !text-green-700 !text-sm !font-medium !px-3 !py-1 !rounded-full">
                  3 Completed
                </span>
              </div>
              
              <div className="!space-y-4">
                <div className="!border !border-green-100 !rounded-lg !p-4 !flex !items-center">
                  <div className="!bg-green-600 !p-2 !rounded-full !mr-4">
                    <Award size={20} className="!text-white" />
                  </div>
                  <div className="!flex-1">
                    <p className="!font-medium !text-green-800">First-time Donor</p>
                    <p className="!text-sm !text-gray-600">Made your first donation to fight hunger</p>
                  </div>
                  <div className="!bg-green-100 !px-3 !py-1 !rounded-full">
                    <Sparkles size={16} className="!text-green-600" />
                  </div>
                </div>
                
                <div className="!border !border-green-100 !rounded-lg !p-4 !flex !items-center">
                  <div className="!bg-green-600 !p-2 !rounded-full !mr-4">
                    <Award size={20} className="!text-white" />
                  </div>
                  <div className="!flex-1">
                    <p className="!font-medium !text-green-800">Holiday Hero</p>
                    <p className="!text-sm !text-gray-600">Contributed to the Holiday Meal Drive</p>
                  </div>
                  <div className="!bg-green-100 !px-3 !py-1 !rounded-full">
                    <Sparkles size={16} className="!text-green-600" />
                  </div>
                </div>
                
                <div className="!border !border-green-100 !rounded-lg !p-4 !flex !items-center">
                  <div className="!bg-green-600 !p-2 !rounded-full !mr-4">
                    <Award size={20} className="!text-white" />
                  </div>
                  <div className="!flex-1">
                    <p className="!font-medium !text-green-800">Community Connector</p>
                    <p className="!text-sm !text-gray-600">Shared our mission with your network</p>
                  </div>
                  <div className="!bg-green-100 !px-3 !py-1 !rounded-full">
                    <Sparkles size={16} className="!text-green-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Community Tab Content */}
        {activeTab === 'community' && (
          <div>
            <div className="!bg-white !rounded-xl !shadow-lg !p-6 !mb-8">
              <h3 className="!text-xl !font-semibold !text-green-800 !mb-4">Community Impact</h3>
              
              <div className="!grid !grid-cols-1 md:!grid-cols-3 !gap-4 !mb-6">
                <div className="!bg-green-50 !p-4 !rounded-lg !text-center">
                  <p className="!text-green-600 !mb-2">Total Meals</p>
                  <p className="!text-3xl !font-bold !text-green-800">135,000</p>
                  <p className="!text-sm !text-green-600">This year</p>
                </div>
                
                <div className="!bg-green-50 !p-4 !rounded-lg !text-center">
                  <p className="!text-green-600 !mb-2">Active Donors</p>
                  <p className="!text-3xl !font-bold !text-green-800">1,247</p>
                  <p className="!text-sm !text-green-600">Supporting our cause</p>
                </div>
                
                <div className="!bg-green-50 !p-4 !rounded-lg !text-center">
                  <p className="!text-green-600 !mb-2">People Helped</p>
                  <p className="!text-3xl !font-bold !text-green-800">45,000</p>
                  <p className="!text-sm !text-green-600">Across the region</p>
                </div>
              </div>
              
              <h4 className="!font-medium !text-green-800 !mb-3">Top Donors This Month</h4>
              <div className="!space-y-3 !mb-4">
                <div className="!flex !items-center !justify-between !p-3 !bg-green-50 !rounded-lg">
                  <div className="!flex !items-center">
                    <div className="!bg-green-600 !text-white !w-8 !h-8 !rounded-full !flex !items-center !justify-center !mr-3">
                      <Trophy size={16} />
                    </div>
                    <div>
                      <p className="!font-medium !text-green-800">Sarah Johnson</p>
                      <p className="!text-xs !text-green-600">Sustainability Guardian</p>
                    </div>
                  </div>
                  <p className="!font-semibold !text-green-800">427 meals</p>
                </div>
                
                <div className="!flex !items-center !justify-between !p-3 !bg-green-50 !rounded-lg">
                  <div className="!flex !items-center">
                    <div className="!bg-green-600 !text-white !w-8 !h-8 !rounded-full !flex !items-center !justify-center !mr-3">
                      <Trophy size={16} />
                    </div>
                    <div>
                      <p className="!font-medium !text-green-800">GreenTech Inc.</p>
                      <p className="!text-xs !text-green-600">Community Champion</p>
                    </div>
                  </div>
                  <p className="!font-semibold !text-green-800">385 meals</p>
                </div>
                
                <div className="!flex !items-center !justify-between !p-3 !bg-green-50 !rounded-lg">
                  <div className="!flex !items-center">
                    <div className="!bg-green-600 !text-white !w-8 !h-8 !rounded-full !flex !items-center !justify-center !mr-3">
                      <Trophy size={16} />
                    </div>
                    <div>
                      <p className="!font-medium !text-green-800">Michael Torres</p>
                      <p className="!text-xs !text-green-600">Harvest Provider</p>
                    </div>
                  </div>
                  <p className="!font-semibold !text-green-800">312 meals</p>
                </div>
              </div>
              
              <button className="!w-full !text-center !text-green-600 !text-sm !font-medium hover:!text-green-800">
                View Full Leaderboard
              </button>
            </div>
            
            <div className="!bg-white !rounded-xl !shadow-lg !p-6">
              <h3 className="!text-xl !font-semibold !text-green-800 !mb-4">Upcoming Events</h3>
              
              <div className="!space-y-4">
                <div className="!border !border-green-100 !rounded-lg !p-4">
                  <div className="!flex !items-center !mb-2">
                    <Calendar size={18} className="!text-green-600 !mr-2" />
                    <h4 className="!font-medium !text-green-800">Community Garden Day</h4>
                  </div>
                  <p className="!text-gray-600 !mb-3">Join us for a day of planting and harvesting at our community gardens.</p>
                  <div className="!flex !items-center !text-sm !text-green-600 !mb-4">
                    <Clock size={14} className="!mr-1" />
                    <span>May 15, 2025 • 9:00 AM - 2:00 PM</span>
                  </div>
                  <button className="!bg-green-100 !text-green-700 !px-4 !py-2 !rounded-lg !font-medium !transition-all hover:!bg-green-200">
                    Register to Volunteer
                  </button>
                </div>
                
                <div className="!border !border-green-100 !rounded-lg !p-4">
                  <div className="!flex !items-center !mb-2">
                    <Calendar size={18} className="!text-green-600 !mr-2" />
                    <h4 className="!font-medium !text-green-800">Food Distribution Training</h4>
                  </div>
                  <p className="!text-gray-600 !mb-3">Learn how to efficiently sort and distribute food to those in need.</p>
                  <div className="!flex !items-center !text-sm !text-green-600 !mb-4">
                    <Clock size={14} className="!mr-1" />
                    <span>May 22, 2025 • 6:30 PM - 8:00 PM</span>
                  </div>
                  <button className="!bg-green-100 !text-green-700 !px-4 !py-2 !rounded-lg !font-medium !transition-all hover:!bg-green-200">
                    Sign Up
                  </button>
                </div>
                
                <div className="!border !border-green-100 !rounded-lg !p-4">
                  <div className="!flex !items-center !mb-2">
                    <Calendar size={18} className="!text-green-600 !mr-2" />
                    <h4 className="!font-medium !text-green-800">Summer Fundraising Gala</h4>
                  </div>
                  <p className="!text-gray-600 !mb-3">An evening of music, food, and fundraising for our summer meal programs.</p>
                  <div className="!flex !items-center !text-sm !text-green-600 !mb-4">
                    <Clock size={14} className="!mr-1" />
                    <span>June 10, 2025 • 7:00 PM - 10:00 PM</span>
                  </div>
                  <button className="!bg-green-100 !text-green-700 !px-4 !py-2 !rounded-lg !font-medium !transition-all hover:!bg-green-200">
                    Get Tickets
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Achievement notification */}
      {showConfetti && recentAchievement && (
        <div className="!fixed !inset-0 !flex !items-center !justify-center !z-50 !bg-black !bg-opacity-50">
          <div 
            ref={confettiRef} 
            className="!bg-white !rounded-xl !shadow-xl !p-8 !max-w-md !text-center !transform !transition-all !animate-in !zoom-in-95"
          >
            <div className="!mb-4">
              <div className="!w-16 !h-16 !mx-auto !rounded-full !flex !items-center !justify-center !mb-4"
                style={{
                  background: `linear-gradient(135deg, ${recentAchievement.color}, ${recentAchievement.color}cc)`
                }}
              >
                {React.createElement(recentAchievement.icon, { 
                  size: 32, 
                  className: "!text-white" 
                })}
              </div>
              <h3 className="!text-2xl !font-bold !text-green-800 !mb-1">New Tier Unlocked!</h3>
              <p className="!text-green-600 !font-medium !text-lg !mb-2">{recentAchievement.name}</p>
              <p className="!text-gray-600 !mb-4">{recentAchievement.description}</p>
              
              <div className="!bg-green-50 !p-3 !rounded-lg !mb-4">
                <p className="!text-sm !font-medium !text-green-800 !mb-2">New Benefits Unlocked:</p>
                <ul className="!text-left !text-sm !space-y-2">
                  {recentAchievement.benefits.map((benefit, index) => (
                    <li key={index} className="!flex !items-start">
                      <Star size={14} className="!text-green-600 !mr-2 !mt-0.5" />
                      <span className="!text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="!flex !space-x-3">
                <button
                  onClick={() => setShowConfetti(false)}
                  className="!flex-1 !bg-green-600 !text-white !px-4 !py-2 !rounded-lg !font-medium !transition-all hover:!bg-green-700"
                >
                  Continue Donating
                </button>
                <button
                  onClick={() => {
                    setShowConfetti(false);
                    setShowShareOptions(true);
                  }}
                  className="!flex-1 !bg-green-100 !text-green-700 !px-4 !py-2 !rounded-lg !font-medium !transition-all hover:!bg-green-200"
                >
                  Share Achievement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Impact Modal */}
      {showImpactModal && modalContent && (
        <div className="!fixed !inset-0 !flex !items-center !justify-center !z-50 !bg-black !bg-opacity-50">
          <div className="!bg-white !rounded-xl !shadow-xl !p-6 !max-w-lg">
            <div className="!flex !justify-between !items-center !mb-4">
              <h3 className="!text-xl !font-semibold !text-green-800">Impact Details</h3>
              <button 
                onClick={() => setShowImpactModal(false)}
                className="!text-gray-500 hover:!text-gray-700"
              >
                <span className="!sr-only">Close</span>
                <svg className="!w-6 !h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="!mb-4">
              <div className="!flex !items-center !mb-3">
                <div 
                  className="!p-3 !rounded-full !mr-3"
                  style={{
                    background: `linear-gradient(135deg, ${modalContent.color}, ${modalContent.color}cc)`
                  }}
                >
                  {React.createElement(modalContent.icon, { 
                    size: 24, 
                    className: "!text-white" 
                  })}
                </div>
                <div>
                  <h4 className="!font-medium !text-green-800">{modalContent.name}</h4>
                  <p className="!text-sm !text-green-600">Tier {modalContent.level}</p>
                </div>
              </div>
              
              <p className="!text-gray-700 !mb-4">{modalContent.description}</p>
              
              <div className="!bg-green-50 !p-4 !rounded-lg !mb-4">
                <h5 className="!font-medium !text-green-800 !mb-2">Your Impact at This Level:</h5>
                <p className="!text-gray-700">{modalContent.impact}</p>
              </div>
              
              <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-4">
                <div>
                <h5 className="!font-medium !text-green-800 !mb-2">Benefits You'll Receive:</h5>
                  <ul className="!space-y-2">
                    {modalContent.benefits.map((benefit, i) => (
                      <li key={i} className="!flex !items-start">
                        <ThumbsUp size={16} className="!text-green-600 !mr-2 !mt-0.5" />
                        <span className="!text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="!font-medium !text-green-800 !mb-2">How You Can Help More:</h5>
                  <ul className="!space-y-2">
                    <li className="!flex !items-start">
                      <Users size={16} className="!text-green-600 !mr-2 !mt-0.5" />
                      <span className="!text-gray-700">Invite friends to join our cause</span>
                    </li>
                    <li className="!flex !items-start">
                      <Calendar size={16} className="!text-green-600 !mr-2 !mt-0.5" />
                      <span className="!text-gray-700">Volunteer at our upcoming events</span>
                    </li>
                    <li className="!flex !items-start">
                      <Share2 size={16} className="!text-green-600 !mr-2 !mt-0.5" />
                      <span className="!text-gray-700">Share your achievements on social media</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="!flex !space-x-3">
              <button
                onClick={() => setShowImpactModal(false)}
                className="!flex-1 !bg-green-600 !text-white !px-4 !py-2 !rounded-lg !font-medium !transition-all hover:!bg-green-700"
              >
                Close
              </button>
              {donations < modalContent.threshold && (
                <button
                  onClick={() => {
                    setShowImpactModal(false);
                    setDonationAmount(modalContent.threshold - donations);
                    setCustomAmount((modalContent.threshold - donations).toString());
                  }}
                  className="!flex-1 !bg-green-100 !text-green-700 !px-4 !py-2 !rounded-lg !font-medium !transition-all hover:!bg-green-200"
                >
                  Donate to Reach This Tier
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}