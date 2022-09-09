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
        const linearAccelerationMeasurementTypeId = deviceMeasuredDataTypes.find(deviceMeasuredDataType => deviceMeasuredDataType.measurementType === MeasurementTypes.LINEAR_ACCELERATION).measurementTypeId;
        const senderLinearAccelerationDataInterval = setInterval(async () => {
            const lastLinearAccelerationData = await VibrationController.getLastLinearAccelerationByDeviceIdAsync(deviceId, linearAccelerationMeasurementTypeId);
            if (lastLinearAccelerationData) {
                if (lastLinearAccelerationData._id.toString() !== lastLinearAccelerationDataId) {
                    socket.volatile.emit("linear-acceleration-data", lastLinearAccelerationData.value);
                }
                lastLinearAccelerationDataId = lastLinearAccelerationData._id.toString();
            }
            else {
                if (lastLinearAccelerationDataId !== "-1") {
                    const value = {noData: true};
                    socket.volatile.emit("linear-acceleration-data", value);
                    lastLinearAccelerationDataId = "-1";
                }
            }
        }, 3000);
        dataIntervalList.push(senderLinearAccelerationDataInterval);
    }

    if (deviceMeasurementTypes.includes(MeasurementTypes.ANGULAR_VELOCITY)) {
        const angularVelocityMeasurementTypeId = deviceMeasuredDataTypes.find(deviceMeasuredDataType => deviceMeasuredDataType.measurementType === MeasurementTypes.ANGULAR_VELOCITY).measurementTypeId;
        const senderAngularVelocityDataInterval = setInterval(async () => {
            const lastAngularVelocityData = await VibrationController.getLastAngularVelocityByDeviceIdAsync(deviceId, angularVelocityMeasurementTypeId);
            if (lastAngularVelocityData) {
                if (lastAngularVelocityData._id.toString() !== lastAngularVelocityDataId) {
                    socket.volatile.emit("angular-velocity-data", lastAngularVelocityData.value);
                }
                lastAngularVelocityDataId = lastAngularVelocityData._id.toString();
            }
            else {
                if (lastAngularVelocityDataId !== "-1") {
                    const value = {noData: true};
                    socket.volatile.emit("angular-velocity-data", value);
                    lastAngularVelocityDataId = "-1";
                }
            }
        }, 3000);
        dataIntervalList.push(senderAngularVelocityDataInterval);
    }

    if (deviceMeasurementTypes.includes(MeasurementTypes.TEMPERATURE)) {
        const temperatureMeasurementTypeId = deviceMeasuredDataTypes.find(deviceMeasuredDataType => deviceMeasuredDataType.measurementType === MeasurementTypes.TEMPERATURE).measurementTypeId;
        const senderTemperatureDataInterval = setInterval(async () => {
            const lastTemperatureData = await TemperatureController.getLastMesurementByDeviceIdAsync(deviceId, temperatureMeasurementTypeId);
            if (lastTemperatureData) {
                if (lastTemperatureData._id.toString() !== lastTemperatureDataId) {
                    socket.volatile.emit("temperature-data", lastTemperatureData.value);
                }
                lastTemperatureDataId = lastTemperatureData._id.toString();
            }
            else {
                if (lastTemperatureDataId !== "-1") {
                    const value = {noData: true};
                    socket.volatile.emit("temperature-data", value);
                    lastTemperatureDataId = "-1";
                }
            }
        }, 3000);
        dataIntervalList.push(senderTemperatureDataInterval);
    }

    if (deviceMeasurementTypes.includes(MeasurementTypes.HUMIDITY)) {
        const humidityMeasurementTypeId = deviceMeasuredDataTypes.find(deviceMeasuredDataType => deviceMeasuredDataType.measurementType === MeasurementTypes.HUMIDITY).measurementTypeId;
        const senderHumidityDataInterval = setInterval(async () => {
            const lastHumidityData = await HumidityController.getLastMesurementByDeviceIdAsync(deviceId, humidityMeasurementTypeId);
            if (lastHumidityData) {
                if (lastHumidityData._id.toString() !== lastHumidityDataId) {
                    socket.volatile.emit("humidity-data", lastHumidityData.value);
                }
                lastHumidityDataId = lastHumidityData._id.toString();
            }
            else {
                if (lastHumidityDataId !== "-1") {
                    const value = {noData: true};
                    socket.volatile.emit("humidity-data", value);
                    lastHumidityDataId = "-1";
                }
            }
        }, 3000);
        dataIntervalList.push(senderHumidityDataInterval);
    }

    if (deviceMeasurementTypes.includes(MeasurementTypes.RAINFALL_LEVEL)) {
        const rainfallLevelMeasurementTypeId = deviceMeasuredDataTypes.find(deviceMeasuredDataType => deviceMeasuredDataType.measurementType === MeasurementTypes.RAINFALL_LEVEL).measurementTypeId;
        const senderRainFallLevelDataInterval = setInterval(async () => {
            const lastRainFallLevelData = await RainfallLevelController.getLastMesurementByDeviceIdAsync(deviceId, rainfallLevelMeasurementTypeId);
            if (lastRainFallLevelData) {
                if (lastRainFallLevelData._id.toString() !== lastRainfallLevelDataId) {
                    socket.volatile.emit("rainfall-level-data", lastRainFallLevelData.value);
                }
                lastRainfallLevelDataId = lastRainFallLevelData._id.toString();
            }
            else {
                if (lastRainfallLevelDataId !== "-1") {
                    const value = {noData: true};
                    socket.volatile.emit("rainfall-level-data", value);
                    lastRainfallLevelDataId = "-1";
                }
            }
        }, 3000);
        dataIntervalList.push(senderRainFallLevelDataInterval);
    }

    if (deviceMeasurementTypes.includes(MeasurementTypes.PRESSURE)) {
        const pressureMeasurementTypeId = deviceMeasuredDataTypes.find(deviceMeasuredDataType => deviceMeasuredDataType.measurementType === MeasurementTypes.PRESSURE).measurementTypeId;
        const senderPressureDataInterval = setInterval(async () => {
            const lastPressureData = await PressureController.getLastMesurementByDeviceIdAsync(deviceId, pressureMeasurementTypeId);
            if (lastPressureData) {
                if (lastPressureData._id.toString() !== lastPressureDataId) {
                    socket.volatile.emit("pressure-data", lastPressureData.value);
                }
                lastPressureDataId = lastPressureData._id.toString();
            }
            else {
                if (lastPressureDataId !== "-1") {
                    const value = {noData: true};
                    socket.volatile.emit("pressure-data", value);
                    lastPressureDataId = "-1";
                }
            }
        }, 3000);
        dataIntervalList.push(senderPressureDataInterval);
    }

    socket.on("disconnect", () => {
        console.log(socket.id + " disconnecting....");
        dataIntervalList.forEach(dataInterval => {
            clearInterval(dataInterval);
        });
    });
}