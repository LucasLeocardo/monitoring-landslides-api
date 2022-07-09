const bodyParser = require('body-parser');
const deviceRoute = require('./devicesRoute');
const vibrationRoute = require('./vibrationsRoute');
const humidityRoute = require('./humidityRoute');
const temperatureRoute = require('./temperatureRoute');
const userRoute = require('./usersRoute');
const measurementTypeRoute = require('./measurementTypeRoute');
const rainfallLevelRoute = require('./rainfallLevelRoute');
const poroPressureRoute = require('./poroPressureRoute');

module.exports = app => {
    app.use(
        bodyParser.json(),
        deviceRoute,
        vibrationRoute,
        humidityRoute,
        temperatureRoute,
        userRoute,
        measurementTypeRoute,
        rainfallLevelRoute,
        poroPressureRoute
    );
};