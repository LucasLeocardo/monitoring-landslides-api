const VibrationController = require('../controllers/VibrationController');
const TemperatureController = require('../controllers/TemperatureController');
const HumidityController = require('../controllers/HumidityController');
const DeviceController = require('../controllers/DeviceController');
const RainfallLevelController = require('../controllers/RainfallLevelController');
const PressureController = require('../controllers/PressureController');
const MeasurementTypes = require('../entities//measurementTypes');


const sendWebSocketData = (lastData, lastDataId, dataTopic, socket) => {
    if (lastData) {
        if (lastData._id.toString() !== lastDataId) {
            socket.volatile.emit(dataTopic, lastData.value);
        }
        lastDataId = lastData._id.toString();
    }
    else {
        if (lastDataId !== "-1") {
            const value = {noData: true};
            socket.volatile.emit(dataTopic, value);
            lastDataId = "-1";
        }
    }
}



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
        setTimeout(async () => {
            const lastLinearAccelerationData = await VibrationController.getLastLinearAccelerationByDeviceIdAsync(deviceId, linearAccelerationMeasurementTypeId);
            sendWebSocketData(lastLinearAccelerationData, lastLinearAccelerationDataId, "linear-acceleration-data", socket);
            const senderLinearAccelerationDataInterval = setInterval(async () => {
                const lastLinearAccelerationData = await VibrationController.getLastLinearAccelerationByDeviceIdAsync(deviceId, linearAccelerationMeasurementTypeId);
                sendWebSocketData(lastLinearAccelerationData, lastLinearAccelerationDataId, "linear-acceleration-data", socket);
            }, 60000);
            dataIntervalList.push(senderLinearAccelerationDataInterval);
          }, 3000);
    }

    if (deviceMeasurementTypes.includes(MeasurementTypes.ANGULAR_VELOCITY)) {
        const angularVelocityMeasurementTypeId = deviceMeasuredDataTypes.find(deviceMeasuredDataType => deviceMeasuredDataType.measurementType === MeasurementTypes.ANGULAR_VELOCITY).measurementTypeId;
        setTimeout(async () => {
            const lastAngularVelocityData = await VibrationController.getLastAngularVelocityByDeviceIdAsync(deviceId, angularVelocityMeasurementTypeId);
            sendWebSocketData(lastAngularVelocityData, lastAngularVelocityDataId, "angular-velocity-data", socket);
            const senderAngularVelocityDataInterval = setInterval(async () => {
                const lastAngularVelocityData = await VibrationController.getLastAngularVelocityByDeviceIdAsync(deviceId, angularVelocityMeasurementTypeId);
                sendWebSocketData(lastAngularVelocityData, lastAngularVelocityDataId, "angular-velocity-data", socket);
            }, 60000);
            dataIntervalList.push(senderAngularVelocityDataInterval);
        }, 3000);
    }

    if (deviceMeasurementTypes.includes(MeasurementTypes.TEMPERATURE)) {
        const temperatureMeasurementTypeId = deviceMeasuredDataTypes.find(deviceMeasuredDataType => deviceMeasuredDataType.measurementType === MeasurementTypes.TEMPERATURE).measurementTypeId;
        setTimeout(async () => {
            const lastTemperatureData = await TemperatureController.getLastMesurementByDeviceIdAsync(deviceId, temperatureMeasurementTypeId);
            sendWebSocketData(lastTemperatureData, lastTemperatureDataId, "temperature-data", socket);
            const senderTemperatureDataInterval = setInterval(async () => {
                const lastTemperatureData = await TemperatureController.getLastMesurementByDeviceIdAsync(deviceId, temperatureMeasurementTypeId);
                sendWebSocketData(lastTemperatureData, lastTemperatureDataId, "temperature-data", socket);
            }, 60000);
            dataIntervalList.push(senderTemperatureDataInterval);
        }, 3000);
    }

    if (deviceMeasurementTypes.includes(MeasurementTypes.HUMIDITY)) {
        const humidityMeasurementTypeId = deviceMeasuredDataTypes.find(deviceMeasuredDataType => deviceMeasuredDataType.measurementType === MeasurementTypes.HUMIDITY).measurementTypeId;
        setTimeout(async () => {
            const lastHumidityData = await HumidityController.getLastMesurementByDeviceIdAsync(deviceId, humidityMeasurementTypeId);
            sendWebSocketData(lastHumidityData, lastHumidityDataId, "humidity-data", socket);
            const senderHumidityDataInterval = setInterval(async () => {
                const lastHumidityData = await HumidityController.getLastMesurementByDeviceIdAsync(deviceId, humidityMeasurementTypeId);
                sendWebSocketData(lastHumidityData, lastHumidityDataId, "humidity-data", socket);
            }, 60000);
            dataIntervalList.push(senderHumidityDataInterval);
        }, 3000);
    }

    if (deviceMeasurementTypes.includes(MeasurementTypes.RAINFALL_LEVEL)) {
        const rainfallLevelMeasurementTypeId = deviceMeasuredDataTypes.find(deviceMeasuredDataType => deviceMeasuredDataType.measurementType === MeasurementTypes.RAINFALL_LEVEL).measurementTypeId;
        setTimeout(async () => {
            const lastRainFallLevelData = await RainfallLevelController.getLastMesurementByDeviceIdAsync(deviceId, rainfallLevelMeasurementTypeId);
            sendWebSocketData(lastRainFallLevelData, lastRainfallLevelDataId, "rainfall-level-data", socket);
            const senderRainFallLevelDataInterval = setInterval(async () => {
                const lastRainFallLevelData = await RainfallLevelController.getLastMesurementByDeviceIdAsync(deviceId, rainfallLevelMeasurementTypeId);
                sendWebSocketData(lastRainFallLevelData, lastRainfallLevelDataId, "rainfall-level-data", socket);
            }, 60000);
            dataIntervalList.push(senderRainFallLevelDataInterval);
        }, 3000);
    }

    if (deviceMeasurementTypes.includes(MeasurementTypes.PRESSURE)) {
        const pressureMeasurementTypeId = deviceMeasuredDataTypes.find(deviceMeasuredDataType => deviceMeasuredDataType.measurementType === MeasurementTypes.PRESSURE).measurementTypeId;
        setTimeout(async () => {
            const lastPressureData = await PressureController.getLastMesurementByDeviceIdAsync(deviceId, pressureMeasurementTypeId);
            sendWebSocketData(lastPressureData, lastPressureDataId, "pressure-data", socket);
            const senderPressureDataInterval = setInterval(async () => {
                const lastPressureData = await PressureController.getLastMesurementByDeviceIdAsync(deviceId, pressureMeasurementTypeId);
                sendWebSocketData(lastPressureData, lastPressureDataId, "pressure-data", socket);
            }, 60000);
            dataIntervalList.push(senderPressureDataInterval);
        }, 3000);
    }

    socket.on("disconnect", () => {
        console.log(socket.id + " disconnecting....");
        dataIntervalList.forEach(dataInterval => {
            clearInterval(dataInterval);
        });
    });
}