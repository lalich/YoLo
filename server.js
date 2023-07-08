// Import our dependencies
require('dotenv').config(); // bring in our .env vars
const express = require('express'); // web framework for node
const morgan = require('morgan'); // logger for node
const methodOverride = require('method-override'); // allows us to use PUT and DELETE methods
// express application
const app = express();

// middleware
app.use(morgan('tiny')); // logging
app.use(methodOverride('_method')); // override with POST having ?_method=DELETE or ?_method=PUT
app.use(express.static('public')); // serve static files from public folder

// Routes

app.get('/', (req, res) => {
    res.send('Yo git Fukd!');
    })


    app.get('/yolo', (req, res) => {
        res.sendfile('/Users/marklalich/Desktop/Desktop - Mark’s MacBook Pro/kale/unit2/project/home.html')
    })

    const PORT = process.env.PORT
    app.listen(PORT, () => { console.log(`Listening on port ${PORT}`)})