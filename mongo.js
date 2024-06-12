//Imports
const mongoose = require('mongoose');
const express=require('express');
const session = require('express-session');
const cors=require('cors');
const bodyparser=require('body-parser');
//mongo database connection
const url = 'mongodb://127.0.0.1:27017/manu'; 
const fs = require('fs');
const path = require('path');
const app = express();
const port = 4000;
const router = express.Router();
app.use(express.static('uploads'));
let postedData=[];
//To store images into uploads folder
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    const originalname = file.originalname;
    const timestamp = Date.now();
    const uniqueFilename = `${timestamp}-${originalname}`;
    cb(null, uniqueFilename);
  }
});

const upload = multer({ storage: storage });
//connection with mongodb
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

app.use(cors());

app.use(bodyparser.json());


db.on('error', (err) => {
  console.error('Error connecting to MongoDB:', err);
});
app.use(express.static(path.join(__dirname,'./public')));

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());


const studentmodel = require('./student'); 
const facultymodel=require('./faculty');
const Subject=require('./Subject');
const { renderFile } = require('ejs');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
//Operations like to perfom on database
app.get('/',(req,res)=>{
  res.render('Default')
})
app.get('/reg',async(req,res)=>{
  res.render('register');
});
app.get('/about',(req,res)=>{
  res.render('About');
})
app.get('/details', async (req, res) => {
  try {
      const username = req.params.username;
      const user = await usermodel.findOne({ username });
      res.render('index', { user }); 
  } catch (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
  }
});

app.get('/attendance',(req,res)=>{
  res.render('attendance');
})
app.get('/users/details/:username', upload.single('image'), async (req,res) =>
{
    try {
    const _username=req.params.username;
    console.log(_username);
    const result = await usermodel.find({username:_username});
    console.log(result);
    res.send(result);
}
catch(err)
{
    console.log(err);
}

});

