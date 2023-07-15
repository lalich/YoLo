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
    try{

    const tickerSet = ['AAPL', 'GOOGL', 'AMZN', 'META', 'INTC', 'SOFI', 'A', 'GME', 'BB', 'CVX',
                        'XOM', 'T', 'NIO', 'BABA', 'MSFT', 'TSLA', 'NVDA', 'HD', 'PG', 'KO',
                        'COST', 'CRM', 'MCD', 'NFLX', 'F', 'AMD', 'TMUS', 'NKE', 'DIS', 'RTX',
                        'BA', 'CAT', 'UNP', 'TM', 'PEP', 'SPY', 'QQQ', 'PLTR']
// console.log(tickerSet[7])

        function randomT(tickerSet) { 
                    const randomIndex= Math.floor(Math.random() * (tickerSet.length -1))
                        return tickerSet[randomIndex]
                        }
                        // console.log(randomT(tickerSet))

    let yoloNew = {
        ticker: randomT(tickerSet),
        amount: req.body.amount,
        yolo: true,
        riskP: 100,
        profitP: req.body.profitP,
        duration: 30,
        username: req.session.username
    }
        console.log(yoloNew)
          const wsRouletteY =  await Yolos.create(yoloNew)

console.log(wsRouletteY)
  
    res.redirect('/yolos')

           } catch (error) {
                        console.log(error)
                        res.redirect('/') 
                    }
})



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