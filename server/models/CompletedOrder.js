const mongoose = require('mongoose');

// Define the CompletedOrder schema
const CompletedOrderSchema = new mongoose.Schema({
    originalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'surplus-list', // Reference to the original surplus item
    },
    itemName: String,
    quantity: {
        amount: Number, // Numeric value
        unit: String,   // Unit (e.g., kg, lbs)
    },
    deliveryDetails: {
        deliveryStatus: {
            type: String,
            default: 'Completed',
        },
        deliveredAt: Date,
        deliveredBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ngo', // Reference to the NGO that delivered the item
        },
    },
    status: {
        type: String,
        default: 'Delivered', // Status of the order (Delivered)
    },
    completedAt: {
        type: Date,
        default: Date.now, // Timestamp when the order was completed
    }
});

// Export the model as part of the surplusDB connection, and tie it to the "surplus-list" collection
module.exports = (surplusDB) => {
    return surplusDB.model('completed-orders', CompletedOrderSchema);
};
