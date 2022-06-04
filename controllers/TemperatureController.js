const temperature = require('../models/Temperature');

class TemperatureController {
    static async getMesurementsByDeviceIdAsync(deviceId, startDate) {
        return await temperature.find({deviceId: deviceId, timestamp: { $gte: startDate }}, null, { sort: {timestamp: 'desc'} });
    }

    static async getLastMesurementByDeviceIdAsync(deviceId) {
        return await temperature.findOne({deviceId: deviceId}).sort({timestamp: 'desc'}).limit(1).select({
            "_id": 1,
            "t0": 1,
            "t1": 1,
            "t2": 1,
            "t3": 1,
            "t4": 1,
            "t5": 1,
            "t6": 1,
            "t7": 1,
            "t8": 1,
            "t9": 1
        }).exec();
    }
}

module.exports = TemperatureController;