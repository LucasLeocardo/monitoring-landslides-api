const iotData = require('../models/IotData');
const mongoose = require('mongoose');
const measurementTypes = require('../entities/measurementTypes');
const MeasurementTypeController = require('../controllers/MeasurementTypeController');

class HumidityController {

    static async getDaillyMeasurementsByDeviceId(deviceId, startDate, endDate) {
        const measurementTypeId = await MeasurementTypeController.getMeasurementTypeIdAsync(measurementTypes.HUMIDITY);
        return await iotData.aggregate(
            [
                {  $match: { deviceId:  mongoose.Types.ObjectId(deviceId) , timestamp: { $gte: new Date(startDate), $lte: new Date(endDate) }, measurementTypeId: mongoose.Types.ObjectId(measurementTypeId) } },
                {  $group: { 
                    _id : { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    avgValue: {
                        $avg: "$value.humidity"
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
        const measurementTypeId = await MeasurementTypeController.getMeasurementTypeIdAsync(measurementTypes.HUMIDITY);
        return await iotData.aggregate(
            [
                {  $match: { deviceId:  mongoose.Types.ObjectId(deviceId) , timestamp: { $gte: new Date(startDate), $lte: new Date(endDate) }, measurementTypeId: mongoose.Types.ObjectId(measurementTypeId) } },
                {  $group: { 
                    _id : { $dateToString: { format: "%Y-%m-%dT%H", date: "$timestamp" } },
                    avgValue: {
                        $avg: "$value.humidity"
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

    static async getLastMesurementByDeviceIdAsync(deviceId, measurementTypeId) {
        return await iotData.findOne({deviceId: deviceId, measurementTypeId: measurementTypeId}).sort({timestamp: 'desc'}).limit(1).select({
            "_id": 1,
            "value": 1
        }).exec();
    }
}

module.exports = HumidityController;