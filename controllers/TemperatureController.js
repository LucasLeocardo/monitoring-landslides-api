const temperature = require('../models/Temperature');

class TemperatureController {
    static async getMesurementsByDeviceIdAsync(deviceId, startDate) {
        return await temperature.find({deviceId: deviceId, timestamp: { $gte: startDate }}, null, { sort: {timestamp: 'desc'} });
    }
}

module.exports = TemperatureController;