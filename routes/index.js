const bodyParser = require('body-parser');
const deviceRoute = require('./devicesRoute');
const gatewayRoute = require('./gatewayRoute');
const vibrationRoute = require('./vibrationsRoute');
const humidityRoute = require('./humidityRoute');
const temperatureRoute = require('./temperatureRoute');
const userRoute = require('./usersRoute');

module.exports = app => {
    app.use(
        bodyParser.json(),
        deviceRoute,
        gatewayRoute,
        vibrationRoute,
        humidityRoute,
        temperatureRoute,
        userRoute
    );
};