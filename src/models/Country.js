const mongoose = require('mongoose');
const { Schema } = mongoose;
const countrySchema = new Schema({ country_name: String });
module.exports = mongoose.model('Country', countrySchema);
