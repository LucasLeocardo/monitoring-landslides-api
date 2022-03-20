const mongoose = require('mongoose');

const User = mongoose.model('Users', {
    name: String,
    email: String,
    created_at: { type: Date, default: Date.now }
});

module.exports = User;