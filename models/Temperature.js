const mongoose = require('mongoose');

const Temperature = mongoose.model('Temperature', {
    values: [Number],
    deviceId: mongoose.ObjectId,
    timestamp: { type: Date, default: Date.now }
});

module.exports = Temperature;