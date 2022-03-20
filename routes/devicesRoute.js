const { Router } = require('express');
const DeviceController = require('../controllers/DeviceController');
const InvalidField = require('../errorTreatment/InvalidField');

const router = Router();

router
    .post('/devices', (req, res, next) => { saveNewDeviceAsync(req, res, next) });


async function saveNewDeviceAsync(req, res, next) {
    try {
        const reqBody = req.body;
        validateRequest(reqBody);
        var device = new DeviceController();
        const deviceCreated = await device.createDevice(reqBody.name);
        return res.status(200).json(deviceCreated);
    }
    catch (error) {
        next(error);
    }
}

function validateRequest (reqBody) {
    const fields = {id:  'string', name: 'string'};
    for (const field in reqBody) {
        if (!fields[field] || typeof reqBody[field] !== fields[field]) {
            throw new InvalidField(field);
        }
    }
}

module.exports = router;