const mongoose = require('mongoose');

const Humidity = mongoose.model('Humidity', {
    values: [Number],
    deviceId: mongoose.ObjectId,
    timestamp: { type: Date, default: Date.now }
});

module.exports = Humidity;