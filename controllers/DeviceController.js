const device = require ('../models/Device');
const temperature = require('../models/Temperature');
const humidity = require('../models/Humidity');
const rainfallLevel = require('../models/RainfallLevel');
const porePressure = require('../models/PorePressure');
const angularAcceleration = require('../models/AngularAcceleration');
const linearAcceleration = require('../models/LinearAcceleration');
const mongoose = require('mongoose');

class DeviceController {
   
    static async createDeviceAsync(deviceName, deviceLatitude, deviceLongitude, userId, deviceMeasuredDataTypes) {
        const measuredDataTypes = deviceMeasuredDataTypes.map(deviceMeasuredDataType => {
            return {
                measurementTypeId: mongoose.Types.ObjectId(deviceMeasuredDataType._id),
                measurementType: deviceMeasuredDataType.name,
                unit: deviceMeasuredDataType.unit
            };
        });
        const returnedObject = await device.create({name: deviceName, latitude: deviceLatitude, longitude: deviceLongitude, 
            creatorUserId: mongoose.Types.ObjectId(userId), measuredDataTypes});
        return returnedObject;
    }

    static async getDeviceByIdAsync (id) {
        return await device.findOne({_id: id}, {creatorUserId: false, created_at: false, _id: false, isActive: false, __v: false});
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
        await temperature.deleteMany({deviceId: { $in: deviceIds }});
        await humidity.deleteMany({deviceId: { $in: deviceIds }});
        await rainfallLevel.deleteMany({deviceId: { $in: deviceIds }});
        await porePressure.deleteMany({deviceId: { $in: deviceIds }});
        await linearAcceleration.deleteMany({deviceId: { $in: deviceIds }});
        await angularAcceleration.deleteMany({deviceId: { $in: deviceIds }});
        return await device.deleteMany({_id: { $in: deviceIds } });
    }

    static async updateDeviceAsync (deviceId, deviceName, deviceLatitude, deviceLongitude, deviceMeasuredDataTypes) {
        const measuredDataTypes = deviceMeasuredDataTypes.map(deviceMeasuredDataType => {
            return {
                measurementTypeId: mongoose.Types.ObjectId(deviceMeasuredDataType._id),
                measurementType: deviceMeasuredDataType.name,
                unit: deviceMeasuredDataType.unit
            };
        });
        return await device.updateOne({_id: deviceId}, {name: deviceName, latitude: deviceLatitude, longitude: deviceLongitude, measuredDataTypes});
    }

    static async updateDeviceStatusAsync (deviceId, newDeviceStatus) {
        return await device.updateOne({_id: deviceId}, {isActive: newDeviceStatus});
    }

}

module.exports = DeviceController;