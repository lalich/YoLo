const express = require('express');
const bcrypt = require('bcryptjs');
// Requiring the User schema
const User = require('../models/user');

const router = express.Router();

// Route to create new user (signup)
router.get('/signup', (req, res) => {
    res.render('./user/signup.ejs');
});

router.post('/signup', async (req, res) => {
    try {
        // Hash the password
        req.body.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10));
        // Initialize balance to 0
        req.body.balance = 0;
        // Create the user
        await User.create(req.body);
        req.flash('success', 'Signup successful! You can now log in.');
        res.redirect('/user/login');
    } catch (error) {
        console.error('Error during signup:', error);
        req.flash('error', 'An error occurred during signup. Please try again.');
        res.redirect('/user/signup');
    }
});

// Route to display login form
router.get('/login', (req, res) => {
    res.render('user/login.ejs');
});

// Handle login
router.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
        req.flash('error', 'User not found. Please sign up first.');
        res.redirect('/user/signup');
    } else {
        const passmatches = bcrypt.compareSync(req.body.password, user.password);
        if (passmatches) {
            // Set user information in session
            req.session.userId = user._id;
            req.session.username = user.username;
            req.session.loggedIn = true;
            req.session.balance = user.balance; // Store balance in session
            req.flash('success', 'Login successful!');
            res.redirect('/yolos');
        } else {
            req.flash('error', 'Incorrect password. Please try again.');
            res.redirect('/user/login');
        }
    }
});

// Route to handle adding funds
router.post('/add-funds', async (req, res) => {
    try {
        const amount = parseFloat(req.body.amount);
        if (isNaN(amount) || amount <= 0) {
            req.flash('error', 'Invalid amount entered.');
            res.redirect('/yolos');
            return;
        }

        // Find the user by session userId
        const user = await User.findById(req.session.userId);
        if (!user) {
            req.flash('error', 'User not found. Please log in again.');
            res.redirect('/user/login');
            return;
        }

        // Update the user's balance
        user.balance += amount;
        await user.save();

        // Update the balance in session
        req.session.balance = user.balance;

        req.flash('success', `Successfully added $${amount.toFixed(2)} to your balance.`);
        res.redirect('/yolos');
    } catch (error) {
        console.error('Error adding funds:', error);
        req.flash('error', 'Error adding funds. Please try again.');
        res.redirect('/yolos');
    }
});

// Route to handle cashout
router.post('/cashout', async (req, res) => {
    try {
        const amount = parseFloat(req.body.amount);
        if (isNaN(amount) || amount <= 0) {
            req.flash('error', 'Invalid amount entered.');
            return res.redirect('/yolos');
        }

        // Find the user by session userId
        const user = await User.findById(req.session.userId);
        if (!user) {
            req.flash('error', 'User not found. Please log in again.');
            return res.redirect('/user/login');
        }

        // Check if the user has sufficient balance
        if (user.balance < amount) {
            req.flash('error', 'Insufficient funds to cash out that amount.');
            return res.redirect('/yolos');
        }

        // Subtract the amount from the user's balance
        user.balance -= amount;
        await user.save();

        // Update the balance in session
        req.session.balance = user.balance;

        req.flash('success', `Successfully cashed out $${amount.toFixed(2)} from your balance.`);
        res.redirect('/yolos');
    } catch (error) {
        console.error('Error during cashout:', error);
        req.flash('error', 'Error during cashout. Please try again.');
        res.redirect('/yolos');
    }
});

// Route to logout
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            req.flash('error', 'Error logging out. Please try again.');
            res.redirect('/yolos');
        } else {
            res.redirect('/');
        }
    });
});

module.exports = router;
