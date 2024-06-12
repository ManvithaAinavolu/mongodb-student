const mongoose = require('mongoose');

const Attendance = new mongoose.Schema({
  username: String, 
  date: Date,
  status: String, 
});

module.exports = mongoose.model('Attendance', Attendance);
