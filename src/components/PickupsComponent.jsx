import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaSearch, FaShoppingCart, FaClock, FaClipboardList,
    FaHome, FaTruck, FaMap, FaDollarSign, FaPowerOff,
    FaCartPlus, FaTrash, FaEllipsisV, FaImage,
    FaChevronRight, FaTimes, FaUtensils, FaMoneyBillWave,FaUser,FaEnvelope,
    FaExclamationTriangle
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';
import Navbar from './Navbar';

const PickupsComponent = () => {
    // States
    const [pickups, setPickups] = useState([]);
    
    const [cart, setCart] = useState([]);
    const [isCartVisible, setIsCartVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
      const [activeLink, setActiveLink] = useState('/home/pickups');
    
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState(null);
    const [activeItemId, setActiveItemId] = useState(null);
    const [foodImages, setFoodImages] = useState({});
    const [removalCount, setRemovalCount] = useState({});
    const [removalTimestamps, setRemovalTimestamps] = useState(() => {
        const saved = localStorage.getItem('removalTimestamps');
        return saved ? JSON.parse(saved) : {};
    });

    const PEXELS_API_KEY = 'mHLbR4TSKvY6a5KaXBQ52uPPVCYPC6DjkRLP0m2SVSu1AakSiQjEGfjO'; 
    

    // Function to fetch all surplus items and their statuses
    const fetchSurplusData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:3001/get-surplus');
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching surplus data:', error);
            setError('Failed to load items. Please try again later.');
            return [];
        } finally {
            setLoading(false);
        }
    };

    // Function to check accepted items from cookies
    const checkAcceptedItems = useCallback(async () => {
        // Get all items
        const allItems = await fetchSurplusData();
        
        // Check for accepted items in cookies
        const acceptedItemIds = [];
        const cookies = Cookies.get();
        
        Object.keys(cookies).forEach(key => {
            if (key.startsWith('pickedup_item_')) {
                const itemId = key.replace('pickedup_item_', '');
                acceptedItemIds.push(itemId);
            }
        });
        
        // Filter items based on status and cookies
        const availableItems = allItems.filter(item => 
            item.status === 'Available' && !acceptedItemIds.includes(item._id)
        );
        
        const cartItems = allItems.filter(item => 
            (item.status === 'accepted' || acceptedItemIds.includes(item._id))
        );
        
        setPickups(availableItems);
        setCart(cartItems);
        
        // Also check status with backend for each item in cookie
        acceptedItemIds.forEach(async (itemId) => {
            try {
                const statusResponse = await axios.get(`http://localhost:3001/check-item-status/${itemId}`);
                if (statusResponse.data.status !== 'accepted') {
                    // If the backend says it's not accepted anymore, remove the cookie
                    Cookies.remove(`pickedup_item_${itemId}`);
                    
                    // Refresh the data
                    checkAcceptedItems();
                }
            } catch (error) {
                console.error('Error checking item status:', error);
            }
        });
    }, []);

    useEffect(() => {
        checkAcceptedItems();
    }, [checkAcceptedItems]);

    useEffect(() => {
        // Fetch images for each food item
        const fetchFoodImages = async () => {
            const allItems = [...pickups, ...cart];
            const imagePromises = allItems.map(async (item) => {
                // If we already have the image, don't fetch it again
                if (foodImages[item._id]) {
                    return { [item._id]: foodImages[item._id] };
                }
                
                try {
                    // Pexels API endpoint
                    const pexelsUrl = `https://api.pexels.com/v1/search?query=${item.name} indian food&per_page=1`;
                    const pexelsResponse = await axios.get(pexelsUrl, {
                        headers: {
                            Authorization: PEXELS_API_KEY,
                        },
                    });

                    // Extract image URL from Pexels API response
                    const imageUrl = pexelsResponse.data.photos[0]?.src.medium || null;
                    return { [item._id]: imageUrl };
                } catch (error) {
                    console.error(`Error fetching image for ${item.name}:`, error);
                    return { [item._id]: null };
                }
            });

            const imageResults = await Promise.all(imagePromises);
            // Combine image URLs into a single object
            const images = Object.assign({}, ...imageResults);
            setFoodImages(prevImages => ({...prevImages, ...images}));
        };

        if (pickups.length > 0 || cart.length > 0) {
            fetchFoodImages();
        }
    }, [pickups, cart, foodImages]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };


    const capitalizeName = (name) => {
        if (!name) return '';
        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
      };
      

    const handleAccept = async (item) => {
        try {
            const response = await axios.post(`http://localhost:3001/accept-pickup/${item._id}`, {
                status: 'accepted'
            });

            if (response.status === 200) {
                // Set the cookie with the itemId
                Cookies.set(`pickedup_item_${item._id}`, 'accepted', { expires: 1 });  // Expires in 1 day
                
                setCart(prevCart => [...prevCart, {...item, status: 'accepted'}]);
                setPickups(prevPickups => prevPickups.filter(pickup => pickup._id !== item._id));
                showNotification(`${item.name} added to cart successfully!`);
            }
        } catch (error) {
            console.error('Error accepting item:', error);
            showNotification('Failed to add item to cart', 'error');
        }
    };

    useEffect(() => {
        localStorage.setItem('removalTimestamps', JSON.stringify(removalTimestamps));
    }, [removalTimestamps]);

    const handleRemoveFromCart = async (item) => {
        try {
            const now = Date.now();
            const updatedTimestamps = { ...removalTimestamps };

            // Initialize timestamps array if it doesn't exist
            if (!updatedTimestamps[item._id]) {
                updatedTimestamps[item._id] = [];
            }

            // Add the current timestamp
            updatedTimestamps[item._id].push(now);

            // Keep only timestamps within the last 15 minutes
            const cutoff = now - 15 * 60 * 1000;
            updatedTimestamps[item._id] = updatedTimestamps[item._id].filter(ts => ts >= cutoff);

            // Update count
            const recentCount = updatedTimestamps[item._id].length;
            setRemovalCount(prev => ({ ...prev, [item._id]: recentCount }));
            setRemovalTimestamps(updatedTimestamps); // This auto-persisted via useEffect

            // Show warning toast based on recent removal count
            if (recentCount >= 1 && recentCount < 5) {
                toast('Repeated cancellations may restrict your account.', {
                    icon: '⚠️',
                    style: {
                        background: 'linear-gradient(135deg, #fff8d6, #fce47c)',
                        color: '#2c2c2c',
                        borderLeft: '6px solid #f5b301',
                        borderRadius: '10px',
                        padding: '14px 22px',
                        fontWeight: '500',
                        fontSize: '15px',
                        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.08)',
                        transition: 'all 0.3s ease-in-out',
                    },
                });
            }
            
            if (recentCount === 5) {
                toast('Final Warning: You may be blacklisted.', {
                    icon: '🚨',
                    style: {
                        background: 'linear-gradient(135deg, #ff4b5c, #ff6b6b)',
                        color: '#ffffff',
                        borderLeft: '6px solid #ff0000',
                        borderRadius: '10px',
                        padding: '14px 22px',
                        fontWeight: '600',
                        fontSize: '15px',
                        boxShadow: '0 6px 14px rgba(0, 0, 0, 0.12)',
                        transition: 'all 0.3s ease-in-out',
                    },
                });

                try {
                    await axios.post('http://localhost:3001/flag-user', {
                        reason: 'Repeated cancellations within short time',
                        itemId: item._id,
                        count: recentCount,
                    });
                } catch (flagError) {
                    console.error('Error flagging user:', flagError);
                }
            }

            // Perform actual removal
            const response = await axios.post(`http://localhost:3001/reject-pickup/${item._id}`);
            if (response.status === 200) {
                Cookies.remove(`pickedup_item_${item._id}`);
                setCart(prevCart => prevCart.filter(cartItem => cartItem._id !== item._id));
                setPickups(prevPickups => [...prevPickups, { ...item, status: 'Available' }]);
                toast.success(`${item.name} removed from cart.`);
            }
        } catch (error) {
            console.error('Error removing item:', error);
            toast.error('Failed to remove item.');
        }
    };


    const handleDelete = async (itemId) => {
        try {
            const response = await axios.delete(`http://localhost:3001/delete-pickup/${itemId}`);
            if (response.status === 200) {
                setPickups(prevPickups => prevPickups.filter(item => item._id !== itemId));
                showNotification('Item deleted successfully!');
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            showNotification('Failed to delete item', 'error');
        }
    };

    const filteredPickups = pickups.filter(item => {
        const fullName = `${item.donor?.firstName || ''} ${item.donor?.lastName || ''}`.toLowerCase();
        const search = searchTerm.toLowerCase();
    
        return (
            item.name.toLowerCase().includes(search) ||
            item.description.toLowerCase().includes(search) ||
            fullName.includes(search)
        );
    });
    

    const cartTotal = cart.reduce((total, item) => total + (item.price || 0), 0);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-emerald-600 text-xl">Loading...</div>
            </div>
        );
    }

    return (<>

    
        <Navbar activeLink={activeLink} setActiveLink={setActiveLink} />
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-[#f8fafc]! text-gray-900! relative overflow-hidden! font-sans! mt-16"
        >
            {/* Minimalist Header */}
            <header className="backdrop-blur-md! bg-white/80! py-4! px-4! lg:px-8! sticky! top-0! z-50! border-b! border-gray-100!">
                <div className="container mx-auto! max-w-7xl! flex items-center! justify-between! relative!">
                    <Link to="/home" className="flex items-center! space-x-2! group!">
                        <FaHome className="text-2xl! text-emerald-500! group-hover:text-emerald-600! transition-colors!" />
                        <span className="text-2xl! font-light! tracking-tight! text-gray-900!">
                            Green<span className="font-bold! text-emerald-500!">Table</span>
                        </span>
                    </Link>
                    
                    <div className="flex items-center! space-x-6! ml-auto!">
                        <div className="relative hidden md:block!">
                            <input
                                type="text"
                                placeholder="Search dishes..."
                                className="w-72! lg:w-96! px-5! py-2.5! rounded-full! bg-gray-50! border! border-gray-200! 
                                    focus:outline-none! focus:ring-2! focus:ring-emerald-500/20! focus:border-emerald-500! 
                                    transition-all! text-gray-600! placeholder-gray-400!"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <FaSearch className="absolute! right-4! top-1/2! -translate-y-1/2! text-gray-400!" />
                        </div>
                        
                        <button
                            className="relative bg-black! text-[aquamarine]! px-6! py-2.5! rounded-full! hover:bg-gray-900! 
                                transition-all! duration-300! flex items-center! space-x-2! group!"
                            onClick={() => setIsCartVisible(!isCartVisible)}
                        >
                            <FaShoppingCart className="text-lg!" />
                            <span className="hidden sm:inline-block!">Cart</span>
                            <span className="absolute -top-2! -right-2! bg-emerald-500! text-white! w-6! h-6! 
                                rounded-full! flex items-center! justify-center! text-xs! font-bold!">
                                {cart.length}
                            </span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Search - Visible on small screens */}
            <div className="md:hidden! px-4! py-3! bg-white! border-b! border-gray-100!">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search dishes..."
                        className="w-full! px-5! py-2.5! rounded-full! bg-gray-50! border! border-gray-200! 
                            focus:outline-none! focus:ring-2! focus:ring-emerald-500/20! focus:border-emerald-500! 
                            transition-all! text-gray-600! placeholder-gray-400!"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="absolute! right-4! top-1/2! -translate-y-1/2! text-gray-400!" />
                </div>
            </div>

            {/* Elegant Grid Layout */}
            <main className="container mx-auto! max-w-7xl! px-4! lg:px-8! py-12!">
                <h2 className="text-3xl! font-light! text-gray-900! mb-8! tracking-tight!">
                    Available <span className="font-bold! text-emerald-500!">Dishes</span>
                </h2>
                
                {filteredPickups.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                        <FaUtensils className="text-5xl mb-4 text-gray-300" />
                        <p className="text-xl font-medium">No available dishes at the moment</p>
                        <p className="text-gray-400 mt-2">Check back later for more delicious options!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1! sm:grid-cols-2! lg:grid-cols-3! gap-6! xl:gap-8!">
                        {filteredPickups.map((item) => (
                            <motion.div
                                key={item._id}
                                className="group relative bg-white! rounded-2xl! overflow-hidden! shadow-sm! hover:shadow-xl! 
                                    transition-all! duration-500! flex flex-col!"
                                whileHover={{ y: -4 }}
                            >
                                <div className="relative aspect-[4/3]! overflow-hidden!">
                                    <img
                                        src={foodImages[item._id]}
                                        alt={item.name}
                                        className="w-full! h-full! object-cover! transition-transform! duration-500! 
                                            group-hover:scale-110!"
                                    />
                                    <div className="absolute inset-0! bg-gradient-to-t! from-black/60! to-transparent! 
                                        opacity-0! group-hover:opacity-100! transition-opacity! duration-300!"></div>
                                </div>

                                <div className="p-6! flex-grow! flex flex-col!">
                                    <div className="flex justify-between! items-start! mb-4!">
                                        <h3 className="text-xl! font-semibold! text-gray-900! leading-tight!">{item.name}</h3>
                                        <button 
                                            className="p-2! rounded-full! hover:bg-gray-100! transition-colors!"
                                            onClick={() => setActiveItemId(activeItemId === item._id ? null : item._id)}
                                        >
                                            <FaEllipsisV className="text-gray-400!" />
                                        </button>
                                    </div>

                                    <p className="text-gray-600! text-sm! mb-4! line-clamp-2!">{item.description}</p>

                                    <div className="space-y-2! mb-6!">
                                        <div className="flex items-center! text-sm! text-gray-500!">
                                            <FaClock className="mr-2! text-emerald-500!" />
                                            <span>{item.pickupTime}</span>
                                        </div>
                                        <div className="flex items-center! text-sm! text-gray-500!">
                                            <FaClipboardList className="mr-2! text-emerald-500!" />
                                            <span>{item.quantity} available</span>
                                        </div>
                                        <div className="flex items-center! text-sm! text-gray-500!">
        <FaUser className="mr-2! text-emerald-500!" />
        <span><strong>{capitalizeName(item.donor.firstName)} {capitalizeName(item.donor.lastName)}</strong></span>
    </div>
    <div className="flex items-center! text-sm! text-gray-500!">
        <FaEnvelope className="mr-2! text-emerald-500!" />
        <span>{item.donor.email}</span>
    </div>
                                        {item.price && (
                                            <div className="flex items-center! text-sm! font-medium! text-emerald-600!">
                                                <FaMoneyBillWave className="mr-2!" />
                                                <span>₹{item.price.toFixed(2)}</span>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => handleAccept(item)}
                                        className="mt-auto! w-full! bg-black! text-[aquamarine]! py-3! rounded-xl! 
                                            hover:bg-emerald-500! hover:text-white! transition-all! duration-300! 
                                            flex items-center! justify-center! space-x-2! group!"
                                    >
                                        <span>Add to Cart</span>
                                        <FaCartPlus className="transition-transform! group-hover:translate-x-1!" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>

            {/* Refined Cart Sidebar */}
            <AnimatePresence>
                {isCartVisible && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0! bg-black/40! backdrop-blur-sm! z-40!"
                            onClick={() => setIsCartVisible(false)}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed top-0! right-0! w-full! sm:w-[420px]! h-full! bg-white! z-50! 
                                flex flex-col!"
                        >
                            <div className="p-6! border-b! border-gray-100!">
                                <div className="flex items-center! justify-between! mb-2!">
                                    <h3 className="text-xl! font-semibold! text-gray-900!">Shopping Cart</h3>
                                    <button
                                        onClick={() => {
    setIsCartVisible(false);
    setTimeout(() => {
        window.location.reload();
    }, 500);
}}

                                        className="p-2! rounded-full! hover:bg-gray-100! transition-colors!"
                                    >
                                        <FaTimes className="text-gray-400!" />
                                    </button>
                                </div>
                                <p className="text-sm! text-gray-500!">{cart.length} items</p>
                            </div>

                            <div className="flex-1! overflow-y-auto! px-6! py-4!">
                                {cart.length === 0 ? (
                                    <div className="h-full! flex flex-col! items-center! justify-center! text-center!">
                                        <FaShoppingCart className="text-4xl! text-gray-300! mb-4!" />
                                        <p className="text-gray-500! font-medium!">Your cart is empty</p>
                                        <p className="text-sm! text-gray-400! mt-2!">Add some delicious dishes!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4!">
                                        {cart.map((item) => (
                                            <motion.div
                                                key={item._id}
                                                layout
                                                className="flex items-center! gap-4! p-4! bg-gray-50! rounded-xl! 
                                                    group! hover:bg-gray-100! transition-colors!"
                                            >
                                                <img
                                                    src={foodImages[item._id]}
                                                    alt={item.name}
                                                    className="w-20! h-20! rounded-lg! object-cover!"
                                                />
                                                <div className="flex-1!">
                                                    <h4 className="font-medium! text-gray-900!">{item.name}</h4>
                                                    <p className="text-sm! text-gray-500!">{item.pickupTime}</p>
                                                    {item.price && (
                                                        <p className="text-sm! font-medium! text-emerald-600!">
                                                            ₹{item.price.toFixed(2)}
                                                        </p>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveFromCart(item)}
                                                    className="p-2! text-gray-400! hover:text-red-500! 
                                                        transition-colors!"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {cart.length > 0 && (
                                <div className="border-t! border-gray-100! p-6! bg-white!">
                                    <div className="flex items-center! justify-between! mb-4!">
                                        <span className="text-gray-600!">Total</span>
                                        <span className="text-xl! font-semibold! text-gray-900!">
                                            ₹{cartTotal.toFixed(2)}
                                        </span>
                                    </div>
                                    <button className="w-full! bg-emerald-500! text-white! py-3! rounded-xl! 
                                        hover:bg-emerald-600! transition-colors! flex items-center! justify-center! 
                                        space-x-2! group!">
                                        <span>Checkout</span>
                                        <FaChevronRight className="transition-transform! group-hover:translate-x-1!" />
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Enhanced Notifications with Warning Types */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className={`fixed bottom-6! right-6! px-6! py-4! rounded-xl! shadow-lg! 
                            backdrop-blur-md! ${
                                notification.type === 'success' 
                                    ? 'bg-emerald-500/90! text-white!' 
                                    : notification.type === 'warning'
                                    ? 'bg-amber-500/90! text-white!'
                                    : 'bg-red-500/90! text-white!'
                            } flex items-center! space-x-3! z-50!`}
                    >
                        {notification.type === 'warning' || notification.type === 'error' ? (
                            <FaExclamationTriangle className="mr-2" />
                        ) : null}
                        {notification.message}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Minimal Footer */}
            <footer className="!fixed !bottom-0 !left-0 !w-full !py-1 !px-1 !bg-emerald-500 !border-t !border-emerald-600">
                <div className="container !mx-auto !max-w-7xl !text-center">
                    <p className="!text-sm !text-white">
                        &copy; {new Date().getFullYear()} GreenTable. Making food sharing delightful.
                    </p>
                </div>
            </footer>
        <Toaster position="top-right"/>
        </motion.div></>
    );
};

export default PickupsComponent;