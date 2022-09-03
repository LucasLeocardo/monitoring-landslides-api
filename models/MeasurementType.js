const mongoose = require('mongoose');

const MeasurementType = mongoose.model('MeasurementType', {
    name: String,
    unit: String,
    measuredData: [String],
    created_at: { type: Date, default: Date.now }
});

module.exports = MeasurementType;