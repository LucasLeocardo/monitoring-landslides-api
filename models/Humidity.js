const mongoose = require('mongoose');

const Humidity = mongoose.model('Humidity', {
    value: Number,
    deviceId: mongoose.ObjectId,
    timestamp: { type: Date, default: Date.now }
});

module.exports = Humidity;