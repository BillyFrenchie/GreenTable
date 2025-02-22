import React, { useState, useEffect } from 'react';
import { MapPin, Truck, CheckCircle, Package, Clock, Phone, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button.jsx';
import { Alert } from '../components/ui/alert.jsx';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:3001');

const DonorDeliveryPage = () => {
    const [deliveryItems, setDeliveryItems] = useState([]);
    const [expandedItems, setExpandedItems] = useState({});

    useEffect(() => {
        const fetchDeliveryItems = async () => {
            try {
                const response = await axios.get('http://localhost:3001/get-donor-deliveries', {
                    withCredentials: true
                });

                if (Array.isArray(response.data.deliveries)) {
                    setDeliveryItems(response.data.deliveries);
                } else if (typeof response.data === "object" && response.data !== null) {
                    setDeliveryItems([response.data]);
                } else {
                    setDeliveryItems([]);
                }
            } catch (error) {
                console.error('Error fetching deliveries:', error);
            }
        };

        fetchDeliveryItems();

        socket.on('delivery-updated', (data) => {
            setDeliveryItems((prevItems) =>
                prevItems.map((item) =>
                    item._id === data.itemId ? { ...item, status: data.status, deliveryDetails: data.deliveryDetails } : item
                )
            );
        });

        return () => {
            socket.off('delivery-updated');
        };
    }, []);

    const toggleExpand = (itemId) => {
        setExpandedItems(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    const handleConfirmDelivery = async (itemId) => {
        try {
            await axios.post(`http://localhost:3001/confirm-delivery/${itemId}`);
            setDeliveryItems((prevItems) => prevItems.filter(item => item._id !== itemId));
        } catch (error) {
            console.error('Error confirming delivery:', error);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'In Progress':
                return <Truck className="w-6 h-6 !important animate-bounce" />;
            case 'Delivered':
            case 'Completed':
                return <CheckCircle className="w-6 h-6 !important animate-pulse" />;
            default:
                return <Clock className="w-6 h-6 !important animate-spin" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'In Progress':
                return 'text-emerald-500 !important bg-emerald-50 !important';
            case 'Delivered':
            case 'Completed':
                return 'text-green-600 !important bg-green-50 !important';
            default:
                return 'text-gray-600 !important bg-gray-50 !important';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white !important p-6 !important">
            <div className="max-w-7xl mx-auto !important">
                <div className="text-center mb-12 !important">
                    <h1 className="text-4xl font-bold text-emerald-800 !important mb-4 !important">
                        Track Your Donations
                    </h1>
                    <p className="text-emerald-600 !important text-lg !important">
                        Monitor your donations and their delivery status in real-time
                    </p>
                </div>

                {deliveryItems.length === 0 ? (
                    <Alert className="bg-white !important border-2 !important border-emerald-100 !important shadow-lg !important">
                        <Package className="w-12 h-12 !important text-emerald-500 !important mb-4 !important" />
                        <p className="text-emerald-800 !important text-lg !important text-center !important">
                            No active deliveries at the moment. Your donations will appear here once they're scheduled.
                        </p>
                    </Alert>
                ) : (
                    <div className="space-y-8 !important">
                        {deliveryItems.map((item) => (
                            <Card
                                key={item._id}
                                className={`transform transition-all duration-300 !important 
                  hover:shadow-xl !important border-2 !important border-emerald-100 !important
                  ${expandedItems[item._id] ? 'scale-102' : 'scale-100'}`}
                            >
                                <CardHeader
                                    className="bg-white cursor-pointer !important"
                                    onClick={() => toggleExpand(item._id)}
                                >
                                    <div className="flex justify-between items-center !important">
                                        <div className="flex items-center space-x-4 !important">
                                            <Package className="w-8 h-8 text-emerald-600 !important" />
                                            <div>
                                                <CardTitle className="text-2xl font-bold text-emerald-800 !important">
                                                    {item.name}
                                                </CardTitle>
                                                <p className="text-emerald-600 !important">
                                                    Donation ID: {item._id?.slice(-6)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4 !important">
                                            <div
                                                className={`flex items-center space-x-2 !important px-4 !important py-2 !important 
                        rounded-full !important ${getStatusColor(item.status)}`}>
                                                {getStatusIcon(item.status)}
                                                <span className="font-semibold !important">{item.status}</span>
                                            </div>
                                            {expandedItems[item._id] ?
                                                <ChevronUp className="w-6 h-6 text-emerald-600 !important" /> :
                                                <ChevronDown className="w-6 h-6 text-emerald-600 !important" />
                                            }
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className={`transition-all duration-300 !important
                  ${expandedItems[item._id] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} 
                  overflow-hidden !important`}>
                                    <div
                                        className="p-6 space-y-6 !important bg-emerald-50/50 !important rounded-lg !important mt-4 !important">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 !important">
                                            <div className="flex items-start space-x-4 !important">
                                                <MapPin className="w-6 h-6 text-emerald-600 !important mt-1 !important" />
                                                <div>
                                                    <h4 className="font-semibold text-emerald-800 !important mb-2 !important">
                                                        Delivery Location
                                                    </h4>
                                                    <p className="text-emerald-600 !important">
                                                        {item.deliveryDetails?.address || 'Pending assignment'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start space-x-4 !important">
                                                <Clock className="w-6 h-6 text-emerald-600 !important mt-1 !important" />
                                                <div>
                                                    <h4 className="font-semibold text-emerald-800 !important mb-2 !important">
                                                        Pickup Instructions
                                                    </h4>
                                                    <p className="text-emerald-600 !important">
                                                        {item.pickupInstructions || 'No special instructions'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start space-x-4 !important">
                                                <Phone className="w-6 h-6 text-emerald-600 !important mt-1 !important" />
                                                <div>
                                                    <h4 className="font-semibold text-emerald-800 !important mb-2 !important">
                                                        Contact Information
                                                    </h4>
                                                    <p className="text-emerald-600 !important">{item.contactNumber}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-emerald-100 !important">
                                            {item.status === 'Available' && (
                                                <p className="text-emerald-600 !important text-center !important animate-pulse !important">
                                                    Waiting for a volunteer to accept your donation
                                                </p>
                                            )}

                                            {item.status === 'accepted' && (
                                                <div className="bg-emerald-100 p-4 rounded-lg !important">
                                                    <p className="text-emerald-700 !important text-center !important font-medium !important">
                                                        Your donation is being picked up!
                                                    </p>
                                                </div>
                                            )}

                                            {item.status === 'Delivered' && (
                                                <div className="text-center space-y-4 !important">
                                                    <p className="text-green-600 !important font-medium !important flex items-center justify-center !important space-x-2 !important">
                                                        <CheckCircle className="w-6 h-6 !important" />
                                                        <span>Delivery Complete</span>
                                                    </p>
                                                    <Button
                                                        onClick={() => handleConfirmDelivery(item._id)}
                                                        className="bg-green-500 hover:bg-green-600 text-white !important 
                              transform transition hover:scale-105 !important"
                                                    >
                                                        Confirm Receipt
                                                    </Button>
                                                </div>
                                            )}
                                            {(item.status === 'Completed') && (
                                                <div className="text-center space-y-4 !important">
                                                    <p className="text-green-600 !important font-medium !important flex items-center justify-center !important space-x-2 !important">
                                                        <CheckCircle className="w-6 h-6 !important" />
                                                        <span>Thank you for donating!</span>
                                                    </p>

                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DonorDeliveryPage;
