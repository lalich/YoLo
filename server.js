// Import our dependencies
require('dotenv').config(); // bring in our .env vars
const express = require('express'); // web framework for node
const morgan = require('morgan'); // logger for node
const methodOverride = require('method-override'); // allows us to use PUT and DELETE methods
// express application
const session = require('express-session')
const MongoStore = require('connect-mongo')
const mongoose = require('mongoose')

const app = express();
const YoloRouter = require('./controllers/yolo')
const UserRouter = require('./controllers/user')

// middleware
app.use(morgan('tiny')); // logging
app.use(methodOverride('_method')); // override with POST having ?_method=DELETE or ?_method=PUT

app.use(express.static('public', {setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');}}})) // serve static files from public folder
app.use(express.urlencoded({ extended: true})) // allows req.body to be read from the form.

app.use(session({
    secret: process.env.SECRET,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL}),
    saveUninitialized: true,
    resave: false,
}))

// has the controllers talking up a storm... be sure to place appropriately!
app.use('/yolos', YoloRouter)
app.use('/user', UserRouter)

// Routes

app.get('/', (req, res) => {
    res.sendFile('/Users/marklalich/Desktop/Desktop - Mark’s MacBook Pro/kale/unit2/project/home.html')
    })



// clears out DB on server shutdown
process.on('SIGINT', async () => {
    try {
        //delete the YOLOS until next session! 
        await Yolos.deleteMany({})
        console.log('The YoLo app is starting fresh')
        process.exit(0)
    } catch (error) {
        console.error('Failed to reset the YoloAPP', error)
        process.exit(1)
    }
})


    const PORT = process.env.PORT
    app.listen(PORT, () => { console.log(`Listening on port ${PORT}`)})