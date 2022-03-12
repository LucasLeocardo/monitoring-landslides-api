const mongoose = require('mongoose');

const Device = mongoose.model('Devices', {
    number: String,
    created_at: { type: Date, default: Date.now }
});

module.exports = Device;