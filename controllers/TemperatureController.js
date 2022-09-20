const iotData = require('../models/IotData');
const mongoose = require('mongoose');
const measurementTypes = require('../entities/measurementTypes');
const MeasurementTypeController = require('../controllers/MeasurementTypeController');

class TemperatureController {

    static async getDaillyMeasurementsByDeviceId(deviceId, startDate, endDate) {
        const measurementTypeId = await MeasurementTypeController.getMeasurementTypeIdAsync(measurementTypes.TEMPERATURE);
        return await iotData.aggregate(
            [
                {  $match: { deviceId:  mongoose.Types.ObjectId(deviceId) , timestamp: { $gte: new Date(startDate), $lte: new Date(endDate) }, measurementTypeId: mongoose.Types.ObjectId(measurementTypeId) } },
                {  $group: { 
                    _id : { $dateToString: { format: "%Y-%m-%d", date: "$timestamp", timezone: "America/Sao_Paulo" } },
                    avgValue: {
                        $avg: "$value.temperature"
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
        const measurementTypeId = await MeasurementTypeController.getMeasurementTypeIdAsync(measurementTypes.TEMPERATURE);
        return await iotData.aggregate(
            [
                {  $match: { deviceId:  mongoose.Types.ObjectId(deviceId) , timestamp: { $gte: new Date(startDate), $lte: new Date(endDate) }, measurementTypeId: mongoose.Types.ObjectId(measurementTypeId) } },
                {  $group: { 
                    _id : { $dateToString: { format: "%Y-%m-%dT%H", date: "$timestamp", timezone: "America/Sao_Paulo" } },
                    avgValue: {
                        $avg: "$value.temperature"
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

module.exports = TemperatureController;