import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Truck, Map, ClipboardList, DollarSign, Power,
  Bell, Menu, X, Leaf, ChevronRight,Car
} from 'lucide-react';

const Navbar = ({ activeLink, setActiveLink }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { title: 'Home', icon: <Home className="w-5 h-5" />, path: '/home' },
    { title: 'Pickups', icon: <Truck className="w-5 h-5" />, path: '/home/pickups', alert: false },
    { title: 'Delivery', icon: <Car className="w-5 h-5" />, path: '/home/delivery' },
    { title: 'Maps', icon: <Map className="w-5 h-5" />, path: '/home/maps' },
    { title: 'Past Orders', icon: <ClipboardList className="w-5 h-5" />, path: '/home/pastorders' },
    { title: 'Payment', icon: <DollarSign className="w-5 h-5" />, path: '/payment' },
    { title: 'Logout', icon: <Power className="w-5 h-5" />, path: '/login' }
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full z-50 bg-gradient-to-r from-gray-600 to-emerald-900 backdrop-blur-lg shadow-xl border-b border-emerald-700/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link 
            to="/home" 
            className="flex items-center space-x-3 group"
            onClick={() => setActiveLink('/home')}
          >
            <motion.div 
              whileHover={{ rotate: [-10, 10, -10], scale: 1.1 }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="p-2 rounded-full bg-emerald-700/30 backdrop-blur-sm"
            >
              <Leaf className="w-8 h-8 text-emerald-300 group-hover:text-emerald-200 transition-colors" />
            </motion.div>
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold bg-gradient-to-r from-emerald-300 to-green-100 bg-clip-text text-transparent"
            >
              GreenTable
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-evenly flex-1 space-x-6">
            {navLinks.map((link) => (
              <motion.div
                key={link.path}
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <Link
                  to={link.path}
                  onClick={() => setActiveLink(link.path)}
                  className={`flex items-center px-4 py-2.5 space-x-2 text-sm font-medium transition-all
                    ${activeLink === link.path 
                      ? 'text-emerald-50 bg-emerald-700/30 rounded-lg' 
                      : 'text-emerald-100/90 hover:text-emerald-50 hover:bg-emerald-700/20 rounded-lg'}`}
                >
                  <motion.span whileHover={{ scale: 1.15 }}>
                    {link.icon}
                  </motion.span>
                  <span>{link.title}</span>
                  {link.alert && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 bg-rose-400 rounded-full absolute top-2 right-2"
                    />
                  )}
                </Link>
                {activeLink === link.path && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="lg:hidden p-2 text-emerald-100 hover:bg-emerald-700/30 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-emerald-800/95 backdrop-blur-lg border-b border-emerald-700/50"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => {
                      setActiveLink(link.path);
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors
                      ${activeLink === link.path 
                        ? 'bg-emerald-700/40 text-emerald-50' 
                        : 'text-emerald-100/90 hover:bg-emerald-700/30 hover:text-emerald-50'}`}
                  >
                    <div className="flex items-center space-x-3">
                      {link.icon}
                      <span className="font-medium">{link.title}</span>
                    </div>
                    {activeLink === link.path && (
                      <ChevronRight className="w-5 h-5 text-emerald-400" />
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
