const mongoose = require('mongoose');

const SurplusSchema = new mongoose.Schema({
    name: String,
    description: String,
    quantity: String,
    servingSize: String,
    pickupInstructions: String,
    pickupTime: String,
    status: {
        type: String,
        default: 'Available', // Can be 'Available', 'Picked Up', 'Delivered'
    },
    donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor' // Reference to Donor model
},

    deliveryDetails: {
        address: String,
        deliveredAt: Date,
        deliveredBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ngo', // Reference to NGO
        },
        deliveryStatus: {
            type: String,
            default: 'Pending', // Pending, In Progress, Completed
        },
    },
    
});

module.exports = (surplusDB) => {
    return surplusDB.model("surplus-list", SurplusSchema);
};
