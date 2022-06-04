const humidity = require('../models/Humidity');

class HumidityController {
    static async getMesurementsByDeviceIdAsync(deviceId, startDate) {
        return await humidity.find({deviceId: deviceId, timestamp: { $gte: startDate }}, null, { sort: {timestamp: 'desc'} });
    }

    static async getLastMesurementByDeviceIdAsync(deviceId) {
        return await humidity.findOne({deviceId: deviceId}).sort({timestamp: 'desc'}).limit(1).select({
            "_id": 1,
            "h0": 1,
            "h1": 1,
            "h2": 1,
            "h3": 1,
            "h4": 1,
            "h5": 1,
            "h6": 1,
            "h7": 1,
            "h8": 1,
            "h9": 1
        }).exec();
    }
}

module.exports = HumidityController;