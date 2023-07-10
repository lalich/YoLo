const express = require('express')
const bcrypt = require('bcryptjs')
// requiring the user schema
const User = require('../models/user')
const { route } = require('./yolo')

const router = express.Router()

// route to create new degen
router.get('/signup', (req, res) => {
    res.render('./user/signup.ejs')
})


router.post('/signup', async (req, res) => {
    try{
        req.body.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10))
        await User.create(req.body)
        res.redirect('/user/login')
    } catch(error) {
        console.error('You aint Degen enough!', error)
        res.send('nah dawg kick rocks...(this means you errored out, <a href="/user/signup">please try again!</a>)')
    }
})

router.get('/login', async (req, res) => {
    res.render('user/login.ejs')
})

router.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username })
console.log(user)
    if(!user) {
        res.send('nah homie, you got to <a href="/user/signup"> sign that ID up!</a>')
    } else {
        const passmatches = bcrypt.compareSync(req.body.password, user.password)
        if (passmatches) {
            req.session.username = req.body.username
            req.session.loggedIn = true
            res.redirect('/yolos')
      
        
        } else {
            res.send('You aint using the <a href="/user/login">magic word(s)</a>')
        }
    }
})

router.get('logout', (req, res) => {
    req.session.destroy(err => {
        res.redirect('/')
    })
})


module.exports = router