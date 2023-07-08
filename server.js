// Import our dependencies
require('dotenv').config(); // bring in our .env vars
const express = require('express'); // web framework for node
const morgan = require('morgan'); // logger for node
const methodOverride = require('method-override'); // allows us to use PUT and DELETE methods
// express application
const app = express();
const Yolos = require('./models/yolo')

// middleware
app.use(morgan('tiny')); // logging
app.use(methodOverride('_method')); // override with POST having ?_method=DELETE or ?_method=PUT
app.use(express.static('public', {setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');}}})) // serve static files from public folder
app.use(express.urlencoded({ extended: true})) // allows req.body to be read from the form.

// Routes

app.get('/', (req, res) => {
    res.sendFile('/Users/marklalich/Desktop/Desktop - Mark’s MacBook Pro/kale/unit2/project/home.html')
    })


app.get('/addie', (req, res) => {
        res.render('createYolo.ejs')
})






app.get('/show', (req, res) => {
        res.render('yolo.ejs')
})










    const PORT = process.env.PORT
    app.listen(PORT, () => { console.log(`Listening on port ${PORT}`)})