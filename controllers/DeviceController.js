const device = require ('../models/Device');
const temperature = require('../models/Temperature');
const humidity = require('../models/Humidity');
const vibration = require('../models/Vibration');
const mongoose = require('mongoose');

class DeviceController {
   
    static async createDeviceAsync(deviceName, deviceLatitude, deviceLongitude, userId) {
        const returnedObject = await device.create({name: deviceName, latitude: deviceLatitude, longitude: deviceLongitude, creatorUserId: mongoose.Types.ObjectId(userId)});
        return returnedObject;
    }

    static async getAllDevicesAsync (user) {
        if (user.isAdmin) {
            return await device.find({});   
        }
        else {
            return await device.find({creatorUserId: user._id});
        }
    }

    static async deleteDevicesAsync (deviceIds) {
        temperature.deleteMany({deviceId: { $in: deviceIds }});
        humidity.deleteMany({deviceId: { $in: deviceIds }});
        vibration.deleteMany({deviceId: { $in: deviceIds }});
        return await device.deleteMany({_id: { $in: deviceIds } });
    }

    static async updateDeviceAsync (newDevice) {
        return await device.updateOne({_id: newDevice.id}, {name: newDevice.name});
    }

    static async updateDeviceStatusAsync (deviceId, newDeviceStatus) {
        return await device.updateOne({_id: deviceId}, {isActive: newDeviceStatus});
    }

}

module.exports = DeviceController;