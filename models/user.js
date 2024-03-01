const mongoose = require('mongoose');

//model created for saving data in mongodb
const userSchema = new mongoose.Schema({
  chatId: Number,
  name: String,
  city: String,
  country: String,
});

module.exports = mongoose.model('User', userSchema);
