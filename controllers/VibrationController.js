const vibration = require('../models/Vibration');

class VibrationController {
    static async getMesurementsByDeviceIdAsync(deviceId, startDate) {
        return await vibration.find({deviceId: deviceId, timestamp: { $gte: startDate }}, null, { sort: {timestamp: 'desc'} });
    }

    static async getLastMesurementByDeviceIdAsync(deviceId) {
        return await vibration.findOne({deviceId: deviceId}).sort({timestamp: 'desc'}).limit(1).select({
            "_id": 1,
            "acelX": 1,
            "acelY": 1,
            "acelZ": 1,
            "alphaX": 1,
            "alphaY": 1,
            "alphaZ": 1
        }).exec();
    }
}

module.exports = VibrationController;