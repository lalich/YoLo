const mongoose = require('./connections')

const yoloSchema = new mongoose.Schema({

    ticker: String,
    amount: Number,
    yolo: Boolean,
    riskP: Number,
    profitP: Number,
    duration: Number,
    username: String
})

const Yolos = mongoose.model('yolo', yoloSchema)

module.exports = Yolos