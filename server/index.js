const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require('axios');
const http = require('http');
const socketIo = require('socket.io');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();
const { Server } = require('socket.io');

app.use(express.json());
app.use(cookieParser());


// Updated CORS configuration
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3001'], 
    credentials: true,
}));

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:3001'], 
        methods: ['GET', 'POST'],
        credentials: true,
    }
});

// Secret key for JWT signing and encryption (should be stored securely)
const JWT_SECRET = 'greentable';

// Function to generate JWT token
function generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Expires in 1 hour
}



// Donor registration
app.post('/register', (req, res) => {
    DonorModel.create(req.body)
        .then(donors => {
            // Assuming donor object has an id or email you want to use for the payload
            const token = generateToken({ id: donors._id, email: donors.email });

            // Set the token in cookies
            res.cookie('auth_token', token, {
                httpOnly: true, // Makes the cookie accessible only through HTTP(S), not client-side JavaScript
                secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                maxAge: 3600000, // 1 hour
            });

            res.status(201).json(donors);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Failed to register donor' });
        });
});

// NGO registration
app.post('/register-ngo', (req, res) => {
    NgoModel.create(req.body)
        .then(ngos => {
            // Assuming ngo object has an id or email you want to use for the payload
            const token = generateToken({ id: ngos._id, email: ngos.email });

            // Set the token in cookies
            res.cookie('auth_token', token, {
                httpOnly: true, // Makes the cookie accessible only through HTTP(S), not client-side JavaScript
                secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                maxAge: 3600000, // 1 hour
            });

            res.status(201).json(ngos);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Failed to register NGO' });
        });
});

// A sample protected route to demonstrate checking the token
app.get('/protected', (req, res) => {
    const token = req.cookies.auth_token;

    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Failed to authenticate token' });
        }

        // Token is valid
        res.json({ message: 'Welcome to the protected route!', user: decoded });
    });
});











// Listen for incoming socket connections
io.on('connection', (socket) => {
    console.log('A user connected');
     
    socket.on('delivery-updated', (data) => {
        // Handle the delivery update (e.g., notifying clients about the new status)
        io.emit('delivery-updated', data);  // Emit the update to all connected clients
    });

    // Listen for item acceptance from the client
    socket.on('accept-item', (item) => {
      console.log(`Item accepted: ${item.name}`);
  
      // Emit 'item-accepted' event to all other connected users except the one who accepted the item
      socket.broadcast.emit('item-accepted', item);
    });
  
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });


// Connect to donor database
const donorDB = mongoose.createConnection("mongodb://127.0.0.1:27017/donor");
const DonorModel = require('./models/Donor')(donorDB);

// Connect to NGO database
const ngoDB = mongoose.createConnection("mongodb://127.0.0.1:27017/ngo");
const NgoModel = require('./models/Ngo')(ngoDB);

// Connect to surplus database
const surplusDB = mongoose.createConnection("mongodb://127.0.0.1:27017/surplus");
const SurplusModel = require('./models/Surplus')(surplusDB);



app.get('/api/donors', async (req, res) => {
    try {
      // Fetch 'firstName', 'lastName', and 'location' fields for each donor
      const donors = await DonorModel.find({}, 'firstName lastName location'); // Select 'firstName', 'lastName', and 'location'
      
      // Send the donor data as JSON
      res.json(donors);
    } catch (err) {
      console.error('Error fetching donor data:', err);
      res.status(500).json({ message: 'Failed to load donor data.' });
    }
  });
  
  




