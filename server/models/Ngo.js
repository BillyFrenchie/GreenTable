const mongoose = require('mongoose')

const NgoSchema = new mongoose.Schema({
             organizationName: String,
        location: String,
        phoneNo: String,
        email: String,
        password: String
        

})

module.exports = (ngoDB) => {
    return ngoDB.model("Ngo", NgoSchema); // Use donorDB for model creation
};