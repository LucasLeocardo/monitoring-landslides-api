const VibrationController = require('../controllers/VibrationController');
const TemperatureController = require('../controllers/TemperatureController');
const HumidityController = require('../controllers/HumidityController');

module.exports = (io, socket) => {

    console.log("New socket connected = " + socket.id); // ojIckSD2jqNzOqIrAGzL

    const deviceId = socket.handshake.query.deviceId;
    let lastVibrationDataId = '';
    let lastTemperatureDataId = '';
    let lastHumidityDataId = '';


    const senderVibrationDataInterval = setInterval(async () => {
        const lastVibrationData = await VibrationController.getLastMesurementByDeviceIdAsync(deviceId);
        if (lastVibrationData) {
            if (lastVibrationData._id.toString() !== lastVibrationDataId) {
                socket.volatile.emit("vibration-data", lastVibrationData);
            }
            lastVibrationDataId = lastVibrationData._id.toString();
        }
    }, 1000);

    const senderTemperatureDataInterval =setInterval(async () => {
        const lastTemperatureData = await TemperatureController.getLastMesurementByDeviceIdAsync(deviceId);
        if (lastTemperatureData) {
            if (lastTemperatureData._id.toString() !== lastTemperatureDataId) {
                data = calculateAverage([lastTemperatureData.t0, lastTemperatureData.t1, lastTemperatureData.t2, lastTemperatureData.t3, lastTemperatureData.t4, lastTemperatureData.t5, 
                    lastTemperatureData.t6, lastTemperatureData.t7, lastTemperatureData.t8 , lastTemperatureData.t9]);
                socket.volatile.emit("temperature-data", { temperature: data });
            }
            lastTemperatureDataId = lastTemperatureData._id.toString();
        }
    }, 1000);

    const senderHumidityDataInterval =setInterval(async () => {
        const lastHumidityData = await HumidityController.getLastMesurementByDeviceIdAsync(deviceId);
        if (lastHumidityData) {
            if (lastHumidityData._id.toString() !== lastHumidityDataId) {
                data = calculateAverage([lastHumidityData.h0, lastHumidityData.h1, lastHumidityData.h2, lastHumidityData.h3, lastHumidityData.h4, lastHumidityData.h5, 
                    lastHumidityData.h6, lastHumidityData.h7, lastHumidityData.h8 , lastHumidityData.h9]);
                socket.volatile.emit("humidity-data", { humidity: data });
            }
            lastHumidityDataId = lastHumidityData._id.toString();
        }
    }, 1000);

    socket.on("disconnect", () => {
        console.log(socket.id + " disconnecting....");
        clearInterval(senderVibrationDataInterval);
        clearInterval(senderTemperatureDataInterval);
        clearInterval(senderHumidityDataInterval);
    });
}

const calculateAverage = (numberArray) => {
    let arraySum = 0;
    numberArray.forEach(item => {
        arraySum = arraySum + item;
    });
    return (arraySum / 10);
}