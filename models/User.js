const mongoose = require('mongoose');

const User = mongoose.model('Users', {
    name: String,
    email: String,
    hashPassword: String,
    isAdmin: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now }
});

module.exports = User;