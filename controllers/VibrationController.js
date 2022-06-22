const vibration = require('../models/Vibration');
const mongoose = require('mongoose');

class VibrationController {
    static async getDaillyMeasurementsByDeviceId(deviceId, startDate, endDate) {
        return await vibration.aggregate(
            [
                {  $match: { deviceId:  mongoose.Types.ObjectId(deviceId) , timestamp: { $gte: new Date(startDate) }, timestamp: { $lte: new Date(endDate) } } },
                {  $sort: { timestamp: 1 } },
                {  $group: { 
                    _id : { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    avgAcelX: {
                        $avg: "$acelX"
                    },
                    avgAcelY: {
                        $avg: "$acelY"
                    },
                    avgAcelZ: {
                        $avg: "$acelZ"
                    },
                    avgAlphaX: {
                        $avg: "$alphaX"
                    },
                    avgAlphaY: {
                        $avg: "$alphaY"
                    },
                    avgAlphaZ: {
                        $avg: "$alphaZ"
                    }
                }},
                {   $project: {
                    _id: 1, acelX: {$round: ['$avgAcelX', 2]}, acelY: {$round: ['$avgAcelY', 2]}, acelZ: {$round: ['$avgAcelZ', 2]}, 
                    alphaX: {$round: ['$avgAlphaX', 2]}, alphaY: {$round: ['$avgAlphaY', 2]}, alphaZ: {$round: ['$avgAlphaZ', 2]}
                }}
            ],
            function(err,results) {
                if (err) throw err;
                return results;
            }
        );
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