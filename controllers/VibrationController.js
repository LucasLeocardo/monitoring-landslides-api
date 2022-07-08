const linearAcceleration = require('../models/LinearAcceleration');
const angularAcceleration = require('../models/AngularAcceleration');
const mongoose = require('mongoose');

class VibrationController {
    static async getDaillyMeasurementsByDeviceId(deviceId, startDate, endDate) {
        return await linearAcceleration.aggregate(
            [
                {  $match: { deviceId:  mongoose.Types.ObjectId(deviceId) , timestamp: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
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
                }},
                {  $sort: { _id: 1 } }
            ],
            function(err,results) {
                if (err) throw err;
                return results;
            }
        );
    }

    static async getHourlyMeasurementsByDeviceId(deviceId, startDate, endDate) {
        const realStartDate = new Date(startDate);
        realStartDate.setHours(realStartDate.getHours() - Math.floor(Math.abs(realStartDate.getTimezoneOffset()) / 60));
        const realEndDate = new Date(endDate);
        realEndDate.setHours(realEndDate.getHours() - Math.floor(Math.abs(realEndDate.getTimezoneOffset()) / 60));
        return await linearAcceleration.aggregate(
            [
                {  $match: { deviceId:  mongoose.Types.ObjectId(deviceId) , timestamp: { $gte: realStartDate, $lte: realEndDate } } },
                {  $group: { 
                    _id : { $dateToString: { format: "%Y-%m-%dT%H", date: "$timestamp" } },
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
                }},
                {  $sort: { _id: 1 } }
            ],
            function(err,results) {
                if (err) throw err;
                return results;
            }
        );
    }

    static async getLastLinearAccelerationByDeviceIdAsync(deviceId) {
        return await linearAcceleration.findOne({deviceId: deviceId}).sort({timestamp: 'desc'}).limit(1).select({
            "_id": 1,
            "acelX": 1,
            "acelY": 1,
            "acelZ": 1
        }).exec();
    }

    static async getLastAngularAccelerationByDeviceIdAsync(deviceId) {
        return await angularAcceleration.findOne({deviceId: deviceId}).sort({timestamp: 'desc'}).limit(1).select({
            "_id": 1,
            "alphaX": 1,
            "alphaY": 1,
            "alphaZ": 1
        }).exec();
    }
}

module.exports = VibrationController;