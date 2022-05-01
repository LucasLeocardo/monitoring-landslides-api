const device = require ('../models/Device');

class DeviceController {
   
    static async createDeviceAsync(deviceName, deviceLatitude, deviceLongitude) {
        const returnedObject = await device.create({name: deviceName, latitude: deviceLatitude, longitude: deviceLongitude});
        console.log('New device created: ' + deviceName);
        return returnedObject;
    }

    static async getAllDevicesAsync () {
        return await device.find({});
    }

    static async deleteDeviceAsync (id) {
        return await device.deleteOne({_id: id});
    }

    static async updateDeviceAsync (newDevice) {
        return await device.updateOne({_id: newDevice.id}, {name: newDevice.name});
    }

}

module.exports = DeviceController;