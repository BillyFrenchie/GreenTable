import { useState, useEffect } from 'react';
import React, { useRef } from 'react';
import { Menu, X, ChevronDown, Heart, Award, Leaf, Users, ArrowRight, ArrowUp } from 'lucide-react';
import DonationRewards from './DonationRewards';
import SurplusList from '../SurplusList';
import DonorDeliveryPage from './DonorDeliveryPage';
import { useNavigate } from 'react-router-dom';

export default function FoodSurplusDonationLandingPage() {
    const donateRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [impact, setImpact] = useState({ meals: 0, donors: 0, partners: 0 });
  const [animationComplete, setAnimationComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
      setShowScrollTop(position > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Animate impact numbers
    const interval = setInterval(() => {
      setImpact(prev => {
        const newMeals = prev.meals + 1230;
        const newDonors = prev.donors + 23;
        const newPartners = prev.partners + 12;
        
        if (newMeals >= 984500) {
          clearInterval(interval);
          setAnimationComplete(true);
          return { meals: 984500, donors: 2300, partners: 1200 };
        }
        
        return { meals: newMeals, donors: newDonors, partners: newPartners };
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToDonate = () => {
    donateRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setIsMenuOpen(false);
    if(tab==='logout'){
      navigate('/login');
    }
  };

  const facts = [
    {
      title: "One Third of Food Wasted",
      description: "Approximately one-third of all food produced globally is lost or wasted, amounting to about 1.3 billion tons per year.",
      icon: <Leaf size={24} className="text-green-600" />
    },
    {
      title: "Carbon Footprint",
      description: "Food waste generates 8% of global greenhouse gas emissions. By reducing waste, we can significantly impact climate change.",
      icon: <Leaf size={24} className="text-green-600" />
    },
    {
      title: "Economic Impact",
      description: "The economic cost of food waste is estimated at $1 trillion annually. Donating surplus can reduce operational costs.",
      icon: <Leaf size={24} className="text-green-600" />
    }
  ];

  const testimonials = [
    {
      name: "Emma Johnson",
      role: "Restaurant Manager",
      content: "Donating our surplus food has not only reduced our waste but allowed us to become an active part of the community. The process is seamless and rewarding.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgR71cXSeHLZp8jmBQhHKQn_kZr3Yijgj1Sw&s"
    },
    {
      name: "David Chen",
      role: "Grocery Store Owner",
      content: "The rewards program has been a great incentive for our business. We've seen customer loyalty increase as they appreciate our commitment to reducing waste.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgiFdgv377GbHewlOp8pafN1iCpITSEyXr0A&s"
    },
    {
      name: "Maria Rodriguez",
      role: "Bakery Owner",
      content: "What started as a way to reduce our end-of-day waste has turned into a fulfilling partnership with local shelters. The impact tracking feature shows us exactly how we're helping.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeMw9XAS00eGPLdiQZ5nCAbzJqqge6WvLdZg&s"
    }
  ];

  const motivationCards = [
    {
      title: "Make a Difference",
      description: "Every donation helps feed someone in need while reducing environmental impact.",
      color: "bg-green-600"
    },
    {
      title: "Reduce Food Waste",
      description: "Your surplus food can help tackle one of our biggest environmental challenges.",
      color: "bg-green-700"
    },
    {
      title: "Build Community",
      description: "Connect with local organizations and strengthen your community bonds.",
      color: "bg-green-800"
    }
  ];

  const rewardsTiers = [
    {
      level: "Sprout",
      donations: "1-10",
      benefits: ["Digital recognition", "Monthly impact report", "Newsletter subscription"]
    },
    {
      level: "Gardener",
      donations: "11-50",
      benefits: ["Sprout benefits", "Partner spotlight", "Quarterly tax benefit summary"]
    },
    {
      level: "Harvester",
      donations: "51+",
      benefits: ["Gardener benefits", "Premium partner badge", "Annual sustainability award", "Marketing co-op opportunities"]
    }
  ];

  return (
    <div className="bg-white min-h-screen font-sans text-gray-800">
      {/* Navbar */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrollPosition > 50 ? 'bg-white shadow-md' : 'bg-transparent'}`}>
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="font-bold text-2xl text-green-700">Green<span className="text-green-500">Table</span></span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            <button 
              onClick={() => handleTabClick('home')} 
              className={`font-medium transition-colors duration-300 ${activeTab === 'home' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600 hover:text-green-600'}`}
            >
              Home
            </button>
            <button 
              onClick={() => handleTabClick('donate')} 
              className={`font-medium transition-colors duration-300 ${activeTab === 'donate' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600 hover:text-green-600'}`}
            >
              Donate
            </button>
            <button 
              onClick={() => handleTabClick('rewards')} 
              className={`font-medium transition-colors duration-300 ${activeTab === 'rewards' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600 hover:text-green-600'}`}
            >
              Rewards
            </button>
            <button 
              onClick={() => handleTabClick('track-order')} 
              className={`font-medium transition-colors duration-300 ${activeTab === 'track-order' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600 hover:text-green-600'}`}
            >
              Track Order
            </button>
            <button 
              onClick={() => handleTabClick('about')} 
              className={`font-medium transition-colors duration-300 ${activeTab === 'about' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600 hover:text-green-600'}`}
            >
              About Us
            </button>
            <button 
              onClick={() => handleTabClick('logout')} 
              className={`font-medium transition-colors duration-300 ${activeTab === 'logout' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600 hover:text-green-600'}`}
            >
              Logout
            </button>
          </div>
          
          <div className="hidden md:block">
            <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105">
              Get Started
            </button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="text-gray-500 hover:text-green-600 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg py-4 px-4 absolute w-full">
            <div className="flex flex-col space-y-3">
              <button 
                onClick={() => handleTabClick('home')} 
                className={`font-medium px-4 py-2 rounded-md ${activeTab === 'home' ? 'bg-green-50 text-green-600' : 'text-gray-600'}`}
              >
                Home
              </button>
              <button 
                onClick={() => handleTabClick('donate')} 
                className={`font-medium px-4 py-2 rounded-md ${activeTab === 'donate' ? 'bg-green-50 text-green-600' : 'text-gray-600'}`}
              >
                Donate
              </button>
              <button 
                onClick={() => handleTabClick('rewards')} 
                className={`font-medium px-4 py-2 rounded-md ${activeTab === 'rewards' ? 'bg-green-50 text-green-600' : 'text-gray-600'}`}
              >
                Rewards
              </button>
              <button 
                onClick={() => handleTabClick('about')} 
                className={`font-medium px-4 py-2 rounded-md ${activeTab === 'about' ? 'bg-green-50 text-green-600' : 'text-gray-600'}`}
              >
                About Us
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-full mt-2">
                Get Started
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>
        {activeTab === 'home' && (
          <>
            {/* Hero Section */}
            <section className="relative overflow-hidden">
              <div className="absolute inset-0 z-0 bg-gradient-to-r from-green-50 to-green-100"></div>
              <div className="absolute inset-0 bg-[url('/api/placeholder/1600/900')] opacity-10 z-0"></div>
              <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 mb-10 md:mb-0">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 mb-6">
                      Turn Food Surplus into 
                      <span className="text-green-600"> Community Support</span>
                    </h1>
                    <p className="text-xl text-gray-700 mb-8">
                      Join our network of food donors making a difference. Reduce waste, feed the hungry, and earn rewards for your commitment to sustainability.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <button onClick={() => handleTabClick('donate')} className="!bg-green-600 !hover:bg-green-700 !text-white !font-bold py-3 px-8 !rounded-full !transition-all !duration-300 !transform !hover:scale-105 !shadow-lg">
                        Donate Now
                      </button>
                      <button onClick={() => handleTabClick('about')} className="!bg-white !hover:bg-gray-50 !text-green-600 !font-bold !py-3 !px-8 !rounded-full !border-2 !border-green-600 !transition-all !duration-300 !hover:shadow-md">
                        Learn More
                      </button>
                    </div>
                  </div>
                  <div className="md:w-1/2">
                    <div className="relative">
                      <div className="bg-white shadow-xl rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-500">
                        <img src="https://media.istockphoto.com/id/2081110694/vector/charity-food-drive-and-donating-to-a-local-food-bank-charity-logo-or-poster.jpg?s=612x612&w=0&k=20&c=pKHnDQ-lrrEpZezDQFQiqmFCacKXbMaxNM-wRXFAUbk=" alt="Food donation" className="w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                          <div className="p-6 text-white">
                            <span className="bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full uppercase">Featured</span>
                            <h3 className="text-xl font-bold mt-2">Local farm donates fresh produce weekly</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Impact Counter Section */}
            <section className="bg-green-700 text-white py-14">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Our Collective Impact</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-bold mb-2">{impact.meals.toLocaleString()}</div>
                    <p className="text-xl text-green-100">Meals Rescued</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-bold mb-2">{impact.donors.toLocaleString()}</div>
                    <p className="text-xl text-green-100">Active Donors</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-bold mb-2">{impact.partners.toLocaleString()}</div>
                    <p className="text-xl text-green-100">Partner Organizations</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Motivation Cards */}
            <section className="py-20 bg-gray-50">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-4">Why Donate Food Surplus?</h2>
                <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-12">
                  Your contribution can change lives while helping the environment
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {motivationCards.map((card, index) => (
                    <div 
                      key={index} 
                      className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300"
                    >
                      <div className={`h-2 ${card.color}`}></div>
                      <div className="p-6">
                        <h3 className="text-2xl font-bold mb-3 text-gray-800">{card.title}</h3>
                        <p className="text-gray-600">{card.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Facts Section */}
            <section className="py-20">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-4">Food Waste Facts</h2>
                <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-12">
                  Understanding the scale of the problem helps us appreciate the impact of every donation
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {facts.map((fact, index) => (
                    <div key={index} className="bg-white border border-gray-100 rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center mb-4">
                        {fact.icon}
                        <h3 className="text-xl font-semibold ml-2">{fact.title}</h3>
                      </div>
                      <p className="text-gray-600">{fact.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-green-50">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-4">Donor Testimonials</h2>
                <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-12">
                  Hear from businesses that are making a difference
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                        <div className="ml-3">
                          <h3 className="font-bold text-lg">{testimonial.name}</h3>
                          <p className="text-gray-600 text-sm">{testimonial.role}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 italic">{testimonial.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-green-700 text-white">
              <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
                <p className="text-xl mb-8 max-w-2xl mx-auto">Join our growing network of food donors and start making an impact in your community today.</p>
                <button className="!bg-white !text-green-700 !hover:bg-gray-100 !font-bold py-3 px-8 !rounded-full !transition-all !duration-300 !transform !hover:scale-105 !shadow-lg">
                  Sign Up Now
                </button>
              </div>
            </section>
          </>
        )}

        {activeTab === 'donate' && (
            <>

            
          <section className="py-20">
            <div className="container mx-auto px-4">
              <h1 className="text-4xl font-bold text-center mb-8">Donate Food Surplus</h1>
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="p-8">
                  <div className="border-t border-gray-200 pt-8">
                      <h2 className="text-2xl font-bold mb-6">What Can You Donate?</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-green-50 rounded-lg p-6">
                          <h3 className="font-semibold text-xl mb-2 text-green-700">Accepted Items</h3>
                          <ul className="space-y-2 text-gray-700">
                            <li className="flex items-center">
                              <span className="text-green-600 mr-2">✓</span> Fresh produce
                            </li>
                            <li className="flex items-center">
                              <span className="text-green-600 mr-2">✓</span> Baked goods
                            </li>
                            <li className="flex items-center">
                              <span className="text-green-600 mr-2">✓</span> Prepared meals (properly stored)
                            </li>
                            <li className="flex items-center">
                              <span className="text-green-600 mr-2">✓</span> Canned goods
                            </li>
                            <li className="flex items-center">
                              <span className="text-green-600 mr-2">✓</span> Dairy products
                            </li>
                            <li className="flex items-center">
                              <span className="text-green-600 mr-2">✓</span> Packaged foods
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-red-50 rounded-lg p-6">
                          <h3 className="font-semibold text-xl mb-2 text-red-700">Cannot Accept</h3>
                          <ul className="space-y-2 text-gray-700">
                            <li className="flex items-center">
                              <span className="text-red-600 mr-2">✕</span> Expired items
                            </li>
                            <li className="flex items-center">
                              <span className="text-red-600 mr-2">✕</span> Partially consumed foods
                            </li>
                            <li className="flex items-center">
                              <span className="text-red-600 mr-2">✕</span> Items stored at unsafe temperatures
                            </li>
                            <li className="flex items-center">
                              <span className="text-red-600 mr-2">✕</span> Homemade items (unless licensed kitchen)
                            </li>
                            <li className="flex items-center">
                              <span className="text-red-600 mr-2">✕</span> Alcohol or items containing alcohol
                            </li>
                          </ul>
                        </div>
                        
                      </div>
                      <div className="bg-yellow-100 border-l-4 border-yellow-600 text-yellow-800 p-6 mt-6 rounded-lg shadow-sm">
  <h4 className="font-bold text-xl mb-3">⚠️ Legal Warning: Food Safety Compliance</h4>
  <p className="mb-3">
    Donating items listed under the <span className="font-semibold">"Cannot Accept"</span> category is strictly prohibited as it may violate Indian food safety laws.
    All donors are expected to comply with the <span className="font-semibold">Food Safety and Standards Act, 2006</span>, governed by the 
    <a href="https://www.fssai.gov.in/cms/food-safety-and-standards-rules--2011.php" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-1">FSSAI</a>.
  </p>

  <p className="mb-3">Violation of these standards may result in the following legal consequences:</p>

  <ul className="list-disc list-inside space-y-1 mb-3">
    <li>Penalties under <strong>Section 50–66 of the FSS Act</strong>, including fines up to ₹10 lakh</li>
    <li>Prosecution for food adulteration or unsafe practices (Section 59 & 63)</li>
    <li>Temporary or permanent ban from contributing to registered food distribution programs</li>
    <li>Criminal liability in case of harm caused to consumers due to negligence</li>
  </ul>

  <p>
    All donated food must be safe for human consumption, properly labeled, and stored as per FSSAI guidelines. 
    If you're unsure whether your food item qualifies, please consult us before donating.
  </p>
</div>

                    </div>
                    <div className=" mt-6 mb-10">
                    <div className="border-t border-gray-200 pt-8"/>
                      <h2 className="text-2xl font-bold mb-4">How It Works</h2>
                      <div className="space-y-6">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 bg-green-100 rounded-full p-3">
                            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-green-600 text-white font-bold">1</span>
                          </div>
                          <div className="ml-4">
                            <h3 className="text-xl font-semibold">Register Your Business</h3>
                            <p className="text-gray-600 mt-1">Create an account and let us know about your organization and the typical food surplus you have.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="flex-shrink-0 bg-green-100 rounded-full p-3">
                            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-green-600 text-white font-bold">2</span>
                          </div>
                          <div className="ml-4">
                            <h3 className="text-xl font-semibold">Log Your Available Surplus</h3>
                            <p className="text-gray-600 mt-1">Use our simple form or app to log what food you have available, when it's ready, and how much.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="flex-shrink-0 bg-green-100 rounded-full p-3">
                            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-green-600 text-white font-bold">3</span>
                          </div>
                          <div className="ml-4">
                            <h3 className="text-xl font-semibold">We Connect You With Recipients</h3>
                            <p className="text-gray-600 mt-1">Our system matches your donation with local organizations that can use it right away.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="flex-shrink-0 bg-green-100 rounded-full p-3">
                            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-green-600 text-white font-bold">4</span>
                          </div>
                          <div className="ml-4">
                            <h3 className="text-xl font-semibold">Track Your Impact</h3>
                            <p className="text-gray-600 mt-1">See real-time metrics on how many meals you've provided and your environmental impact.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    
                    
                    <div className="mt-8 flex justify-center">
                      
                      <button onClick={scrollToDonate} className="!bg-green-600 !hover:bg-green-700 !text-white !font-bold py-3 px-8 !rounded-full !transition-all !duration-300 transform hover:scale-105 shadow-lg">
                        Start Donating
                      </button>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <div style={{ height: '100vh' }} /> {/* Just to create space */}
           <div  ref={donateRef}> 
            <SurplusList/>
           </div> 
            

          </>
        )}

        {activeTab === 'rewards' && (
          <section className="py-20">
            <div className="container mx-auto px-4 mb-6">
              <h1 className="text-4xl font-bold text-center mb-4">Donor Rewards Program</h1>
              <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-12">
                We believe in recognizing the generosity of our donors with a comprehensive rewards program
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {rewardsTiers.map((tier, index) => (
                  <div 
                    key={index} 
                    className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <div className={`h-3 ${index === 0 ? 'bg-green-500' : index === 1 ? 'bg-green-600' : 'bg-green-700'}`}></div>
                    <div className="p-6">
                      <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold mb-2">{tier.level}</h3>
                        <p className="text-gray-600">{tier.donations} donations per month</p>
                      </div>
                      
                      <ul className="space-y-3">
                        {tier.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-center">
                            <Award size={18} className="text-green-600 mr-2" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-green-50 rounded-lg p-8 max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">Additional Benefits</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex">
                    <div className="mr-4 mt-1">
                      <Heart size={24} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Community Recognition</h3>
                      <p className="text-gray-700">Your business will be featured on our website and social media, increasing your visibility as a community-conscious organization.</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="mr-4 mt-1">
                      <Award size={24} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Tax Benefits</h3>
                      <p className="text-gray-700">Food donations may qualify for tax deductions. We provide detailed donation records to make tax filing easier.</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="mr-4 mt-1">
                      <Users size={24} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Employee Engagement</h3>
                      <p className="text-gray-700">Engage your employees in meaningful community service, boosting morale and team spirit.</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="mr-4 mt-1">
                      <Leaf size={24} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Sustainability Reporting</h3>
                      <p className="text-gray-700">Receive detailed reports on your environmental impact to include in your sustainability initiatives.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
              <DonationRewards/>
          </section>
        )}

        {/* News Section */}
        {activeTab === 'home' && (
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-4">Latest News</h2>
              <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-12">
                Stay updated with our initiatives and success stories
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
                  <img src="https://images.unsplash.com/photo-1534723452862-4c874018d66d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Z3JvY2VyeXxlbnwwfHwwfHx8MA%3D%3D" alt="News 1" className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-gray-500">April 15, 2025</span>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Partnership</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">New Grocery Chain Joins Our Network</h3>
                    <p className="text-gray-600 mb-4">GreenTable welcomes FreshMart's 12 locations to our donor network, potentially saving 5,000+ meals monthly.</p>
                    <a href="#" className="inline-flex items-center text-green-600 font-semibold hover:text-green-700">
                      Read more <ArrowRight size={16} className="ml-1" />
                    </a>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
                  <img src="https://images.prismic.io/ecr-group-staging/714674cf-1101-4c9f-93f6-4aa50d46c908_Fresh%20inside%20AH.jpg?ixlib=gatsbyFP&auto=compress%2Cformat&fit=max&w=1080&h=633" alt="News 2" className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-gray-500">April 10, 2025</span>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Event</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Annual Food Waste Summit</h3>
                    <p className="text-gray-600 mb-4">Join us for our annual summit bringing together food businesses, nonprofits, and policymakers to discuss food waste solutions.</p>
                    <a href="#" className="inline-flex items-center text-green-600 font-semibold hover:text-green-700">
                      Read more <ArrowRight size={16} className="ml-1" />
                    </a>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
                  <img src="https://plus.unsplash.com/premium_photo-1683141173692-aba4763bce41?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Zm9vZCUyMGRvbmF0aW9ufGVufDB8fDB8fHww" alt="News 3" className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-gray-500">April 2, 2025</span>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Impact</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Milestone: One Million Meals</h3>
                    <p className="text-gray-600 mb-4">GreenTable celebrates providing one million meals to those in need through our network of generous donors.</p>
                    <a href="#" className="inline-flex items-center text-green-600 font-semibold hover:text-green-700">
                      Read more <ArrowRight size={16} className="ml-1" />
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-10">
                <a href="#" className="inline-flex items-center text-green-600 font-semibold hover:text-green-700 text-lg">
                  View all news <ArrowRight size={20} className="ml-1" />
                </a>
              </div>
            </div>
          </section>
        )}


        {/* {Delivery Section} */}
        {activeTab ==='track-order'&&(<DonorDeliveryPage/>)}

        {activeTab === 'about' && (
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-8">About <span className="font-bold  text-green-700">Green<span className="text-green-500">Table</span></span></h1>
                
                
                <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
                  <div className="flex flex-col md:flex-row items-center mb-8">
                    <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
                      <img src="https://img1.wsimg.com/isteam/ip/3225f5e5-db0d-40bf-84f5-ba29b8a20ed0/DSC_0190.JPG/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=w:1280" alt="Our mission" className="rounded-lg shadow-md" />
                    </div>
                    <div className="md:w-1/2">
                      <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                      <p className="text-gray-700 mb-4">
                        GreenTable is dedicated to reducing food waste while addressing hunger in our communities. We connect businesses with surplus food to organizations that can distribute it to those in need.
                      </p>
                      <p className="text-gray-700">
                        Our platform makes food donation simple, efficient, and rewarding for businesses of all sizes, from local cafes to large grocery chains.
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-8">
                    <h2 className="text-2xl font-bold mb-4">Our Impact</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-green-50 rounded-lg p-5 text-center">
                        <div className="text-3xl font-bold text-green-700 mb-2">250+</div>
                        <p className="text-gray-700">Business Partners</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-5 text-center">
                        <div className="text-3xl font-bold text-green-700 mb-2">50,000+</div>
                        <p className="text-gray-700">Meals Per Month</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-5 text-center">
                        <div className="text-3xl font-bold text-green-700 mb-2">30+</div>
                        <p className="text-gray-700">Community Organizations</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-6">
                      Since our founding in 2020, we've diverted over 500,000 pounds of food from landfills and provided over 1 million meals to those in need. Our network continues to grow as more businesses recognize the value of food donation.
                    </p>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-8 mt-8">
                    <h2 className="text-2xl font-bold mb-4">Our Team</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="mb-4">
                          <img src="https://static.vecteezy.com/system/resources/previews/011/797/372/non_2x/human-brain-as-digital-circuit-board-artificial-intelligence-icon-techno-human-head-logo-concept-creative-idea-free-vector.jpg" alt="Team member" className="rounded-full w-32 h-32 mx-auto object-cover" />
                        </div>
                        <h3 className="text-xl font-semibold">Saieeraj Acharya</h3>
                        <p className="text-gray-600">Founder & CEO</p>
                      </div>
                      <div className="text-center">
                        <div className="mb-4">
                          <img src="https://static.vecteezy.com/system/resources/previews/023/079/202/non_2x/operations-icon-workflow-illustration-sign-work-flow-symbol-automate-logo-vector.jpg" alt="Team member" className="rounded-full w-32 h-32 mx-auto object-cover" />
                        </div>
                        <h3 className="text-xl font-semibold">Ishan Hegde</h3>
                        <p className="text-gray-600">Operations Director</p>
                      </div>
                      <div className="text-center">
                        <div className="mb-4">
                          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTixRdKhO8MulDiruE5CkWfc-z0PEk6QRrcVFEcjdPyrWlrfuGHkqvAuEljYNAadbURFkk&usqp=CAU" alt="Team member" className="rounded-full w-32 h-32 mx-auto object-cover" />
                        </div>
                        <h3 className="text-xl font-semibold">Shantanu Karekar</h3>
                        <p className="text-gray-600">Community Partnerships</p>
                      </div>
                    </div>
                    </div>
                  
                  <div className="border-t border-gray-200 pt-8 mt-8">
                    <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
                    <p className="text-gray-700 mb-4">
                      Have questions about our program or want to learn more about how your business can get involved? Reach out to us!
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-2">Email</h3>
                        <p className="text-gray-700">contact@greentable.org</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Phone</h3>
                        <p className="text-gray-700">9999 888 222</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white pt-12 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">GreenTable</h3>
              <p className="text-gray-400 mb-4">Connecting surplus food with those who need it most while reducing waste and building community.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Donate Food</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Rewards Program</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">News</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Food Safety Guidelines</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Tax Benefits</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Partner Directory</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Contact Support</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <p className="text-gray-400 mb-4">Subscribe to our newsletter for updates, success stories, and more.</p>
              <form className="flex flex-col space-y-2">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button 
                  type="submit" 
                  className="!bg-green-600 !hover:bg-green-700 text-white px-4 py-2 rounded-md !transition-colors duration-300"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">© 2025 GreenTable. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Scroll to top button */}
      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="!fixed !bottom-8 right-8 !bg-green-600 !text-white p-3 rounded-full shadow-lg !hover:bg-green-700 transition-all !duration-300 z-50"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}
                  