const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  username: String,
  email: String,
  year: Number,
  role:String,
  password: String,
  cpassword: String,
  image: {
    data: Buffer,
    contentType: String
  }
});

const Faculty = mongoose.model('Faculty', facultySchema);

module.exports = Faculty;
