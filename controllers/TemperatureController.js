const temperature = require('../models/Temperature');
const mongoose = require('mongoose');

class TemperatureController {
    static async getDaillyMeasurementsByDeviceId(deviceId, startDate, endDate) {
        const temperatureData = await temperature.aggregate(
            [
                {  $match: { deviceId:  mongoose.Types.ObjectId(deviceId) , timestamp: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
                {  $sort: { timestamp: 1 } },
                {  $group: { 
                    _id : { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    avgT0: {
                        $avg: "$t0"
                    },
                    avgT1: {
                        $avg: "$t1"
                    },
                    avgT2: {
                        $avg: "$t2"
                    },
                    avgT3: {
                        $avg: "$t3"
                    },
                    avgT4: {
                        $avg: "$t4"
                    },
                    avgT5: {
                        $avg: "$t5"
                    },
                    avgT6: {
                        $avg: "$t6"
                    },
                    avgT7: {
                        $avg: "$t7"
                    },
                    avgT8: {
                        $avg: "$t8"
                    },
                    avgT9: {
                        $avg: "$t9"
                    }
                }},
                {   $project: {
                    _id: 1, t0: {$round: ['$avgT0', 2]}, t1: {$round: ['$avgT1', 2]}, t2: {$round: ['$avgT2', 2]}, t3: {$round: ['$avgT3', 2]}, t4: {$round: ['$avgT4', 2]}, 
                    t5: {$round: ['$avgT5', 2]}, t6: {$round: ['$avgT6', 2]}, t7: {$round: ['$avgT7', 2]}, t8: {$round: ['$avgT8', 2]}, t9: {$round: ['$avgT9', 2]}
                }}
            ],
            function(err,results) {
                if (err) throw err;
                return results;
            }
        );
        return temperatureData.map(data => {
            return {_id : data._id, temperature: calculateAverage([data.t0, data.t1, data.t2, data.t3, data.t4, data.t5, 
                data.t6, data.t7, data.t8 , data.t9])}
        });
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

const calculateAverage = (numberArray) => {
    let arraySum = 0;
    numberArray.forEach(item => {
        arraySum = arraySum + item;
    });
    return (Math.round(arraySum) / 10);
}