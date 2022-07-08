const rainfallLevel = require('../models/RainfallLevel');
const mongoose = require('mongoose');

class RainfallLevelController {
    static async getLastMesurementByDeviceIdAsync(deviceId) {
        return await rainfallLevel.findOne({deviceId: deviceId}).sort({timestamp: 'desc'}).limit(1).select({
            "_id": 1,
            "value": 1
        }).exec();
    }
}

module.exports = RainfallLevelController;