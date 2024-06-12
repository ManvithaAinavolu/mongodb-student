// facultyregister.js
const mongoose = require('mongoose');

const facultyregisterSchema = new mongoose.Schema({
  username: String,
  email: String,
  role: String,
  password: String,
  cpassword: String,
});

const Facultyregister = mongoose.model('Facultyreg', facultyregisterSchema);

module.exports = Facultyregister;
