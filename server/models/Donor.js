const mongoose = require('mongoose')

const DonorSchema = new mongoose.Schema({
            firstName: String,
            lastName: String,
            location: String,
            phoneNo: Number,
            companyPhoneNo: Number,
            email: String,
            password: String

})

module.exports = (donorDB) => {
    return donorDB.model("Donor", DonorSchema); // Use donorDB for model creation
};