app.get('/index',async(req,res)=>{
  res.render('index',{error:null});
})
app.get('/login', async (req, res) => {
  res.render('login',{ error: null }); 
});
app.post('/users/signup', upload.single('image'), async (req, res) => {
  try {
    let newUser;

    if (req.body.role === 'student') {
      newUser = new studentmodel({
        username: req.body.username,
        email: req.body.email,
        year: req.body.year,
        role:req.body.role,
        password: req.body.password,
        cpassword: req.body.cpassword,
        image: {
          data: fs.readFileSync(path.join(__dirname, 'uploads', req.file.filename)),
          contentType: 'image/jpeg'
        }
      });
    } else if (req.body.role === 'faculty') {
      newUser = new facultymodel({
        username: req.body.username,
        email: req.body.email,
        year: req.body.year, 
        role:req.body.role,
        password: req.body.password,
        cpassword: req.body.cpassword,
        image: {
          data: fs.readFileSync(path.join(__dirname, 'uploads', req.file.filename)),
          contentType: 'image/jpeg'
        }
      });
    } else {
      res.status(400).json({ error: 'Invalid role' });
      return;
    }

    await newUser.save();
    console.log("Inserted successfully");
    res.redirect('/login');
  } catch (error) {
    console.error('Error during user signup:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use(express.static('uploads'));

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const student = await studentmodel.findOne({ username });
    const faculty = await facultymodel.findOne({ username });
  
    if (!student && !faculty) {
      return res.render('login', { error: 'User not registered' });
    }
    let user;
    let role;
    if (student) {
      user = student;
      role = 'student';
    } else if (faculty) {
      user = faculty;
      role = 'faculty';
    }

    if (user.password !== password) {
      return res.render('login', { error: 'Incorrect password' });
    }

    if (user) {
      if (user.role === 'student') {
           res.cookie('username', username);
        res.redirect(`/home?username=${username}`);
      } else if (user.role === 'faculty') {
        res.redirect(`/h?username=${username}`);
      } else {
        res.status(400).send('Invalid role');
      }
    } else {
      res.status(400).send('Invalid username or password');
    }
    

    console.log('Username:', username);
    console.log('Password:', password);
    
  } catch (error) {
    console.error('Error during user login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/h',(req,res)=>{
  res.render('home');
  
})

app.get('/home', async (req, res) => {
 // const username = req.session.username;
  const username=req.params.username;

  const user = await studentmodel.findOne({ username });

  if (user) {
   
    res.render('home',{username});

  } else {
    res.status(404).send('User data not found');
  }
});

app.get('/score', (req, res) => {
  res.render('score');
});
app.get('/marks',(req,res)=>{
  res.render('facultymarks');
});
app.get('/att',(req,res)=>{
  res.render('attendance');
});
app.get('/students', async (req, res) => {
  try {
    const students = await studentmodel.find({ role: 'student' });


    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// app.post('/login', async (req, res) => {
//   try {
//    // const { username, password } = req.body;
//     const username=req.body.username;
//     const password=req.body.password;

//     // Check if the user exists in the database
//     const user = await usermodel.findOne({ username });

//     if (!user) {
     
//      // return res.render('login', { error: 'User not registered' });
//      return res.send('not registered')
//     }

//     if (user.password !== password) {
//       //return res.render('login', { error: 'Incorrect username or password' });
//       return res.send('not matched')
//     }
//     console.log('Username:', username);
//     console.log('Password:', password);
//     console.log('User:', user);
    
//     // Successful login
//     res.redirect('/login'); // Redirect to the main page or dashboard
//   } catch (error) {
//     console.error('Error during user login:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });



// app.get('/users/:username', async (req, res) => {
//     try {
//         const username = req.params.username;
//         console.log(username);
//         const result = await usermodel.find({ username:username });
//         console.log(result);
//         res.send(result);
//     } catch (err) {
//         console.log(err);
//     }
// });
const Schema = mongoose.Schema;

const schemaConfigSchema = new Schema({
  name: String,
  fields: [{ name: String, dataType: String }],
});
app.get('/k',(req,res)=>{
  res.render('ex');
});
app.get('/resume',(req,res)=>{
  res.render('Resume');
})
const schema = mongoose.Schema;
const schemas = [];

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.post('/create-schema', (req, res) => {
  const { name, fields } = req.body;

  const schemaFields = {};

  fields.forEach((field) => {
    schemaFields[field.name] = field.dataType;
  });

  const dynamicSchema = new mongoose.Schema(schemaFields);
  console.log('Registered Models:', Object.keys(mongoose.models));
   const DynamicModel = mongoose.model(name, dynamicSchema);
  console.log('Created Model Name:', DynamicModel.modelName);
  console.log('Registered Models:', Object.keys(mongoose.models));

  res.send(`Schema '${name}' created successfully.`);
  console.log(schemaFields);
  schemas.push({ name, fields });
});


app.get('/get-schema/:schemaName', (req, res) => {
  const schemaName = req.params.schemaName; 
  const schema = schemas.find((schema) => schema.name === schemaName);

  if (schema) {
    res.json({ name: schema.name, fields: schema.fields }); 
  } else {
    res.status(404).send('Schema not found');
  }
});
//posting data
app.post('/insert-data', async (req, res) => {
  const { schema, data } = req.body; 

  try {
     if (typeof schema !== 'string') {
      throw new Error('Invalid schema name');
    }

     if (!mongoose.models[schema]) {
      throw new Error(`Schema '${schema}' does not exist`);
    }

     const DynamicModel = mongoose.model(schema);

     const doc = new DynamicModel(data);

     await doc.save();

    res.send('Data inserted into schema successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});


//Attendance
 const StudentAttendance = require('./Attendance'); 

app.get('/getAttendance/:username', async (req, res) => {
  try {
    const username = req.params.username; 
    console.log(username)
     const attendanceData = await StudentAttendance.find({ username:username });
     console.log('Attendance Data:', attendanceData); 
    res.json(attendanceData);
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/users/delete/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const deletedUser = await usermodel.findOneAndDelete({ username });

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// app.get('/marks/:name', (req, res) => {
//   const name = req.params.name;
//   Marks.findOne({ name })
//     .then(document => {
//       if (document) {
//         console.log('Retrieved:', document);
//         res.json(document);
//       } else {
//         console.log('No documents found');
//         res.status(404).json({ message: 'No documents found' });
//       }
//     })
//     .catch(err => {
//       console.error(err);
//       res.status(500).json({ error: 'Internal server error' });
//     });
// });
// app.delete('/marks/delete/:name',(req,res)=>{
//   const name=req.params.name;
//   Marks.deleteOne()
//     .then(document=>{
//       if(document){
//         console.log('deleted',document);
//         res.json(document);
//       }
//       else {
//         console.log('No documents found');
//         res.status(404).json({ message: 'No documents found' });
//       }
//     })
//     .catch(err => {
//       console.error(err);
//       res.status(500).json({ error: 'Internal server error' });
//     });
//     });
  app.put('/users/update/:username',(req,res)=>{
    const username=req.params.username;
    const newData=req.body;

    usermodel.updateOne( { username }, newData, { new: true })
      .then(document=>{
        if(document){
          console.log('updates',document);
          res.json(document)
        }
        else{
          console.log('no documents found');
        }
     
      })
      .catch(err=>{
        if(err){
          console.error(err);
          res.status(500);
        }
      })
    
  });

const facultyregister=require('./facultyregister');
   
   
app.post('/api/faculty', async (req, res) => {
  const { username, password, cpassword, email, role } = req.body;
  
  try {
    const faculty = new facultyregister({ username, password, cpassword, email, role });
    await faculty.save();
    res.status(201).json({ message: 'Faculty registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error registering faculty');
  }
});
  
  
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});