const bodyParser = require('body-parser');
const deviceRoute = require('./devicesRoute');
const vibrationRoute = require('./vibrationsRoute');

module.exports = app => {
    app.use(
        bodyParser.json(),
        deviceRoute,
        vibrationRoute
    );
};