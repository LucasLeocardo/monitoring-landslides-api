const VibrationController = require('../controllers/VibrationController');
const TemperatureController = require('../controllers/TemperatureController');
const HumidityController = require('../controllers/HumidityController');
const DeviceController = require('../controllers/DeviceController');
const RainfallLevelController = require('../controllers/RainfallLevelController');
const PoroPressureController = require('../controllers/PoroPressureController');
const MeasurementTypes = require('../entities//measurementTypes');

module.exports = async (io, socket) => {

    console.log("New socket connected = " + socket.id); // ojIckSD2jqNzOqIrAGzL

    const deviceId = socket.handshake.query.deviceId;
    const deviceMeasuredDataTypes = await DeviceController.getDeviceMeasurementDataTypesAsync(deviceId);
    const deviceMeasurementTypes = deviceMeasuredDataTypes.map(deviceMeasuredDataType => deviceMeasuredDataType.measurementType);
    const dataIntervalList = [];
    let lastLinearAccelerationDataId = '';
    let lastAngularAccelerationDataId = '';
    let lastTemperatureDataId = '';
    let lastHumidityDataId = '';
    let lastPoroPressureDataId = '';
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

    if (deviceMeasurementTypes.includes(MeasurementTypes.ANGULAR_ACCELERATION)) {
        const measurementTypeId = deviceMeasuredDataTypes.find(deviceMeasuredDataType => deviceMeasuredDataType.measurementType === MeasurementTypes.ANGULAR_ACCELERATION).measurementTypeId;
        const senderAngularAccelerationDataInterval = setInterval(async () => {
            const lastAngularAccelerationData = await VibrationController.getLastAngularAccelerationByDeviceIdAsync(deviceId, measurementTypeId);
            if (lastAngularAccelerationData) {
                if (lastAngularAccelerationData._id.toString() !== lastAngularAccelerationDataId) {
                    socket.volatile.emit("angular-acceleration-data", lastAngularAccelerationData.value);
                }
                lastAngularAccelerationDataId = lastAngularAccelerationData._id.toString();
            }
        }, 1000);
        dataIntervalList.push(senderAngularAccelerationDataInterval);
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


    // const senderTemperatureDataInterval =setInterval(async () => {
    //     const lastTemperatureData = await TemperatureController.getLastMesurementByDeviceIdAsync(deviceId);
    //     if (lastTemperatureData) {
    //         if (lastTemperatureData._id.toString() !== lastTemperatureDataId) {
    //             data = calculateAverage([lastTemperatureData.t0, lastTemperatureData.t1, lastTemperatureData.t2, lastTemperatureData.t3, lastTemperatureData.t4, lastTemperatureData.t5, 
    //                 lastTemperatureData.t6, lastTemperatureData.t7, lastTemperatureData.t8 , lastTemperatureData.t9]);
    //             socket.volatile.emit("temperature-data", { temperature: data });
    //         }
    //         lastTemperatureDataId = lastTemperatureData._id.toString();
    //     }
    // }, 1000);

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

    // const senderHumidityDataInterval =setInterval(async () => {
    //     const lastHumidityData = await HumidityController.getLastMesurementByDeviceIdAsync(deviceId);
    //     if (lastHumidityData) {
    //         if (lastHumidityData._id.toString() !== lastHumidityDataId) {
    //             data = calculateAverage([lastHumidityData.h0, lastHumidityData.h1, lastHumidityData.h2, lastHumidityData.h3, lastHumidityData.h4, lastHumidityData.h5, 
    //                 lastHumidityData.h6, lastHumidityData.h7, lastHumidityData.h8 , lastHumidityData.h9]);
    //             socket.volatile.emit("humidity-data", { humidity: data });
    //         }
    //         lastHumidityDataId = lastHumidityData._id.toString();
    //     }
    // }, 1000);

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

    if (deviceMeasurementTypes.includes(MeasurementTypes.PORO_PRESSURE)) {
        const measurementTypeId = deviceMeasuredDataTypes.find(deviceMeasuredDataType => deviceMeasuredDataType.measurementType === MeasurementTypes.PORO_PRESSURE).measurementTypeId;
        const senderPoroPressureDataInterval = setInterval(async () => {
            const lastPoroPressureData = await PoroPressureController.getLastMesurementByDeviceIdAsync(deviceId, measurementTypeId);
            if (lastPoroPressureData) {
                if (lastPoroPressureData._id.toString() !== lastPoroPressureDataId) {
                    socket.volatile.emit("poro-pressure-data", lastPoroPressureData.value);
                }
                lastPoroPressureDataId = lastPoroPressureData._id.toString();
            }
        }, 1000);
        dataIntervalList.push(senderPoroPressureDataInterval);
    }

    socket.on("disconnect", () => {
        console.log(socket.id + " disconnecting....");
        dataIntervalList.forEach(dataInterval => {
            clearInterval(dataInterval);
        });
    });
}

// const calculateAverage = (numberArray) => {
//     let arraySum = 0;
//     numberArray.forEach(item => {
//         arraySum = arraySum + item;
//     });
//     return (arraySum / 10);
// }