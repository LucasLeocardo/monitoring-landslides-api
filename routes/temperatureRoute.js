const { Router } = require('express');
const TemperatureController = require('../controllers/TemperatureController');
const InvalidField = require('../errorTreatment/InvalidField');
const middlewaresAuthetication = require('../shared/middlewares-authentication');

const router = Router();

router
    .post('/temperatures/getMeasurementsByDeviceId', middlewaresAuthetication.bearer, (req, res, next) => { getMesurementsByDeviceIdAsync(req, res, next) });


async function getMesurementsByDeviceIdAsync(req, res, next) {
    try {
        const reqBody = req.body;
        validateRequest(reqBody);
        const measurementData = await TemperatureController.getMesurementsByDeviceIdAsync(reqBody.deviceId, reqBody.startDate);
        return res.status(200).json(measurementData);
    }
    catch (error) {
        next(error);
    }
}

function validateRequest (reqBody) {
    const fields = {deviceId:  'string', startDate: 'string'};
    for (const field in reqBody) {
        if (!fields[field] || typeof reqBody[field] !== fields[field]) {
            throw new InvalidField(field);
        }
    }
}

module.exports = router;