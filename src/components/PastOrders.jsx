import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const PastOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filter, setFilter] = useState('all');
  const [activeLink, setActiveLink] = useState('/home/pastorders');

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCompletedOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3001/completed-orders');
        if (Array.isArray(response.data)) {
          setOrders(response.data);
        } else {
          throw new Error('API response is not an array');
        }
      } catch (error) {
        setError('Failed to fetch orders: ' + (error.message || 'Unknown error'));
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompletedOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'delivered' && order.status === 'Delivered') ||
      (filter === 'cancelled' && order.status === 'Cancelled');
    const matchesSearch =
      order.itemName && order.itemName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="flex! justify-center! items-center! min-h-screen! bg-gray-50!">
        <div className="animate-spin! rounded-full! h-12! w-12! border-t-2! border-b-2! border-green-500!"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex! flex-col! items-center! justify-center! min-h-screen! bg-gray-50! p-4!">
        <div className="bg-red-100! border-l-4! border-red-500! text-red-700! p-4! rounded! shadow-md! max-w-md! w-full!">
          <p className="font-bold!">Error</p>
          <p>{error}</p>
          <button
            className="mt-4! bg-red-500! hover:bg-red-600! text-white! font-bold! py-2! px-4! rounded! focus:outline-none! focus:shadow-outline!"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (<> 
  <Navbar activeLink={activeLink} setActiveLink={setActiveLink}/>
    <div className="container! mx-auto! !mt-12 max-w-4xl! px-4! py-8!">
      <h2 className="text-3xl! font-bold! text-gray-800! mb-6! text-center!">Completed Orders</h2>

      <div className="mb-6! flex! flex-col! md:flex-row! gap-4! justify-between! items-center!">
        <div className="relative! w-full! md:w-64!">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full! bg-white! border! border-gray-300! rounded-lg! py-2! px-4! pl-10! focus:outline-none! focus:ring-2! focus:ring-green-500!"
          />
          <svg className="absolute! left-3! top-3! h-4! w-4! text-gray-400!" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex! space-x-2! w-full! md:w-auto!">
          {['all', 'delivered', 'cancelled'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4! py-2! rounded-lg! font-medium! transition-colors! ${filter === type ? 'bg-green-500! text-white!' : 'bg-gray-200! text-gray-700! hover:bg-gray-300!'
                }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4!">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white! rounded-lg! shadow-md! overflow-hidden! transition-all! duration-300! hover:shadow-lg! cursor-pointer! border! border-gray-200!"
              onClick={() => toggleExpand(order._id)}
            >
              <div className="p-4! flex! flex-col! md:flex-row! justify-between! items-start! md:items-center!">
                <div className="flex-1!">
                  <h3 className="text-xl! font-semibold! text-gray-800!">{order.itemName}</h3>
                  <p className="text-gray-600! text-sm!">
                    {order.quantity?.amount} {order.quantity?.unit || 'units'} • Completed: {formatDate(order.completedAt)}
                  </p>
                </div>

                <div className="mt-2! md:mt-0! flex! items-center!">
                  <span className={`px-3! py-1! rounded-full! text-sm! font-medium! ${order.status === 'Delivered' ? 'bg-green-100! text-green-800!' : 'bg-red-100! text-red-800!'
                    }`}>
                    {order.status}
                  </span>
                  <svg
                    className={`ml-2! h-5! w-5! text-gray-500! transition-transform! ${expandedOrder === order._id ? 'transform! rotate-180!' : ''
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {expandedOrder === order._id && (
                <div className="bg-gray-50! p-4! border-t! border-gray-200!">
                  <div className="grid! grid-cols-1! md:grid-cols-2! gap-4!">
                    <div>
                      <h4 className="text-sm! font-medium! text-gray-500!">Delivery Details</h4>
                      <p className="text-gray-800!">Status: {order.deliveryDetails?.deliveryStatus || 'N/A'}</p>
                      <p className="text-gray-800!">Delivered At: {formatDate(order.deliveryDetails?.deliveredAt)}</p>
                    </div>
                    <div>
                      <h4 className="text-sm! font-medium! text-gray-500!">Order Information</h4>
                      <p className="text-gray-800!">Completed At: {formatDate(order.completedAt)}</p>
                      <p className="text-gray-800!">Order ID: {order._id}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white! rounded-lg! shadow! p-8! text-center!">
            <svg className="mx-auto! h-12! w-12! text-gray-400!" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2! text-lg! font-medium! text-gray-900!">No orders found</h3>
            <p className="mt-1! text-gray-500!">
              {searchTerm ? 'Try changing your search query' : 'You have no completed orders at the moment'}
            </p>
          </div>
        )}
      </div>

      {filteredOrders.length > 0 && (
        <div className="mt-6! bg-white! rounded-lg! shadow-md! p-4!">
          <p className="text-gray-600! text-center!">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>
        </div>
      )}
    </div>
    </>
  );
};

export default PastOrders;
