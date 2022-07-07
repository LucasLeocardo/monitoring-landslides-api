const mongoose = require('mongoose');

const PorePressure = mongoose.model('PorePressure', {
    values: [Number],
    deviceId: mongoose.ObjectId,
    timestamp: { type: Date, default: Date.now }
});

module.exports = PorePressure;