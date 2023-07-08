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

app.post('/yolos', async (req, res) => {
    req.body.yolo = req.body.yolo === 'on' ? true : false
        await Yolos.create(req.body)

        console.log('YoLo App Activated', req.body)
        res.redirect('/yolos')
})

app.get('/yolos', async (req,res) => {
    const allYolos = await Yolos.find({})
        console.log(allYolos)
            res.render('yolos.ejs', {yolos: allYolos})
})

app.get('/yolos/:id', async (req, res) => {
    const disYolo = await Yolos.findById(req.params.id)
    res.render('indiYolo.ejs', { yolos: disYolo})
})

app.get('/yolos/:id/edit', async (req, res) => {
    const yolo = await Yolos.findById(req.params.id)
    res.render('edit.ejs', { yolo })
})

app.put('/yolos/:id', async (req, res) => {
    req.body.yolo = req.body.yolo === 'on' ? true : false
    await Yolos.findByIdAndUpdate(req.params.id, req.body)
    res.redirect('/yolos')
})

app.delete('/yolos/:id', async (req,res) => {
    await Yolos.findByIdAndDelete(req.params.id)
    const deletedYolo = await Yolos.findByIdAndDelete(req.params.id)
    res.redirect('/yolos')
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