const express = require('express')
// requireing the yolo schema
const Yolos = require('../models/yolo')

const router = express.Router()

// require login and create id to use the application
router.use((req, res) => {
    if(req.session.loggedIn){
        next()
    } else {
        res.redirect('/user/login')
    }
})

router.get('/yolos', async (req,res) => {
    const allYolos = await Yolos.find({ usernam: req.session.username })
        console.log(allYolos)
            res.render('yolos.ejs', {yolos: allYolos, user: req.session.username})
    })

router.get('/addie', (req, res) => {
    res.render('createYolo.ejs')
})


router.post('/yolos', async (req, res) => {
    req.body.yolo = req.body.yolo === 'on' ? true : false
    req.body.username = req.session.username

        await Yolos.create(req.body)

    console.log('YoLo App Activated', req.body)
    res.redirect('/yolos')
})





router.get('/yolos/:id', async (req, res) => {
const disYolo = await Yolos.findById(req.params.id)
res.render('indiYolo.ejs', { yolos: disYolo})
})


router.get('/yolos/:id/edit', async (req, res) => {
const yolo = await Yolos.findById(req.params.id)
res.render('edit.ejs', { yolo })
})


router.put('/yolos/:id', async (req, res) => {
req.body.yolo = req.body.yolo === 'on' ? true : false
await Yolos.findByIdAndUpdate(req.params.id, req.body)
res.redirect('/yolos')
})


router.delete('/yolos/:id', async (req,res) => {
await Yolos.findByIdAndDelete(req.params.id)
const deletedYolo = await Yolos.findByIdAndDelete(req.params.id)
res.redirect('/yolos')
})



module.exports = router