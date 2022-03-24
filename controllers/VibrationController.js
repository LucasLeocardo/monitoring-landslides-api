const vibration = require('../models/Vibration');

class VibrationController {
    static async getMesurementsByDeviceIdAsync(deviceId, startDate) {
        return await vibration.find({deviceId: deviceId, timestamp: { $gte: startDate }}, null, { sort: {timestamp: 'desc'} });
    }
}

module.exports = VibrationController;