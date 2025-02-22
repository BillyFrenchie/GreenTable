import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaSearch, FaShoppingCart, FaClock, FaClipboardList,
    FaHome, FaTruck, FaMap, FaDollarSign, FaPowerOff,
    FaCartPlus, FaTrash, FaEllipsisV, FaImage,
    FaChevronRight, FaTimes, FaUtensils, FaMoneyBillWave
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const PickupsComponent = () => {
    // ... (keep existing state and effects)
    const [pickups, setPickups] = useState([]);
const [cart, setCart] = useState([]);
const [isCartVisible, setIsCartVisible] = useState(false);
const [searchTerm, setSearchTerm] = useState('');
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [notification, setNotification] = useState(null);
const [activeItemId, setActiveItemId] = useState(null);
const [foodImages, setFoodImages] = useState({});
const PEXELS_API_KEY = 'mHLbR4TSKvY6a5KaXBQ52uPPVCYPC6DjkRLP0m2SVSu1AakSiQjEGfjO'; 

useEffect(() => {
    const fetchSurplusData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:3001/get-surplus');
            setPickups(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching surplus data:', error);
            setError('Failed to load items. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    fetchSurplusData();
}, []);

useEffect(() => {
    // Fetch images for each food item
    const fetchFoodImages = async () => {
        const imagePromises = pickups.map(async (item) => {
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
        setFoodImages(images);
    };

    if (pickups.length > 0) {
        fetchFoodImages();
    }
}, [pickups]);
const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
};

const handleAccept = async (item) => {
    try {
        const response = await axios.post(`http://localhost:3001/accept-pickup/${item._id}`);

        if (response.status === 200) {
            // Set the cookie with the donorId or itemId
            Cookies.set('pickedup_item', item._id, { expires: 1 });  // Expires in 1 day
            
            setCart((prevCart) => [...prevCart, item]);
            setPickups((prevPickups) => prevPickups.filter((pickup) => pickup._id !== item._id));
            showNotification(`${item.name} added to cart successfully!`);
        }
    } catch (error) {
        console.error('Error accepting item:', error);
        showNotification('Failed to add item to cart', 'error');
    }
};

const handleRemoveFromCart = async (item) => {
    try {
        const response = await axios.post(`http://localhost:3001/reject-pickup/${item._id}`);

        if (response.status === 200) {
            setCart((prevCart) => prevCart.filter((cartItem) => cartItem._id !== item._id));
            setPickups((prevPickups) => [...prevPickups, item]);
            showNotification(`${item.name} removed from cart`);
        }
    } catch (error) {
        console.error('Error removing item:', error);
        showNotification('Failed to remove item from cart', 'error');
    }
};

const handleDelete = async (itemId) => {
    try {
        const response = await axios.delete(`http://localhost:3001/delete-pickup/${itemId}`);
        if (response.status === 200) {
            setPickups((prevPickups) => prevPickups.filter((item) => item._id !== itemId));
            showNotification('Item deleted successfully!');
        }
    } catch (error) {
        console.error('Error deleting item:', error);
        showNotification('Failed to delete item', 'error');
    }
};

const filteredPickups = pickups.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
);

const cartTotal = cart.reduce((total, item) => total + (item.price || 0), 0);

if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-emerald-600 text-xl">Loading...</div>
        </div>
    );
}

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-[#f8fafc]! text-gray-900! relative overflow-hidden! font-sans!"
        >
            {/* Minimalist Header */}
            <header className="backdrop-blur-md! bg-white/80! py-4! px-4! lg:px-8! sticky! top-0! z-50! border-b! border-gray-100!">
                <div className="container mx-auto! max-w-7xl! flex items-center! justify-between! relative!">
                    <Link to="/" className="flex items-center! space-x-2! group!">
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
                                        onClick={() => setIsCartVisible(false)}
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

            {/* Refined Notification */}
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
                                    : 'bg-red-500/90! text-white!'
                            } flex items-center! space-x-3! z-50!`}
                    >
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


        </motion.div>
    );
};

export default PickupsComponent;