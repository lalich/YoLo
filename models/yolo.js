const mongoose = require('./connections')

const yoloSchema = new mongoose.Schema({

    ticker: String,
    amount: Number,
    yolo: Boolean,
    riskP: Number,
    profitP: Number,
    duration: Number
})

const Yolos = mongoose.model('yolo', yoloSchema)

module.exports = Yolos