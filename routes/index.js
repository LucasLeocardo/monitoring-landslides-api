const bodyParser = require('body-parser');
const deviceRoute = require('./devicesRoute');

module.exports = app => {
    app.use(
        bodyParser.json(),
        deviceRoute
    );
};