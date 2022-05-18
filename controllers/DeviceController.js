const device = require ('../models/Device');
const temperature = require('../models/Temperature');
const humidity = require('../models/Humidity');
const vibration = require('../models/Vibration');

class DeviceController {
   
    static async createDeviceAsync(deviceName, deviceLatitude, deviceLongitude) {
        const returnedObject = await device.create({name: deviceName, latitude: deviceLatitude, longitude: deviceLongitude});
        return returnedObject;
    }

    static async getAllDevicesAsync () {
        return await device.find({});
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