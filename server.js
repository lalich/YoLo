// Import our dependencies
require('dotenv').config(); // bring in our .env vars
const express = require('express'); // web framework for node
const session = require('express-session'); // web session middleware
const morgan = require('morgan'); // logger for node
const methodOverride = require('method-override'); // allows us to use PUT and DELETE methods
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');

const app = express();
const YoloRouter = require('./controllers/yolo');
const UserRouter = require('./controllers/user');
const apiKey = process.env.POLYAPI;
const flash = require('connect-flash');

// **Set up session middleware before flash and routes**
app.use(session({
    secret: process.env.SECRET || 'defaultsecret', // Use a secret from your .env file
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
    saveUninitialized: false,
    resave: false,
}));

// **Initialize connect-flash middleware after session middleware**
app.use(flash());

// Middleware to make flash messages available in views (after flash is initialized)
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// Middleware
app.use(morgan('tiny')); // logging
app.use(methodOverride('_method')); // override with POST having ?_method=DELETE or ?_method=PUT

app.use(express.static('public', {
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  },
})); // serve static files from public folder

app.use(express.urlencoded({ extended: true })); // allows req.body to be read from the form.
app.use(express.json()); // allows req.body to be
// Set the view engine to EJS
app.set('view engine', 'ejs');

// Routes
app.use('/yolos', YoloRouter);
app.use('/user', UserRouter);

app.get('/', (req, res) => {
  res.render('home.ejs');
});

// Remove unnecessary code if not needed
// If you have code to clear the database on server shutdown, ensure it's correctly implemented.

// Start the server
const PORT = process.env.PORT || 1011; // Use port from .env or default to 3000
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
