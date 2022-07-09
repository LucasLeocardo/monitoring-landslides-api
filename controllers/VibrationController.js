const linearAcceleration = require('../models/LinearAcceleration');
const angularAcceleration = require('../models/AngularAcceleration');
const mongoose = require('mongoose');

class VibrationController {
    static async getDaillyLinearAccelerationByDeviceId(deviceId, startDate, endDate) {
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
                    }
                }},
                {   $project: {
                    _id: 1, x: {$round: ['$avgAcelX', 2]}, y: {$round: ['$avgAcelY', 2]}, z: {$round: ['$avgAcelZ', 2]}
                }},
                {  $sort: { _id: 1 } }
            ],
            function(err,results) {
                if (err) throw err;
                return results;
            }
        );
    }

    static async getDaillyAngularAccelerationByDeviceId(deviceId, startDate, endDate) {
        return await angularAcceleration.aggregate(
            [
                {  $match: { deviceId:  mongoose.Types.ObjectId(deviceId) , timestamp: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
                {  $group: { 
                    _id : { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
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
                    _id: 1, x: {$round: ['$avgAlphaX', 2]}, y: {$round: ['$avgAlphaY', 2]}, z: {$round: ['$avgAlphaZ', 2]}
                }},
                {  $sort: { _id: 1 } }
            ],
            function(err,results) {
                if (err) throw err;
                return results;
            }
        );
    }

    static async getHourlyLinearAccelerationByDeviceId(deviceId, startDate, endDate) {
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
                    }
                }},
                {   $project: {
                    _id: 1, x: {$round: ['$avgAcelX', 2]}, y: {$round: ['$avgAcelY', 2]}, z: {$round: ['$avgAcelZ', 2]}
                }},
                {  $sort: { _id: 1 } }
            ],
            function(err,results) {
                if (err) throw err;
                return results;
            }
        );
    }

    static async getHourlyAngularAccelerationByDeviceId(deviceId, startDate, endDate) {
        const realStartDate = new Date(startDate);
        realStartDate.setHours(realStartDate.getHours() - Math.floor(Math.abs(realStartDate.getTimezoneOffset()) / 60));
        const realEndDate = new Date(endDate);
        realEndDate.setHours(realEndDate.getHours() - Math.floor(Math.abs(realEndDate.getTimezoneOffset()) / 60));
        return await angularAcceleration.aggregate(
            [
                {  $match: { deviceId:  mongoose.Types.ObjectId(deviceId) , timestamp: { $gte: realStartDate, $lte: realEndDate } } },
                {  $group: { 
                    _id : { $dateToString: { format: "%Y-%m-%dT%H", date: "$timestamp" } },
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
                    _id: 1, x: {$round: ['$avgAlphaX', 2]}, y: {$round: ['$avgAlphaY', 2]}, z: {$round: ['$avgAlphaZ', 2]}
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