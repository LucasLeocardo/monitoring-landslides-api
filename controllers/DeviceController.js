const device = require ('../models/Device');

class DeviceController {
   
    async createDevice(deviceName) {
        const returnedObject = await device.create({name: deviceName});
        console.log('New device created: ' + deviceName);
        return returnedObject;
    }

}

module.exports = DeviceController;