// NGO name display at homepage
app.get('/get-ngo', async (req, res) => {
    try {
        const ngo = await NgoModel.findOne({});
        if (!ngo) {
            return res.status(404).json({ error: 'NGO not found' });
        }
        res.json({ organizationName: ngo.organizationName });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Donor login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    DonorModel.findOne({ email: email })
        .then(user => {
            if (user) {
                if (user.password === password) {
                    console.log("HERE I AM");
                    // Create a JWT token after successful login
                    const token = jwt.sign(
                        { email: user.email}, // Payload: You can include other user data if needed
                        JWT_SECRET, // Secret key for signing the token
                        { expiresIn: '1h' } // Set the token to expire in 1 hour
                    );
                    
                    // Set the token in a cookie
                    res.cookie('loggedin_token', token, {
                        httpOnly: true, // Make the cookie inaccessible via JavaScript
                        secure: process.env.NODE_ENV === false, // Set to true in production for HTTPS
                        maxAge: 3600 * 1000, // Token expiration in ms (1 hour)
                        sameSite: 'Strict', // Prevents CSRF attacks
                    });

                    // Send success response
                    return res.json({ message: "Lessgo", token: token });
                } else {
                    return res.status(401).json({ error: "Incorrect password" });
                }
            } else {
                return NgoModel.findOne({ email: email })
                    .then(user => {
                        if (user) {
                            if (user.password === password) {
                                // Create a JWT token for the NGO user
                                const token = jwt.sign(
                                    { email: user.email},
                                    JWT_SECRET, // Secret key
                                    { expiresIn: '1h' } // Token expiration
                                );

                                // Set the token in a cookie
                                res.cookie('loggedin_token', token, {
                                    httpOnly: true,
                                    secure: process.env.NODE_ENV === false, // For HTTPS in production
                                    maxAge: 3600 * 1000, // Token expiration in ms (1 hour)
                                    sameSite: 'Strict', // Prevents CSRF attacks
                                });

                                // Send success response
                                return res.json({ message: "Login successful to NGO", token: token });
                            } else {
                                return res.status(401).json({ error: "Incorrect password" });
                            }
                        } else {
                            return res.status(404).json({ error: "User not found" });
                        }
                    });
            }
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        });
});


// Middleware to authenticate the token
const authenticateToken = (req, res, next) => {
    const token = req.cookies.loggedin_token || req.headers['authorization']?.split(' ')[1]; 
    if (!token) {
        return res.status(401).json({ error: "Access denied, no token provided" });
    }

    // Verify token and decode it
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            
            return res.status(403).json({ error: "Invalid token" });
        }
        req.user = user; // Attach the user data to the request object
        next(); // Proceed to the next middleware or route handler
    });
};

// Protect the route with authenticateToken middleware
app.get('/user', authenticateToken, (req, res) => {
    const { email } = req.user; // Extract the email from the decoded token (req.user)

    // First, search for the user in DonorModel
    DonorModel.findOne({ email: email })
        .then(user => {
            if (user) {
                // If user is found, return their firstName
                return res.json({ firstName: user.firstName });
            } else {
                // If user not found in DonorModel, check in NgoModel
                NgoModel.findOne({ email: email })
                    .then(user => {
                        if (user) {
                            // If user is found in NgoModel, return their firstName
                            return res.json({ organizationName: user.organizationName });
                        } else {
                            return res.status(404).json({ error: "User not found" });
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        return res.status(500).json({ error: "Internal Server Error" });
                    });
            }
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        });
});



// Donor registration
app.post('/register', (req, res) => {
    DonorModel.create(req.body)
        .then(donors => res.status(201).json(donors))
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Failed to register donor' });
        });
});

// NGO registration
app.post('/register-ngo', (req, res) => {
    NgoModel.create(req.body)
        .then(ngos => res.status(201).json(ngos))
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Failed to register NGO' });
        });
});

