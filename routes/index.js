const bodyParser = require('body-parser');
const deviceRoute = require('./devicesRoute');
const vibrationRoute = require('./vibrationsRoute');
const humidityRoute = require('./humidityRoute');
const temperatureRoute = require('./temperatureRoute');
const userRoute = require('./usersRoute');
const measurementTypeRoute = require('./measurementTypeRoute');

module.exports = app => {
    app.use(
        bodyParser.json(),
        deviceRoute,
        vibrationRoute,
        humidityRoute,
        temperatureRoute,
        userRoute,
        measurementTypeRoute
    );
};