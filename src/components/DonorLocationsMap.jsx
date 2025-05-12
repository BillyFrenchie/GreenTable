import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import Navbar from './Navbar';

// Fix for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const userIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
  className: '!user-marker'
});

const donorIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
  className: '!donor-marker'
});

// Component to recenter map view
function SetViewOnChange({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
}

const DonorLocationsMap = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
        const [activeLink, setActiveLink] = useState('/home/maps');
  

  // Function to get user location with improved accuracy
  const getUserLocation = () => {
    const options = {
      enableHighAccuracy: true,  // Attempt to get more accurate location
      timeout: 5000,             // Timeout after 5 seconds
      maximumAge: 0             // Don't use cached locations
    };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error getting user location:', error);
          setError('Unable to retrieve your location. Please check your browser permissions.');
          setUserLocation({ lat: 51.505, lng: -0.09 }); // Default location
        },
        options
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setUserLocation({ lat: 51.505, lng: -0.09 }); // Default location
    }
  };

  // Get user location and donor data on load
  useEffect(() => {
    getUserLocation(); // Get user location with improved accuracy
    fetchDonors();      // Fetch donor data
  }, []);

  // Fetch donors from API
  const fetchDonors = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/donors');
      const donorData = response.data;

      if (Array.isArray(donorData)) {
        const validDonors = donorData.filter(donor =>
          donor.location && donor.location.trim().length > 0
        );

        const geocode = async (address) => {
          try {
            const res = await axios.get(`https://nominatim.openstreetmap.org/search`, {
              params: {
                q: address,
                format: 'json',
                addressdetails: 1,
                limit: 1,
              },
            });
            const data = res.data[0];
            if (data) {
              return {
                lat: parseFloat(data.lat),
                lng: parseFloat(data.lon),
              };
            }
            return null;
          } catch (error) {
            console.error('Geocoding error for address:', address, error);
            return null;
          }
        };

        const donorsWithCoordinates = await Promise.all(validDonors.map(async (donor) => {
          const coordinates = await geocode(donor.location);
          if (coordinates) {
            return { ...donor, location: coordinates, actualLocation: donor.location };
          }
          return null;
        }));

        const filteredDonors = donorsWithCoordinates.filter(donor => donor !== null);

        if (filteredDonors.length === 0) {
          setError('No valid donor locations found in the database.');
        }

        setDonors(filteredDonors);
        setFilteredDonors(filteredDonors);
      } else {
        setError('Donor data format is incorrect. Expected an array.');
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching donor data:', err);
      setError('Failed to load donor data. Please try again later.');
      setLoading(false);
    }
  };

  // Filter donors based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDonors(donors);
    } else {
      const filtered = donors.filter(donor =>
        (donor.firstName && donor.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (donor.actualLocation && donor.actualLocation.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredDonors(filtered);
    }
  }, [searchQuery, donors]);

  // Handle clicking on a donor from the list
  const handleDonorSelect = (donor) => {
    setSelectedLocation(donor.location);
    const mapElement = document.getElementById('donor-map');
    if (mapElement && window.innerWidth < 768) {
      mapElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Open Google Maps directions
  const openGoogleMapsDirections = (donorLocation) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${donorLocation.lat},${donorLocation.lng}&travelmode=driving`;
      window.open(url, '_blank');
    } else {
      const url = `https://www.google.com/maps/search/?api=1&query=${donorLocation.lat},${donorLocation.lng}`;
      window.open(url, '_blank');
    }
  };

  const getDonorName = (donor) => {
    if (donor.firstName && donor.lastName) {
      return `${donor.firstName} ${donor.lastName}`;
    }
    return donor.firstName || donor.lastName || 'Anonymous Donor';
  };

  const getDonorAddress = (donor) => {
    if (typeof donor.location === "string" && donor.location.trim()) {
      return donor.location;
    }
    return donor.actualLocation;
  };

  if (loading) {
    return (
      <div className="!flex !items-center !justify-center !h-screen !w-full !bg-green-50">
        <div className="!w-12 !h-12 !border-4 !border-green-500 !border-t-transparent !rounded-full !animate-spin"></div>
      </div>
    );
  }

  return (<>  
  <Navbar activeLink={activeLink} setActiveLink={setActiveLink}/>
    <div className="!min-h-screen !bg-green-50 !font-sans !flex !flex-col !items-center !justify-start !py-10">
      <div className="!container !max-w-6xl !bg-white !shadow-xl !rounded-3xl !overflow-hidden !p-8 !md:p-12 !flex !flex-col !md:flex-row !gap-8">

        {/* Header Section */}
        <div className="!text-center !mb-6 !md:mb-0 !md:text-left !w-full !md:w-1/3">
          <h1 className="!text-3xl !font-extrabold !text-green-700 !mb-2">
            Giving Food
          </h1>
          <p className="!text-gray-600 !mb-4">
            <strong> Find local heroes donating in your community.</strong>
          </p>
          {/* Search Input */}
          <div className="!mb-6">
            <input
              type="text"
              placeholder="Search by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="!w-full !p-3 !bg-green-50 !border !border-green-300 !rounded-lg !focus:ring-2 !focus:ring-green-200 !focus:border-green-300 !text-gray-700 !transition-shadow !shadow-inner"
            />
          </div>
        </div>

        {/* Donor List Section */}
        <div className="!flex-1 !overflow-y-auto !max-h-[600px] !pr-4 !md:pr-8">
          <h2 className="!text-xl !font-semibold !text-green-600 !mb-4 !border-b !border-green-200 !pb-2">
            Available Donors ({filteredDonors.length})
          </h2>

          {error && (
            <div className="!bg-red-100 !border-l-4 !border-red-500 !text-red-700 !p-4 !mb-4">
              {error}
            </div>
          )}

          {filteredDonors.length === 0 ? (
            <p className="!text-gray-500 !text-center !py-4">
              {error ? 'Error loading data.' : 'No donors found matching your search.'}
            </p>
          ) : (
            filteredDonors.map(donor => (
              <div
                key={donor._id || donor.id}
                className={`!bg-white !rounded-xl !p-4 !mb-4 !shadow-md !transition-all !duration-300 !ease-in-out !transform !hover:scale-105 !cursor-pointer !border-l-4 ${selectedLocation === donor.location ? '!border-green-500' : '!border-transparent'}`}
                onClick={() => handleDonorSelect(donor)}
              >
                <h3 className="!text-lg !font-semibold !text-green-700 !mb-2">
                  {getDonorName(donor) || 'Anonymous Donor'}
                </h3>
                <p className="!text-sm !text-gray-600 !mb-3">
                  {getDonorAddress(donor)}
                </p>
                <button
                  className="!bg-green-500 !hover:bg-green-700 !text-white !font-bold !py-2 !px-4 !rounded-full !transition-colors !duration-200 !ease-in-out !focus:outline-none !focus:ring-2 !focus:ring-green-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    openGoogleMapsDirections(donor.location);
                  }}
                >
                  Get Directions
                </button>
              </div>
            ))
          )}
        </div>

        {/* Map Section */}
        <div className="!w-full !md:w-2/3 !rounded-3xl !overflow-hidden !shadow-xl" id="donor-map">
          <MapContainer
            center={userLocation || { lat: 51.505, lng: -0.09 }}
            zoom={13}
            style={{ height: "500px", width: "100%" }}
            className="!rounded-3xl !z-10"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Recenter map when selected location changes */}
            <SetViewOnChange center={selectedLocation || userLocation} />

            {/* User location marker */}
            {userLocation && (
              <Marker position={userLocation} icon={userIcon}>
                <Popup>
                  <div className="!p-2 !min-w-[200px]">
                    <strong className="!block !text-green-800 !mb-1">Your Location</strong>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Donor markers */}
            {filteredDonors.map(donor => (
              <Marker
                key={donor._id || donor.id}
                position={donor.location}
                icon={donorIcon}
              >
                <Popup>
                  <div className="!p-2 !min-w-[200px]">
                    <h3 className="!font-semibold !text-green-700 !mb-1">
                      {donor.firstName || 'Anonymous'}
                    </h3>
                    <p className="!text-sm !text-gray-600 !mb-3">
                      {getDonorAddress(donor)}
                    </p>
                    <button
                      className="!w-full !bg-green-500 !hover:bg-green-700 !text-white !py-2 !px-4 !rounded-full !transition-colors !duration-200 !ease-in-out !focus:outline-none !focus:ring-2 !focus:ring-green-300"
                      onClick={() => openGoogleMapsDirections(donor.location)}
                    >
                      Get Directions
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
      <footer className="!mt-8 !text-center !text-gray-500">
        <p>
          Made with ❤️ by GreenTable
        </p>
      </footer>
    </div>
    </>
  );
};

export default DonorLocationsMap;
