import React, { useState, useEffect } from 'react';
import { MapPin, Truck, CheckCircle, Package, Clock, Phone, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button.jsx';
import { Alert } from '../components/ui/alert.jsx';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:3001');

const DeliveryPage = () => {
    const [deliveryItems, setDeliveryItems] = useState([]);
    const [expandedItems, setExpandedItems] = useState({});

    useEffect(() => {
      const fetchDeliveryItems = async () => {
          try {
              const response = await axios.get('http://localhost:3001/get-donor-deliveries', {
                  withCredentials: true
              });
  
              console.log('Fetched Deliveries:', response.data);
  
              let fetchedDeliveries = [];
              
              if (Array.isArray(response.data)) {
                  fetchedDeliveries = response.data;  // If response is already an array
              } else if (Array.isArray(response.data.deliveries)) {
                  fetchedDeliveries = response.data.deliveries;  // If response has a `deliveries` array
              } else if (typeof response.data === "object" && response.data !== null) {
                  fetchedDeliveries = [response.data];  // If response is a single object, convert it to an array
              }
  
              setDeliveryItems(fetchedDeliveries);
          } catch (error) {
              console.error('Error fetching deliveries:', error);
          }
      };
  
      fetchDeliveryItems();
  
      socket.on('delivery-completed', (updatedItem) => {
          setDeliveryItems(prevDeliveries =>
              prevDeliveries.map(delivery =>
                  delivery._id === updatedItem._id ? updatedItem : delivery
              )
          );
      });
  
      socket.on('delivery-deleted', (deletedItem) => {
          setDeliveryItems(prevDeliveries =>
              prevDeliveries.filter(delivery => delivery._id !== deletedItem._id)
          );
      });
  
      return () => {
          socket.off('delivery-completed');
          socket.off('delivery-deleted');
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
            const response = await axios.post(`http://localhost:3001/confirm-delivery/${itemId}`);
            setDeliveryItems((prevItems) => prevItems.filter(item => item._id !== itemId));
        } catch (error) {
            console.error('Error confirming delivery:', error);
        }
    };

    const updateDeliveryStatus = async (deliveryId, newStatus) => {
        try {
            if (newStatus === 'Completed') {
                const response = await axios.post(`http://localhost:3001/complete-delivery/${deliveryId}`);
                if (response.data.updatedItem) {
                    setDeliveryItems(prevDeliveries =>
                        prevDeliveries.map(delivery =>
                            delivery._id === deliveryId ? response.data.updatedItem : delivery
                        )
                    );
                }
            } else {
                const response = await axios.put(`http://localhost:3001/update-listing/${deliveryId}`, {
                    status: newStatus,
                    'deliveryDetails.deliveryStatus': newStatus
                });

                if (response.data) {
                    setDeliveryItems(prevDeliveries =>
                        prevDeliveries.map(delivery =>
                            delivery._id === deliveryId ? response.data : delivery
                        )
                    );
                }
            }
        } catch (error) {
            console.error('Error updating delivery status:', error);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'In Progress':
                return <Truck className="w-6 h-6 !important animate-bounce" />;
            case 'Completed':
            case 'Delivered':
                return <CheckCircle className="w-6 h-6 !important animate-pulse" />;
            default:
                return <Clock className="w-6 h-6 !important animate-spin" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'In Progress':
                return 'text-emerald-500 !important bg-emerald-50 !important';
            case 'Completed':
            case 'Delivered':
                return 'text-green-600 !important bg-green-50 !important';
            default:
                return 'text-emerald-700 !important bg-emerald-50 !important';
        }
    };

    return (
        <div className="min-h-screen !important bg-gradient-to-b !important from-emerald-50 !important to-white !important p-6 !important">
            <div className="max-w-9xl !important mx-auto !important">
                <div className="text-center !important mb-12 !important">
                    <h1 className="text-4xl !important font-bold !important text-emerald-800 !important mb-4 !important">
                        Active Deliveries
                    </h1>
                    <p className="text-emerald-600 !important text-lg !important">
                        Manage and track donation pickups and deliveries
                    </p>
                </div>
                {deliveryItems.length === 0 ? (
                    <Alert className="bg-white !important border-2 !important border-emerald-100 !important shadow-lg !important">
                        <Package className="w-12 !important h-12 !important text-emerald-500 !important mb-4 !important" />
                        <p className="text-emerald-800 !important text-lg !important text-center !important">
                            No active deliveries at the moment. Your generous donations will appear here.
                        </p>
                    </Alert>
                ) : (
                    <div className="space-y-8 !important ">
                        {deliveryItems.map((item) => (
                            <Card
                                key={item._id}
                                className={`transform  !important transition-all !important duration-300 !important 
                                hover:shadow-xl !important border-2 !important border-emerald-100 !important
                                ${expandedItems[item._id] ? 'scale-102 !important' : 'scale-100 !important'}`}
                            >
                                <CardHeader
                                    className="bg-white !important cursor-pointer !important"
                                    onClick={() => toggleExpand(item._id)}
                                >
                                    <div className="flex !important justify-between !important items-center !important">
                                        <div className="flex !important items-center !important space-x-4 !important">
                                            <Package className="w-8 !important h-8 !important text-emerald-600 !important" />
                                            <div>
                                                <CardTitle className="text-2xl !important font-bold !important text-emerald-800 !important">
                                                    {item.name}
                                                </CardTitle>
                                                <p className="text-emerald-600 !important">
                                                    {item.itemCount} items • Estimated: {item.estimatedTime}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex !important items-center !important space-x-4 !important">
                                            <div
                                                className={`flex !important items-center !important space-x-2 !important px-4 !important py-2 !important 
                                                rounded-full !important ${getStatusColor(item.status)}`}>
                                                {getStatusIcon(item.status)}
                                                <span className="font-semibold !important">{item.status}</span>
                                            </div>
                                            {expandedItems[item._id] ?
                                                <ChevronUp className="w-6 !important h-6 !important text-emerald-600 !important" /> :
                                                <ChevronDown className="w-6 !important h-6 !important text-emerald-600 !important" />
                                            }
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className={`transition-all !important duration-300 !important
                                ${expandedItems[item._id] ? 'max-h-96 !important opacity-100 !important' : 'max-h-0 !important opacity-0 !important'} 
                                overflow-hidden !important`}>
                                    <div
                                        className="p-6 !important space-y-6 !important bg-emerald-50/50 !important rounded-lg !important mt-4 !important">
                                        <div className="grid !important grid-cols-1 !important md:grid-cols-2 !important gap-8 !important">
                                            <div className="flex !important items-start !important space-x-4 !important">
                                                <MapPin className="w-6 !important h-6 !important text-emerald-600 !important mt-1 !important" />
                                                <div>
                                                    <h4 className="font-semibold !important text-emerald-800 !important mb-2 !important">
                                                        Delivery Location
                                                    </h4>
                                                    <p className="text-emerald-600 !important">
                                                        {item.deliveryDetails?.address || 'Not set yet'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex !important items-start !important space-x-4 !important">
                                                <Clock className="w-6 !important h-6 !important text-emerald-600 !important mt-1 !important" />
                                                <div>
                                                    <h4 className="font-semibold !important text-emerald-800 !important mb-2 !important">
                                                        Delivery Instructions
                                                    </h4>
                                                    <p className="text-emerald-600 !important">
                                                        {item.pickupInstructions || 'None provided'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex !important items-start !important space-x-4 !important">
                                                <Phone className="w-6 !important h-6 !important text-emerald-600 !important mt-1 !important" />
                                                <div>
                                                    <h4 className="font-semibold !important text-emerald-800 !important mb-2 !important">
                                                        Contact Details
                                                    </h4>
                                                    <p className="text-emerald-600 !important">{item.contactNumber}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pt-6 !important border-t !important border-emerald-100 !important">
                                            {item.status === 'Available' && (
                                                <p className="text-emerald-600 !important text-center !important animate-pulse !important">
                                                    Waiting for NGO to accept your generous donation
                                                </p>
                                            )}
                                            {item.status === 'accepted' && (
    <div className="space-y-4 !important">
        {/* First section - Get Your Items ASAP */}
        <div className="bg-emerald-100 !important p-4 !important rounded-lg !important text-center">
            <p className="text-emerald-700 !important font-medium !important">
                Get Your Items ASAP!
            </p>
        </div>

        {/* Second section - Confirmation */}
        <div className="bg-emerald-50 !important p-4 !important rounded-lg !important text-center flex flex-col md:flex-row !important 
            items-center !important justify-between !important gap-4 md:gap-8 !important w-full !important">
            <p className="text-emerald-800 !important font-semibold !important text-lg !important text-center md:text-left">
                Did You Get Your Item?
            </p>
            <Button
                onClick={() => updateDeliveryStatus(item._id, 'Delivered')}
                className="!bg-emerald-500 !important hover:bg-emerald-600 !important !text-white !important 
                transform !important transition-all !important hover:scale-105 !important px-6 !important py-2 !important text-sm !important md:text-base"
            >
                Yes, I Got It!
            </Button>
        </div>
    </div>
)}




                                            {item.status === 'Delivered' && (
                                                <div className="text-center !important space-y-4 !important">
                                                    <p className="!text-green-600 !important font-medium !important flex !important items-center !important justify-center !important space-x-2 !important">
                                                        <CheckCircle className="w-6 !important h-6 !important" />
                                                        <span>Successfully Delivered</span>
                                                    </p>
                                                    <Button
                                                        onClick={() => handleConfirmDelivery(item._id)}
                                                        className="!bg-green-500 !important hover:bg-green-600 !important !text-black !important 
                                                        transform !important transition !important hover:scale-105 !important"
                                                    >
                                                        Confirm Delivery
                                                    </Button>
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

export default DeliveryPage;
