const VibrationController = require('../controllers/VibrationController');
const TemperatureController = require('../controllers/TemperatureController');
const HumidityController = require('../controllers/HumidityController');
const DeviceController = require('../controllers/DeviceController');
const RainfallLevelController = require('../controllers/RainfallLevelController');
const PressureController = require('../controllers/PressureController');
const MeasurementTypes = require('../entities//measurementTypes');

module.exports = async (io, socket) => {

    console.log("New socket connected = " + socket.id); // ojIckSD2jqNzOqIrAGzL

    const deviceId = socket.handshake.query.deviceId;
    const deviceMeasuredDataTypes = await DeviceController.getDeviceMeasurementDataTypesAsync(deviceId);
    const deviceMeasurementTypes = deviceMeasuredDataTypes.map(deviceMeasuredDataType => deviceMeasuredDataType.measurementType);
    const dataIntervalList = [];
    let lastLinearAccelerationDataId = '';
    let lastAngularVelocityDataId = '';
    let lastTemperatureDataId = '';
    let lastHumidityDataId = '';
    let lastPressureDataId = '';
    let lastRainfallLevelDataId = '';

    if (deviceMeasurementTypes.includes(MeasurementTypes.LINEAR_ACCELERATION)) {
        const measurementTypeId = deviceMeasuredDataTypes.find(deviceMeasuredDataType => deviceMeasuredDataType.measurementType === MeasurementTypes.LINEAR_ACCELERATION).measurementTypeId;
        const senderLinearAccelerationDataInterval = setInterval(async () => {
            const lastLinearAccelerationData = await VibrationController.getLastLinearAccelerationByDeviceIdAsync(deviceId, measurementTypeId);
            if (lastLinearAccelerationData) {
                if (lastLinearAccelerationData._id.toString() !== lastLinearAccelerationDataId) {
                    socket.volatile.emit("linear-acceleration-data", lastLinearAccelerationData.value);
                }
                lastLinearAccelerationDataId = lastLinearAccelerationData._id.toString();
            }
        }, 1000);
        dataIntervalList.push(senderLinearAccelerationDataInterval);
    }

    if (deviceMeasurementTypes.includes(MeasurementTypes.ANGULAR_VELOCITY)) {
        const measurementTypeId = deviceMeasuredDataTypes.find(deviceMeasuredDataType => deviceMeasuredDataType.measurementType === MeasurementTypes.ANGULAR_VELOCITY).measurementTypeId;
        const senderAngularVelocityDataInterval = setInterval(async () => {
            const lastAngularVelocityData = await VibrationController.getLastAngularVelocityByDeviceIdAsync(deviceId, measurementTypeId);
            if (lastAngularVelocityData) {
                if (lastAngularVelocityData._id.toString() !== lastAngularVelocityDataId) {
                    socket.volatile.emit("angular-velocity-data", lastAngularVelocityData.value);
                }
                lastAngularVelocityDataId = lastAngularAccelerationData._id.toString();
            }
        }, 1000);
        dataIntervalList.push(senderAngularVelocityDataInterval);
    }

    if (deviceMeasurementTypes.includes(MeasurementTypes.TEMPERATURE)) {
        const measurementTypeId = deviceMeasuredDataTypes.find(deviceMeasuredDataType => deviceMeasuredDataType.measurementType === MeasurementTypes.TEMPERATURE).measurementTypeId;
        const senderTemperatureDataInterval = setInterval(async () => {
            const lastTemperatureData = await TemperatureController.getLastMesurementByDeviceIdAsync(deviceId, measurementTypeId);
            if (lastTemperatureData) {
                if (lastTemperatureData._id.toString() !== lastTemperatureDataId) {
                    socket.volatile.emit("temperature-data", lastTemperatureData.value);
                }
                lastTemperatureDataId = lastTemperatureData._id.toString();
            }
        }, 1000);
        dataIntervalList.push(senderTemperatureDataInterval);
    }

    if (deviceMeasurementTypes.includes(MeasurementTypes.HUMIDITY)) {
        const measurementTypeId = deviceMeasuredDataTypes.find(deviceMeasuredDataType => deviceMeasuredDataType.measurementType === MeasurementTypes.HUMIDITY).measurementTypeId;
        const senderHumidityDataInterval = setInterval(async () => {
            const lastHumidityData = await HumidityController.getLastMesurementByDeviceIdAsync(deviceId, measurementTypeId);
            if (lastHumidityData) {
                if (lastHumidityData._id.toString() !== lastHumidityDataId) {
                    socket.volatile.emit("humidity-data", lastHumidityData.value);
                }
                lastHumidityDataId = lastHumidityData._id.toString();
            }
        }, 1000);
        dataIntervalList.push(senderHumidityDataInterval);
    }

    if (deviceMeasurementTypes.includes(MeasurementTypes.RAINFALL_LEVEL)) {
        const measurementTypeId = deviceMeasuredDataTypes.find(deviceMeasuredDataType => deviceMeasuredDataType.measurementType === MeasurementTypes.RAINFALL_LEVEL).measurementTypeId;
        const senderRainFallLevelDataInterval = setInterval(async () => {
            const lastRainFallLevelData = await RainfallLevelController.getLastMesurementByDeviceIdAsync(deviceId, measurementTypeId);
            if (lastRainFallLevelData) {
                if (lastRainFallLevelData._id.toString() !== lastRainfallLevelDataId) {
                    socket.volatile.emit("rainfall-level-data", lastRainFallLevelData.value);
                }
                lastRainfallLevelDataId = lastRainFallLevelData._id.toString();
            }
        }, 1000);
        dataIntervalList.push(senderRainFallLevelDataInterval);
    }

    if (deviceMeasurementTypes.includes(MeasurementTypes.PRESSURE)) {
        const measurementTypeId = deviceMeasuredDataTypes.find(deviceMeasuredDataType => deviceMeasuredDataType.measurementType === MeasurementTypes.PRESSURE).measurementTypeId;
        const senderPressureDataInterval = setInterval(async () => {
            const lastPressureData = await PressureController.getLastMesurementByDeviceIdAsync(deviceId, measurementTypeId);
            if (lastPressureData) {
                if (lastPressureData._id.toString() !== lastPressureDataId) {
                    socket.volatile.emit("pressure-data", lastPressureData.value);
                }
                lastPressureDataId = lastPressureData._id.toString();
            }
        }, 1000);
        dataIntervalList.push(senderPressureDataInterval);
    }

    socket.on("disconnect", () => {
        console.log(socket.id + " disconnecting....");
        dataIntervalList.forEach(dataInterval => {
            clearInterval(dataInterval);
        });
    });
}