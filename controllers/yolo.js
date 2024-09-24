const express = require('express');
// Require the YoLo and User schemas
const Yolo = require('../models/yolo');
const User = require('../models/user');

const router = express.Router();

// Require login to use the application
router.use((req, res, next) => {
    if (req.session.loggedIn) {
        next();
    } else {
        res.redirect('/user/login');
    }
});

// YoLo Routes

// Display YoLo Page
router.get('/', async (req, res) => {
    try {
        // Retrieve the user from the database
        const user = await User.findById(req.session.userId);
        if (!user) {
            req.flash('error', 'User not found. Please log in again.');
            res.redirect('/user/login');
            return;
        }

        // Update session balance in case it has changed
        req.session.balance = user.balance;

        // Retrieve the user's YoLos
        const yolos = await Yolo.find({ username: req.session.username });

        res.render('yolos.ejs', {
            user: req.session.username,
            balance: user.balance,
            yolos: yolos,
        });
    } catch (error) {
        console.error('Error loading YoLo page:', error);
        req.flash('error', 'Error loading YoLo page. Please try again.');
        res.redirect('/user/login');
    }
});

// Display Manual YoLo Creation Form
router.get('/addie', (req, res) => {
    res.render('createYolo.ejs');
});

// Display WSRY Wheel
router.get('/wsry', (req, res) => {
    res.render('wsry.ejs');
});

// Create YoLo via Manual Entry
router.post('/', async (req, res) => {
    try {
        // Parse and validate the amount
        const yoloAmount = parseFloat(req.body.amount);
        if (isNaN(yoloAmount) || yoloAmount <= 0) {
            req.flash('error', 'Invalid amount entered.');
            res.redirect('/yolos/addie');
            return;
        }

        // Retrieve the user from the database
        const user = await User.findById(req.session.userId);
        if (!user) {
            req.flash('error', 'User not found. Please log in again.');
            res.redirect('/user/login');
            return;
        }

        // Check if the user has sufficient balance
        if (user.balance < yoloAmount) {
            req.flash('error', 'Insufficient funds. Please add funds to your wallet.');
            res.redirect('/yolos');
            return;
        }

        // Deduct the amount from the user's balance
        user.balance -= yoloAmount;
        await user.save();

        // Update the balance in the session
        req.session.balance = user.balance;

        // Prepare the YoLo data
        req.body.yolo = req.body.yolo === 'on' ? true : false;
        req.body.riskP = req.body.yolo ? 100 : req.body.riskP;
        req.body.username = req.session.username;

        // Create the new YoLo
        await Yolo.create(req.body);

        req.flash('success', 'YoLo created successfully!');
        res.redirect('/yolos');
    } catch (error) {
        console.error('Error creating YoLo:', error);
        req.flash('error', 'Error creating YoLo. Please try again.');
        res.redirect('/yolos/addie');
    }
});

// Create YoLo via WSRY Wheel
router.post('/wsryC', async (req, res) => {
  try {
      // Extract data from the request body
      const { amount, profitP, selectedTicker } = req.body;
      const username = req.session.username;

      // Validate the data
      if (!amount || !profitP || !selectedTicker || !username) {
          return res.status(400).json({ error: 'Invalid data' });
      }

      // Ensure amount and profitP are numbers
      const amountValue = parseFloat(amount);
      const profitPValue = parseFloat(profitP);

      if (isNaN(amountValue) || isNaN(profitPValue) || amountValue <= 0 || profitPValue <= 0) {
          return res.status(400).json({ error: 'Invalid amount or profit percentage' });
      }

      // Deduct the amount from the user's balance
      const user = await User.findById(req.session.userId);
      if (!user) {
          return res.status(401).json({ error: 'User not found' });
      }

      if (user.balance < amountValue) {
          return res.status(400).json({ error: 'Insufficient balance' });
      }

      user.balance -= amountValue;
      await user.save();

      // Update the balance in the session
      req.session.balance = user.balance;

      // Create the new YoLo
      const newYolo = await Yolo.create({
          ticker: selectedTicker,
          amount: amountValue,
          profitP: profitPValue,
          yolo: true, // Assuming this is a WSRY YoLo
          username: username,
          // Add any other required fields
      });

      // Send a success response
      res.json({ success: true });

  } catch (error) {
      console.error('Error creating YoLo:', error);
      res.status(500).json({ error: 'Server error' });
  }
});

