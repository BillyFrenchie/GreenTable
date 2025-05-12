import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Truck,
  CheckCircle,
  Package,
  Clock,
  Phone,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button.jsx';
import { Alert } from '../components/ui/alert.jsx';
import io from 'socket.io-client';
import Cookies from 'js-cookie';

import axios from 'axios';
import Navbar from './Navbar.jsx';
import DeliverySimulation from './DeliverySimulation.jsx';

const socket = io('http://localhost:3001');

const getStatusProgressWidth = (status) => {
  switch (status) {
    case 'Available':
      return '10%';
    case 'accepted':
      return '30%';
    case 'In Progress':
      return '60%';
    case 'Out for Delivery':
      return '85%';
    case 'Delivered':
    case 'Completed':
      return '100%';
    default:
      return '0%';
  }
};

const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'Available':
      return '!bg-gray-100 !text-gray-700';
    case 'accepted':
      return '!bg-blue-100 !text-blue-700';
    case 'In Progress':
      return '!bg-yellow-100 !text-yellow-700';
    case 'Out for Delivery':
      return '!bg-amber-100 !text-amber-700';
    case 'Delivered':
    case 'Completed':
      return '!bg-green-100 !text-green-700';
    default:
      return '!bg-gray-100 !text-gray-700';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'In Progress':
      return <Truck className="!w-6 !h-6 !text-yellow-500 !animate-bounce" />;
    case 'Completed':
    case 'Delivered':
      return <CheckCircle className="!w-6 !h-6 !text-green-600 !animate-pulse" />;
    case 'Out for Delivery':
      return <Truck className="!w-6 !h-6 !text-amber-600 !animate-spin" />;
    case 'accepted':
      return <Package className="!w-6 !h-6 !text-blue-600" />;
    case 'Available':
      return <Clock className="!w-6 !h-6 !text-gray-600 !animate-spin" />;
    default:
      return <Clock className="!w-6 !h-6 !text-gray-600 !animate-spin" />;
  }
};

