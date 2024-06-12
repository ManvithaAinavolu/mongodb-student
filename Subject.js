    const mongoose = require('mongoose');
    // const student=require('./student');
    const subjectSchema = new mongoose.Schema({
        subjectCode: {
        type: String,
        required: true,
        unique: true,
        },
        subjectName: {
        type: String,
        required: true,
        },
       
        students: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Student', 
        }],   
        
    });
    
    const Subject = mongoose.model('Subject', subjectSchema);
    module.exports=Subject;