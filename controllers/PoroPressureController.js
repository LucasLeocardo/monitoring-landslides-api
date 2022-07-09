const porePressure = require('../models/PorePressure');
const mongoose = require('mongoose');

class PoroPressureController {

    static async getLastMesurementByDeviceIdAsync(deviceId) {
        return await porePressure.findOne({deviceId: deviceId}).sort({timestamp: 'desc'}).limit(1).select({
            "_id": 1,
            "value": 1
        }).exec();
    }

    static async getDaillyMeasurementsByDeviceId(deviceId, startDate, endDate) {
        return await porePressure.aggregate(
            [
                {  $match: { deviceId:  mongoose.Types.ObjectId(deviceId) , timestamp: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
                {  $group: { 
                    _id : { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    avgValue: {
                        $avg: "$value"
                    }
                }},
                {   $project: {
                    _id: 1, value: {$round: ['$avgValue', 2]}
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
        return await porePressure.aggregate(
            [
                {  $match: { deviceId:  mongoose.Types.ObjectId(deviceId) , timestamp: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
                {  $group: { 
                    _id : { $dateToString: { format: "%Y-%m-%dT%H", date: "$timestamp" } },
                    avgValue: {
                        $avg: "$value"
                    }
                }},
                {   $project: {
                    _id: 1, value: {$round: ['$avgValue', 2]}
                }},
                {  $sort: { _id: 1 } }
            ],
            function(err,results) {
                if (err) throw err;
                return results;
            }
        );
    }
}

module.exports = PoroPressureController;