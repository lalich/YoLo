const express = require('express')
// requireing the yolo schema
const Yolos = require('../models/yolo')

const router = express.Router()

// require login and create id to use the application
router.use((req, res, next) => {
    if(req.session.loggedIn){
        next()
    } else {
        res.redirect('/user/login')
    }
})


// my routes for the YoLo controller!


router.get('/', async (req,res) => {
    const allYolos = await Yolos.find({ username: req.session.username })
       
            res.render('yolos.ejs', {yolos: allYolos, user: req.session.username})
    })



router.get('/addie', (req, res) => {
    res.render('createYolo.ejs')
})

router.get('/wsry', (req, res) => {
    res.render('wsry.ejs')
})


router.post('/', async (req, res) => {
    req.body.yolo = req.body.yolo === 'on' ? true : false
    req.body.riskP = req.body.yolo ? 100 : req.body.riskP   
    req.body.username = req.session.username

        await Yolos.create(req.body)

    
    res.redirect('/yolos')
})

router.post('/wsryC', async (req, res) => {
    try {
        // Use the ticker passed from the client (hidden input field)
        let yoloNew = {
            ticker: req.body.selectedTicker,  // Use the ticker from the client
            amount: req.body.amount,
            yolo: true,
            riskP: 100,
            profitP: req.body.profitP,
            duration: 30,
            username: req.session.username
        }

        // Log the yoloNew object to ensure correctness
        console.log("Creating new YoLo with the following data:", yoloNew);

        // Create the new YoLo in the database
        const wsRouletteY = await Yolos.create(yoloNew);

        // Log the created YoLo for debugging
        console.log("YoLo created:", wsRouletteY);

        // Redirect back to the main page
        res.redirect('/yolos');

    } catch (error) {
        console.log("Error creating YoLo:", error);
        res.redirect('/');
    }
});

router.get('/:id', async (req, res) => {
const disYolo = await Yolos.findById(req.params.id)
res.render('indiYolo.ejs', { yolos: disYolo})
})


router.get('/:id/edit', async (req, res) => {
const yolo = await Yolos.findById(req.params.id)
res.render('edit.ejs', { yolo })
})


router.put('/:id', async (req, res) => {
    req.body.yolo = req.body.yolo === 'on' ? true : false
    req.body.riskP = req.body.yolo ? 100 : req.body.riskP  
await Yolos.findByIdAndUpdate(req.params.id, req.body)
res.redirect('/yolos')
})


router.delete('/:id', async (req,res) => {
await Yolos.findByIdAndDelete(req.params.id)
const deletedYolo = await Yolos.findByIdAndDelete(req.params.id)
res.redirect('/yolos')
})


module.exports = router