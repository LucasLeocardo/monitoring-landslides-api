const device = require ('../models/Device');
const iotData = require('../models/IotData');
const mongoose = require('mongoose');

class DeviceController {
   
    static async createDeviceAsync(deviceName, deviceLatitude, deviceLongitude, userId, deviceMeasuredDataTypes) {
        const measuredDataTypes = deviceMeasuredDataTypes.map(deviceMeasuredDataType => {
            return {
                measurementTypeId: mongoose.Types.ObjectId(deviceMeasuredDataType._id),
                measurementType: deviceMeasuredDataType.measurementType,
                measuredData: deviceMeasuredDataType.measuredData,
                unit: deviceMeasuredDataType.unit,
                calibrationCurve: deviceMeasuredDataType.calibrationCurve
            };
        });
        const returnedObject = await device.create({name: deviceName, latitude: deviceLatitude, longitude: deviceLongitude, 
            creatorUserId: mongoose.Types.ObjectId(userId), measuredDataTypes});
        return returnedObject;
    }

    static async getDeviceByIdAsync (id) {
        return await device.findOne({_id: id}, {creatorUserId: false, created_at: false, _id: false, isActive: false, __v: false});
    }

    static async getDeviceMeasuredDataTypesByIdAsync (id) {
        return await device.findOne({_id: id}, {
            creatorUserId: false, 
            created_at: false, 
            _id: false, 
            isActive: false, 
            __v: false,
            latitude: false,
            longitude: false
        });
    }

    static async getAllDevicesAsync (user) {
        if (user.isAdmin) {
            return await device.find({});   
        }
        else {
            return await device.find({creatorUserId: user._id});
        }
    }

    static async getActiveDevicesAsync (user) {
        if (user.isAdmin) {
            return await device.find({isActive: true});   
        }
        else {
            return await device.find({creatorUserId: user._id, isActive: true});
        }
    }

    static async deleteDevicesAsync (deviceIds) {
        await iotData.deleteMany({deviceId: { $in: deviceIds }});
        return await device.deleteMany({_id: { $in: deviceIds } });
    }

    static async updateDeviceAsync (deviceId, deviceName, deviceLatitude, deviceLongitude, deviceMeasuredDataTypes) {
        const measuredDataTypes = deviceMeasuredDataTypes.map(deviceMeasuredDataType => {
            return {
                measurementTypeId: mongoose.Types.ObjectId(deviceMeasuredDataType._id),
                measurementType: deviceMeasuredDataType.name,
                unit: deviceMeasuredDataType.unit,
                gain: deviceMeasuredDataType.gain ? Number(deviceMeasuredDataType.gain) : 1,
                offSet: deviceMeasuredDataType.offSet ? Number(deviceMeasuredDataType.offSet) : 0
            };
        });
        return await device.updateOne({_id: deviceId}, {name: deviceName, latitude: deviceLatitude, longitude: deviceLongitude, measuredDataTypes});
    }

    static async updateDeviceCalibrationCurvesAsync(deviceId, measuredDataTypes) {
        return await device.updateOne({_id: deviceId}, {measuredDataTypes: measuredDataTypes});
    }

    static async updateDeviceStatusAsync (deviceId, newDeviceStatus) {
        return await device.updateOne({_id: deviceId}, {isActive: newDeviceStatus});
    }

    static async getDeviceMeasurementTypesAsync (id) {
        const { measuredDataTypes } = await device.findOne({_id: id}, {creatorUserId: false, created_at: false, _id: false, isActive: false, __v: false, name: false, latitude: false, longitude: false});
        return measuredDataTypes.map(deviceMeasuredDataType => deviceMeasuredDataType.measurementType);
    }

    static async getDeviceMeasurementDataTypesAsync (id) {
        const { measuredDataTypes } = await device.findOne({_id: id}, {creatorUserId: false, created_at: false, _id: false, isActive: false, __v: false, name: false, latitude: false, longitude: false});
        return measuredDataTypes;
    }


}

module.exports = DeviceController;