const DeliveryPage = () => {
  const [deliveryItems, setDeliveryItems] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});
  const [activeLink, setActiveLink] = useState('/home/delivery');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const fetchDeliveryItems = async () => {
      try {
        const response = await axios.get('http://localhost:3001/get-donor-deliveries', {
          withCredentials: true,
        });
        console.log('Fetched Deliveries:', response.data);

        let fetchedDeliveries = [];

        if (Array.isArray(response.data)) {
          fetchedDeliveries = response.data;
        } else if (Array.isArray(response.data.deliveries)) {
          fetchedDeliveries = response.data.deliveries;
        } else if (typeof response.data === 'object' && response.data !== null) {
          fetchedDeliveries = [response.data];
        }

        setDeliveryItems(fetchedDeliveries);
      } catch (error) {
        console.error('Error fetching deliveries:', error);
      }
    };

    fetchDeliveryItems();

    socket.on('delivery-completed', (updatedItem) => {
      setDeliveryItems((prevDeliveries) =>
        prevDeliveries.map((delivery) =>
          delivery._id === updatedItem._id ? updatedItem : delivery
        )
      );
      setToastMessage(`Delivery "${updatedItem.name}" marked as completed!`);
      setTimeout(() => setToastMessage(''), 4000);
    });

    socket.on('delivery-deleted', (deletedItem) => {
      setDeliveryItems((prevDeliveries) =>
        prevDeliveries.filter((delivery) => delivery._id !== deletedItem._id)
      );
      setToastMessage(`Delivery "${deletedItem.name}" has been removed.`);
      setTimeout(() => setToastMessage(''), 4000);
    });

    return () => {
      socket.off('delivery-completed');
      socket.off('delivery-deleted');
    };
  }, []);

  const toggleExpand = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleConfirmDelivery = async (itemId) => {
    try {
      const response = await axios.post(`http://localhost:3001/confirm-delivery/${itemId}`);
      setDeliveryItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
      setToastMessage('Delivery confirmed successfully!');
       Cookies.remove(`pickedup_item_${item._id}`);
      setTimeout(() => setToastMessage(''), 4000);
    } catch (error) {
      console.error('Error confirming delivery:', error);
      setToastMessage('Failed to confirm delivery.');
      setTimeout(() => setToastMessage(''), 4000);
    }
  };

  const updateDeliveryStatus = async (deliveryId, newStatus) => {
    try {
      if (newStatus === 'Completed') {
        const response = await axios.post(`http://localhost:3001/complete-delivery/${deliveryId}`);
        if (response.data.updatedItem) {
          setDeliveryItems((prevDeliveries) =>
            prevDeliveries.map((delivery) =>
              delivery._id === deliveryId ? response.data.updatedItem : delivery
            )
          );
          setToastMessage('Delivery marked as completed!');
          setTimeout(() => setToastMessage(''), 4000);
        }
      } else {
        const response = await axios.put(`http://localhost:3001/update-listing/${deliveryId}`, {
          status: newStatus,
          'deliveryDetails.deliveryStatus': newStatus,
        });

        if (response.data) {
          setDeliveryItems((prevDeliveries) =>
            prevDeliveries.map((delivery) =>
              delivery._id === deliveryId ? response.data : delivery
            )
          );
          setToastMessage(`Delivery status updated to "${newStatus}"`);
          setTimeout(() => setToastMessage(''), 4000);
        }
      }
    } catch (error) {
      console.error('Error updating delivery status:', error);
      setToastMessage('Failed to update delivery status.');
      setTimeout(() => setToastMessage(''), 4000);
    }
  };

  return (
    <>
      <Navbar activeLink={activeLink} setActiveLink={setActiveLink} />
      <div className="!min-h-screen !mt-14 !bg-gradient-to-b !from-emerald-50 !to-white !p-6">
        <div className="!max-w-7xl !mx-auto">
          <div className="!text-center !mb-12">
            <h1 className="!text-4xl !font-bold !text-emerald-800 !mb-4">Active Deliveries</h1>
            <p className="!text-emerald-600 !text-lg">
              Manage and track donation pickups and deliveries
            </p>
          </div>
          {/* {deliveryItems.length > 0 && (
  <div className="!mb-8">
    <DeliverySimulation delivery={deliveryItems[0]} />
  </div>
)} */}
          {deliveryItems.length === 0 ? (
            <Alert className="!bg-white !border-2 !border-emerald-100 !shadow-lg !flex !flex-col !items-center !py-12 !px-6 !space-y-4">
              <Package className="!w-12 !h-12 !text-emerald-500" />
              <p className="!text-emerald-800 !text-lg !text-center !max-w-md">
                No active deliveries at the moment.
              </p>
            </Alert>
          ) : (
            <div className="!space-y-8">
              {deliveryItems.map((item) => {
                const isExpanded = expandedItems[item._id];
                const progressWidth = getStatusProgressWidth(item.status);
                const badgeColor = getStatusBadgeColor(item.status);

                return (
                  <Card
                    key={item._id}
                    className={`!transform !transition-all !duration-300 !hover:shadow-xl !rounded-lg !border-2 !border-emerald-100 ${
                      isExpanded ? '!scale-[1.02]' : '!scale-100'
                    } !cursor-pointer`}
                  >
                    <CardHeader
                      className="!bg-white !cursor-pointer"
                      onClick={() => toggleExpand(item._id)}
                      aria-expanded={isExpanded}
                      aria-controls={`details-${item._id}`}
                    >
                      <div className="!flex !justify-between !items-center">
                        <div className="!flex !items-center !space-x-4">

                          <Package className="!w-8 !h-8 !text-emerald-600" />
                          <div>
                            <CardTitle className="!text-2xl !font-bold !text-emerald-800">
                              {item.name}
                            </CardTitle>
                            <p className="!text-emerald-600">
                              {item.servingSize} items • Estimated: {item.estimatedTime}
                            </p>
                          </div>
                        </div>

                        <div className="!flex !items-center !space-x-4">
                          <div
                            className={`!flex !items-center !space-x-2 !px-4 !py-2 !rounded-full ${badgeColor} !select-none`}
                            aria-label={`Status: ${item.status}`}
                          >
                            {getStatusIcon(item.status)}
                            <span className="!font-semibold">{item.status}</span>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="!w-6 !h-6 !text-emerald-600 !transition-transform !duration-300" />
                          ) : (
                            <ChevronDown className="!w-6 !h-6 !text-emerald-600 !transition-transform !duration-300" />
                          )}
                        </div>
                      </div>
                      



                      {/* Progress Bar */}
                      <div className="!mt-3 !h-2 !w-full !bg-gray-200 !rounded-full !overflow-hidden">
                        <div
                          className="!h-2 !rounded-full !bg-gradient-to-r !from-green-400 !via-yellow-400 !to-red-400 !transition-all !duration-700 !ease-in-out"
                          style={{ width: progressWidth }}
                        ></div>
                      </div>
                    </CardHeader>

                    <CardContent
                      id={`details-${item._id}`}
                      className={`!overflow-hidden !transition-[max-height,opacity] !duration-500 !ease-in-out ${
                        isExpanded ? '!max-h-[600px] !opacity-100' : '!max-h-0 !opacity-0'
                      }`}
                    >
                   
                      <div className="!p-6 !space-y-6 !bg-emerald-50/50 !rounded-lg !mt-4">
                        <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-8">
                          <div className="!flex !items-start !space-x-4">
                            <MapPin className="!w-6 !h-6 !text-emerald-600 !mt-1" />
                            <div>
                              <h4 className="!font-semibold !text-emerald-800 !mb-2">
                                Delivery Location
                              </h4>
                              <p className="!text-emerald-600">
                                {item.deliveryDetails?.address || 'Not set yet'}
                              </p>
                            </div>
                          </div>

                          <div className="!flex !items-start !space-x-4">
                            <Clock className="!w-6 !h-6 !text-emerald-600 !mt-1" />
                            <div>
                              <h4 className="!font-semibold !text-emerald-800 !mb-2">
                                Delivery Instructions
                              </h4>
                              <p className="!text-emerald-600">
                                {item.pickupInstructions || 'None provided'}
                              </p>
                            </div>
                          </div>

                          <div className="!flex !items-start !space-x-4">
                            <Phone className="!w-6 !h-6 !text-emerald-600 !mt-1" />
                            <div>
                              <h4 className="!font-semibold !text-emerald-800 !mb-2">Contact Details</h4>
                              <p className="!text-emerald-600">{item.contactNumber}</p>
                            </div>
                          </div>
                        </div>

                        <div className="!pt-6 !border-t !border-emerald-100">
                          {(item.status === 'Available' || item.status === 'accepted') && (
                            <p className="!text-emerald-600 !text-center !animate-pulse !font-semibold">
                              Waiting for the Donor to accept the Delivery...
                            </p>
                          )}

                          {(
                            item.status === 'In Progress' ||
                            item.status === 'Out for Delivery') && (
                            <div className="!space-y-4">
                              <div className="!bg-emerald-100 !p-4 !rounded-lg !text-center">
                                <p className="!text-emerald-700 !font-medium">Get Your Items ASAP!</p>
                              </div>

                              <div className="!bg-emerald-50 !p-4 !rounded-lg !flex !flex-col md:!flex-row !items-center !justify-between !gap-4 md:!gap-8 !w-full">
                                <p className="!text-emerald-800 !font-semibold !text-lg !text-center md:!text-left">
                                  Did You Get Your Item?
                                </p>
                                <Button
                                  onClick={() => updateDeliveryStatus(item._id, 'Delivered')}
                                  className="!bg-emerald-500 !hover:bg-emerald-600 !text-white !transform !transition-all !hover:scale-105 !px-6 !py-2 !text-sm md:!text-base"
                                >
                                  Yes, I Got It!
                                </Button>
                              </div>
                            </div>
                          )}

                          {item.status === 'Delivered' && (
                            <div className="!text-center">
                              <Button
                                onClick={() => handleConfirmDelivery(item._id)}
                                className="!bg-green-600 !hover:bg-green-700 !text-white !px-6 !py-2 !rounded-md !font-semibold !transition-transform !hover:scale-105"
                              >
                                Confirm Delivery
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div
            className="!fixed !bottom-5 !right-5 !bg-green-500 !text-white !px-5 !py-3 !rounded !shadow-lg !animate-fade-in !z-50 !select-none"
            role="alert"
          >
            {toastMessage}
          </div>
        )}
      </div>

      {/* Tailwind fade-in animation */}
      <style>
        {`
          @keyframes fade-in {
            from {opacity: 0; transform: translateY(10px);}
            to {opacity: 1; transform: translateY(0);}
          }
          .!animate-fade-in {
            animation: fade-in 0.4s ease forwards !important;
          }
        `}
      </style>
    </>
  );
};

export default DeliveryPage;