// List surplus and send WhatsApp notification
app.post('/list-surplus', async (req, res) => {
    try {
        // Parse quantity and servingSize to numbers
        const surplusData = {
            ...req.body,
            quantity: (req.body.quantity),
            servingSize: (req.body.servingSize)
        };

        // Save the surplus item to the database
        const surplusItem = await SurplusModel.create(surplusData);
        let messageStatus = 'Message not sent';
        let whatsappLink = '';  // Initialize the whatsappLink variable

        // Fetch the NGO that will receive the notification
        const ngo = await NgoModel.findOne({});
        if (ngo && ngo.phoneNo) {
            // Validate the phone number format
            const formattedPhoneNo = `+91${ngo.phoneNo}`;
            if (!/^(\+91)?[789]\d{9}$/.test(formattedPhoneNo)) {
                return res.status(400).json({ error: "Invalid phone number format" });
            }

            // Prepare the WhatsApp message content
            const messageBody = `
            New Surplus Item Listed! 🎉

            We are excited to announce a new surplus item that can make a difference in someone's life.

            Details:

            Name: ${req.body.name}
            Description: ${req.body.description}
            Fresh Upto: ${req.body.freshUpto}
            Quantity: ${req.body.quantity}
            Serving Size: ${req.body.servingSize}
            Pickup Time: ${req.body.pickupTime}
            Pickup Instructions: ${req.body.pickupInstructions}

            By donating food, you are not only reducing waste but also providing nourishment to those in need. 🌍❤️

            Join us in making a positive impact on our community! Every contribution counts, and together we can create a hunger-free world.

            Thank you for your support in reducing food waste and helping those in need!
            `;

            // Create WhatsApp link
            whatsappLink = `https://wa.me/${formattedPhoneNo}?text=${encodeURIComponent(messageBody)}`;
            messageStatus = 'Message link generated successfully.';
        }

        // Notify all connected clients (e.g., the NGO) about the new surplus item
        io.emit('new-surplus-item', surplusItem);

        // Set the surplus data in a cookie (expires in 10 days)
        res.cookie('surplus_data', JSON.stringify(surplusData), {
            httpOnly: true,  // Ensures cookie is not accessible via JavaScript
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            maxAge: 10 * 24 * 60 * 60 * 1000,  // 10 days in milliseconds
        });

        // Send response with message status and WhatsApp link
        res.status(201).json({
            message: 'Surplus item listed successfully',
            messageStatus: messageStatus,
            whatsappLink: whatsappLink,  // Include the WhatsApp link in the response
            surplusItem: surplusItem
        });
    } catch (err) {
        console.error('Failed to list surplus:', err);
        res.status(500).json({ error: 'Failed to list surplus item' });
    }
});




// Sample initial location for the delivery person
let currentLocation = { latitude: 28.7041, longitude: 77.1025 };

// Send real-time location updates every 5 seconds
setInterval(() => {
  // Simulating the movement of the delivery person (in real-life, you'd get this data from the device)
  currentLocation.latitude += 0.001; // Update latitude
  currentLocation.longitude += 0.001; // Update longitude

  // Emit the updated location to all connected clients
  io.emit('location-update', currentLocation);
}, 5000);

// Serve static files (if any)
app.use(express.static('public'));








// Accept a surplus item for delivery (API)
app.post('/accept-delivery/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { address } = req.body; // Delivery address

        // Find the surplus item by ID and update the status
        const updatedItem = await SurplusModel.findByIdAndUpdate(
            id, 
            { 
                status: 'In Progress', // Change status to "In Progress"
                'deliveryDetails.address': address,
                'deliveryDetails.deliveryStatus': 'Pending',
            },
            { new: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ message: 'Surplus item not found' });
        }

        // Emit an event to notify other connected clients (NGO or donor side can listen)
        io.emit('delivery-started', updatedItem);  // Notify all clients that a delivery has started

        res.status(200).json({ message: 'Pickup accepted for delivery', updatedItem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to accept delivery item' });
    }
});

// Get a surplus item's delivery status (for Donor to track)
app.get('/get-delivery-status/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const surplusItem = await SurplusModel.findById(id);

        if (!surplusItem) {
            return res.status(404).json({ message: 'Surplus item not found' });
        }

        // Send back the delivery details
        res.status(200).json(surplusItem.deliveryDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch delivery status' });
    }
});

// Get all deliveries for a specific donor (this API should fetch donor-specific deliveries)
app.get('/get-donor-deliveries', async (req, res) => {
    try {
        // Retrieve the donorId from the cookie
        const itemId = req.cookies.pickedup_item;
        console.log('Received donorId from cookie:', itemId);  // Debug log

        if (!itemId) {
            return res.status(400).json({ message: 'Donor ID is required in the cookie' });
        }

        // Fetch deliveries based on donorId
        const deliveries = await SurplusModel.findOne({ 
            _id: itemId, 
            status: { $in: ['In Progress', 'Delivered','accepted'] } 
        });        console.log('Deliveries found:', deliveries);  // Debug log

        if (deliveries.length === 0) {
            return res.status(404).json({ message: 'No deliveries found for this donor' });
        }

        res.status(200).json(deliveries);
    } catch (error) {
        console.error('Error fetching donor deliveries:', error);
        res.status(500).json({ message: 'Failed to fetch donor deliveries' });
    }
});



