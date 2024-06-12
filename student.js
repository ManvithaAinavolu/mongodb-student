const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  username: String,
  email: String,
  year: Number,
  role: String,
  password: String,
  cpassword: String,
  image: {
    data: Buffer,
    contentType: String
  },
  subjects: [
    {
      subjectCode: String,
      marks: {
        assignments: Number,
        midExam: Number,
      }
    }
  ]
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