// Display Individual YoLo
router.get('/:id', async (req, res) => {
    try {
        const disYolo = await Yolo.findById(req.params.id);
        res.render('indiYolo.ejs', { yolos: disYolo });
    } catch (error) {
        console.error('Error fetching YoLo:', error);
        req.flash('error', 'Error fetching YoLo. Please try again.');
        res.redirect('/yolos');
    }
});

// Display Edit YoLo Form
router.get('/:id/edit', async (req, res) => {
    try {
        const yolo = await Yolo.findById(req.params.id);
        res.render('edit.ejs', { yolo });
    } catch (error) {
        console.error('Error fetching YoLo for editing:', error);
        req.flash('error', 'Error fetching YoLo for editing. Please try again.');
        res.redirect('/yolos');
    }
});

// Update YoLo
router.put('/:id', async (req, res) => {
    try {
      // Retrieve the existing YoLo
      const existingYolo = await Yolo.findById(req.params.id);
      if (!existingYolo) {
        req.flash('error', 'YoLo not found.');
        return res.redirect('/yolos');
      }
  
      // Ensure that the YoLo belongs to the logged-in user
      if (existingYolo.username !== req.session.username) {
        req.flash('error', 'You are not authorized to edit this YoLo.');
        return res.redirect('/yolos');
      }
  
      // Retrieve the user
      const user = await User.findById(req.session.userId);
      if (!user) {
        req.flash('error', 'User not found. Please log in again.');
        return res.redirect('/user/login');
      }
  
      // Parse and validate the new amount
      const newAmount = parseFloat(req.body.amount);
      if (isNaN(newAmount) || newAmount <= 0) {
        req.flash('error', 'Invalid amount entered.');
        return res.redirect(`/yolos/${req.params.id}/edit`);
      }
  
      // Calculate the difference between the new amount and the old amount
      const amountDifference = newAmount - existingYolo.amount;
  
      // If the new amount is greater, deduct the difference from user's balance
      if (amountDifference > 0) {
        if (user.balance < amountDifference) {
          req.flash('error', 'Insufficient funds to increase the YoLo amount.');
          return res.redirect(`/yolos/${req.params.id}/edit`);
        }
        user.balance -= amountDifference;
      } else if (amountDifference < 0) {
        // If the new amount is less, refund the difference to the user's balance
        user.balance += Math.abs(amountDifference);
      }
      // Save the updated user balance
      await user.save();
  
      // Update the balance in the session
      req.session.balance = user.balance;
  
      // Update the YoLo document
      req.body.yolo = req.body.yolo === 'on' ? true : false;
      req.body.riskP = req.body.yolo ? 100 : req.body.riskP;
      req.body.amount = newAmount; // Ensure amount is updated
  
      await Yolo.findByIdAndUpdate(req.params.id, req.body);
  
      req.flash('success', 'YoLo updated successfully, your balance is up to date!');
      res.redirect('/yolos');
    } catch (error) {
      console.error('Error updating YoLo:', error);
      req.flash('error', 'Error updating YoLo. Please try again.');
      res.redirect('/yolos');
    }
  });
  

// Delete YoLo
router.delete('/:id', async (req, res) => {
    try {
      // Retrieve the YoLo to get the amount and username
      const yolo = await Yolo.findById(req.params.id);
      if (!yolo) {
        req.flash('error', 'YoLo not found.');
        return res.redirect('/yolos');
      }
  
      // Ensure that the YoLo belongs to the logged-in user
      if (yolo.username !== req.session.username) {
        req.flash('error', 'You are not authorized to cancel this YoLo.');
        return res.redirect('/yolos');
      }
  
      // Retrieve the user from the database
      const user = await User.findById(req.session.userId);
      if (!user) {
        req.flash('error', 'User not found. Please log in again.');
        return res.redirect('/user/login');
      }
  
      // Refund the YoLo amount to the user's balance
      user.balance += yolo.amount;
      await user.save();
      // After refunding the amount
const formattedAmount = yolo.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });


  
      // Update the balance in the session
      req.session.balance = user.balance;
  
      // Delete the YoLo
      await Yolo.findByIdAndDelete(req.params.id);
  
      req.flash('success', `YoLo canceled and $${formattedAmount} refunded to your balance.`);
      res.redirect('/yolos');
    } catch (error) {
      console.error('Error deleting YoLo:', error);
      req.flash('error', 'Error deleting YoLo. Please try again.');
      res.redirect('/yolos');
    }
  });
  

module.exports = router;