// Complete the delivery of a surplus item (API to update status to 'Delivered' by NGO)
app.post('/complete-delivery/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the surplus item and update its delivery status
        const updatedItem = await SurplusModel.findByIdAndUpdate(
            id,
            { 
                'deliveryDetails.deliveryStatus': 'Completed',  // Set the delivery status to 'Completed'
                'deliveryDetails.deliveredAt': new Date(),  // Record the time of delivery
                status: 'Delivered',  // Update the overall status to 'Delivered'
            },
            { new: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ message: 'Surplus item not found' });
        }

        // Emit an event to notify all users that the delivery was completed (for real-time updates)
        io.emit('delivery-completed', updatedItem);

        // Optionally, remove the item from the database after delivery is completed
        await SurplusModel.findByIdAndDelete(id);

        res.status(200).json({ message: 'Delivery completed successfully', updatedItem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to complete delivery' });
    }
});


// Endpoint to confirm delivery and delete the donor's delivery record
app.post('/confirm-delivery/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find and delete the item from the database
      const deletedItem = await SurplusModel.findByIdAndDelete(id);
  
      if (!deletedItem) {
        return res.status(404).json({ message: 'Surplus item not found' });
      }
  
      // Emit an event to notify other clients (optional)
      io.emit('delivery-deleted', deletedItem);
  
      res.status(200).json({ message: 'Delivery confirmed and item deleted successfully', deletedItem });
    } catch (error) {
      console.error('Error confirming delivery:', error);
      res.status(500).json({ message: 'Failed to confirm delivery' });
    }
  });
  
  
  // Update listing
  app.put('/update-listing/:id', async (req, res) => {
      try {
          const { id } = req.params;
          const updatedListing = await SurplusModel.findByIdAndUpdate(id, req.body, { new: true });
          res.json(updatedListing);
      } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Failed to update listing' });
      }
  });








// Get surplus data
app.get('/get-surplus', async (req, res) => {
    try {
        const surplusItems = await SurplusModel.find({});
        res.json(surplusItems);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Backend: active-listings endpoint (in your server file)


// Fetch all active surplus listings
app.get('/active-listings', async (req, res) => {
    try {
        const listings = await SurplusModel.find(); // You can add more conditions here to fetch only active listings
        res.json(listings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch active listings' });
    }
});

// Delete listing by ID
app.delete('/active-listings/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await SurplusModel.findByIdAndDelete(id);
      if (!result) {
        return res.status(404).json({ message: 'Listing not found.' });
      }
      res.status(200).json({ message: 'Listing deleted successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to delete listing. Internal server error.' });
    }
  });



// Get donor data
app.get('/get-donors', async (req, res) => {
    try {
        const donors = await DonorModel.find({});
        const formattedDonors = donors.map(donor => ({
            firstName: donor.firstName,
            lastName: donor.lastName,
            location: donor.location,
            phoneNo: donor.phoneNo,
            email: donor.email,
        }));
        res.json(formattedDonors);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Express backend example
app.post('/accept-pickup/:id', async (req, res) => {
    const { id } = req.params;
    try {
      // Assuming you're using MongoDB
      const pickup = await SurplusModel.findById(id);
      if (!pickup) {
        return res.status(404).json({ error: 'Pickup not found' });
      }
  
      // Update the pickup status to "accepted"
      pickup.status = 'accepted';
      await pickup.save();
  
      res.status(200).json(pickup); // Send back the updated pickup
    } catch (error) {
      res.status(500).json({ error: 'Error accepting the pickup' });
    }
  });
app.post('/reject-pickup/:id', async (req, res) => {
    const { id } = req.params;
    try {
      // Assuming you're using MongoDB
      const pickup = await SurplusModel.findById(id);
      if (!pickup) {
        return res.status(404).json({ error: 'Pickup not found' });
      }
  
      // Update the pickup status to "accepted"
      pickup.status = 'Available';
      await pickup.save();
  
      res.status(200).json(pickup); // Send back the updated pickup
    } catch (error) {
      res.status(500).json({ error: 'Error accepting the pickup' });
    }
  });
  




// Start the server
server.listen(3001, () => {
    console.log("Server is Running on port 3001");
});

