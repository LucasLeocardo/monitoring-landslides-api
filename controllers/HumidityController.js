const humidity = require('../models/Humidity');
const mongoose = require('mongoose');

class HumidityController {
    static async getDaillyMeasurementsByDeviceId(deviceId, startDate, endDate) {
        return await humidity.aggregate(
            [
                {  $match: { deviceId:  mongoose.Types.ObjectId(deviceId) , timestamp: { $gte: new Date(startDate) }, timestamp: { $lte: new Date(endDate) } } },
                {  $sort: { timestamp: 1 } },
                {  $group: { 
                    _id : { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    avgH0: {
                        $avg: "$h0"
                    },
                    avgH1: {
                        $avg: "$h1"
                    },
                    avgH2: {
                        $avg: "$h2"
                    },
                    avgH3: {
                        $avg: "$h3"
                    },
                    avgH4: {
                        $avg: "$h4"
                    },
                    avgH5: {
                        $avg: "$h5"
                    },
                    avgH6: {
                        $avg: "$h6"
                    },
                    avgH7: {
                        $avg: "$h7"
                    },
                    avgH8: {
                        $avg: "$h8"
                    },
                    avgH9: {
                        $avg: "$h9"
                    }
                }},
                {   $project: {
                    _id: 1, h0: {$round: ['$avgH0', 2]}, h1: {$round: ['$avgH1', 2]}, h2: {$round: ['$avgH2', 2]}, h3: {$round: ['$avgH3', 2]}, h4: {$round: ['$avgH4', 2]}, 
                    h5: {$round: ['$avgH5', 2]}, h6: {$round: ['$avgH6', 2]}, h7: {$round: ['$avgH7', 2]}, h8: {$round: ['$avgH8', 2]}, h9: {$round: ['$avgH9', 2]}
                }}
            ],
            function(err,results) {
                if (err) throw err;
                return results;
            }
        );
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