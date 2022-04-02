const humidity = require('../models/Humidity');

class HumidityController {
    static async getMesurementsByDeviceIdAsync(deviceId, startDate) {
        return await humidity.find({deviceId: deviceId, timestamp: { $gte: startDate }}, null, { sort: {timestamp: 'desc'} });
    }
}

module.exports = HumidityController;