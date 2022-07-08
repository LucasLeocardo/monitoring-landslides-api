const porePressure = require('../models/PorePressure');
const mongoose = require('mongoose');

class PoroPressureController {
    static async getLastMesurementByDeviceIdAsync(deviceId) {
        return await porePressure.findOne({deviceId: deviceId}).sort({timestamp: 'desc'}).limit(1).select({
            "_id": 1,
            "value": 1
        }).exec();
    }
}

module.exports = PoroPressureController;