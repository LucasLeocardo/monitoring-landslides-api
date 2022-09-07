const iotData = require('../models/IotData');
const mongoose = require('mongoose');
const measurementTypes = require('../entities/measurementTypes');
const MeasurementTypeController = require('../controllers/MeasurementTypeController');

class VibrationController {
    static async getDaillyLinearAccelerationByDeviceId(deviceId, startDate, endDate) {
        const measurementTypeId = await MeasurementTypeController.getMeasurementTypeIdAsync(measurementTypes.LINEAR_ACCELERATION);
        return await iotData.aggregate(
            [
                {  $match: { deviceId:  mongoose.Types.ObjectId(deviceId) , timestamp: { $gte: new Date(startDate), $lte: new Date(endDate)}, measurementTypeId: mongoose.Types.ObjectId(measurementTypeId) } },
                {  $group: { 
                    _id : { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    avgAcelX: {
                        $avg: "$value.acelX"
                    },
                    avgAcelY: {
                        $avg: "$value.acelY"
                    },
                    avgAcelZ: {
                        $avg: "$value.acelZ"
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

    static async getDaillyAngularVelocityByDeviceId(deviceId, startDate, endDate) {
        const measurementTypeId = await MeasurementTypeController.getMeasurementTypeIdAsync(measurementTypes.ANGULAR_VELOCITY);
        return await iotData.aggregate(
            [
                {  $match: { deviceId:  mongoose.Types.ObjectId(deviceId) , timestamp: { $gte: new Date(startDate), $lte: new Date(endDate) }, measurementTypeId: mongoose.Types.ObjectId(measurementTypeId) } },
                {  $group: { 
                    _id : { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    avgWx: {
                        $avg: "$value.wX"
                    },
                    avgWy: {
                        $avg: "$value.wY"
                    },
                    avgWz: {
                        $avg: "$value.wZ"
                    }
                }},
                {   $project: {
                    _id: 1, x: {$round: ['$avgWx', 2]}, y: {$round: ['$avgWy', 2]}, z: {$round: ['$avgWz', 2]}
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
        const measurementTypeId = await MeasurementTypeController.getMeasurementTypeIdAsync(measurementTypes.LINEAR_ACCELERATION);
        return await iotData.aggregate(
            [
                {  $match: { deviceId:  mongoose.Types.ObjectId(deviceId) , timestamp: { $gte: new Date(startDate), $lte: new Date(endDate) }, measurementTypeId: mongoose.Types.ObjectId(measurementTypeId) } },
                {  $group: { 
                    _id : { $dateToString: { format: "%Y-%m-%dT%H", date: "$timestamp" } },
                    avgAcelX: {
                        $avg: "$value.acelX"
                    },
                    avgAcelY: {
                        $avg: "$value.acelY"
                    },
                    avgAcelZ: {
                        $avg: "$value.acelZ"
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

    static async getHourlyAngularVelocityByDeviceId(deviceId, startDate, endDate) {
        const measurementTypeId = await MeasurementTypeController.getMeasurementTypeIdAsync(measurementTypes.ANGULAR_VELOCITY);
        return await iotData.aggregate(
            [
                {  $match: { deviceId:  mongoose.Types.ObjectId(deviceId) , timestamp: { $gte: new Date(startDate), $lte: new Date(endDate) }, measurementTypeId: mongoose.Types.ObjectId(measurementTypeId) } },
                {  $group: { 
                    _id : { $dateToString: { format: "%Y-%m-%dT%H", date: "$timestamp" } },
                    avgWx: {
                        $avg: "$value.wX"
                    },
                    avgWy: {
                        $avg: "$value.wY"
                    },
                    avgWz: {
                        $avg: "$value.wZ"
                    }
                }},
                {   $project: {
                    _id: 1, x: {$round: ['$avgWx', 2]}, y: {$round: ['$avgWy', 2]}, z: {$round: ['$avgWz', 2]}
                }},
                {  $sort: { _id: 1 } }
            ],
            function(err,results) {
                if (err) throw err;
                return results;
            }
        );
    }

    static async getLastLinearAccelerationByDeviceIdAsync(deviceId, measurementTypeId) {
        return  await iotData.findOne({deviceId: deviceId, measurementTypeId: measurementTypeId}).sort({timestamp: 'desc'}).limit(1).select({
            "_id": 1,
            "value": 1
        }).exec();
    }

    static async getLastAngularVelocityByDeviceIdAsync(deviceId, measurementTypeId) {
        return await iotData.findOne({deviceId: deviceId, measurementTypeId: measurementTypeId}).sort({timestamp: 'desc'}).limit(1).select({
            "_id": 1,
            "value": 1
        }).exec();
    }
}

module.exports = VibrationController;