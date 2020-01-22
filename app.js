const 
  express = require('express'),
  path = require('path'),
  mongoose = require('mongoose'),
  session = require('express-session'),
  passport = require('passport'),
  flash = require('connect-flash'),
  multer = require('multer'),
  { ensureAuthenticated } = require('./config/auth');

// Init app

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname) );
    }
});

//init upload
const upload = multer ({
    storage
}).single('profile_image');


const app = express();
const PORT = process.env.PORT || 5000;


require('./config/passport')(passport);

// Database connect
mongoose.connect('mongodb://localhost:27017/social_site',{ useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to mongoDB'))
    .catch(err => console.log(err));

// Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//bodyparser
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/public', express.static('public')); 
app.use('/assets', express.static('assets')); 
 

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

app.use(flash());
//passport middleware
app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})



// Routes
app.use('/', require('./routes/root'));
app.use('/users', require('./routes/users'));
app.use('/profile', require('./routes/profile'));

// Start server..
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}...`));