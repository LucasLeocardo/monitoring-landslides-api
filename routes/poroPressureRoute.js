const { Router } = require('express');
const PoroPressureController = require('../controllers/PoroPressureController');
const InvalidField = require('../errorTreatment/InvalidField');
const middlewaresAuthetication = require('../shared/middlewares-authentication');

const router = Router();

router
    .post('/poroPressure/getDaillyMeasurementsByDeviceId', middlewaresAuthetication.bearer, (req, res, next) => { getDaillyMeasurementsByDeviceId(req, res, next) })
    .post('/poroPressure/getHourlyMeasurementsByDeviceId', middlewaresAuthetication.bearer, (req, res, next) => { getHourlyMeasurementsByDeviceId(req, res, next) });


async function getDaillyMeasurementsByDeviceId(req, res, next) {
    try {
        const reqBody = req.body;
        validateRequest(reqBody);
        const measurementData = await PoroPressureController.getDaillyMeasurementsByDeviceId(reqBody.deviceId, reqBody.startDate, reqBody.endDate);
        return res.status(200).json(measurementData);
    }
    catch (error) {
        next(error);
    }
}

async function getHourlyMeasurementsByDeviceId(req, res, next) {
    try {
        const reqBody = req.body;
        validateRequest(reqBody);
        const measurementData = await PoroPressureController.getHourlyMeasurementsByDeviceId(reqBody.deviceId, reqBody.startDate, reqBody.endDate);
        return res.status(200).json(measurementData);
    }
    catch (error) {
        next(error);
    }
}

function validateRequest (reqBody) {
    const fields = {deviceId:  'string', startDate: 'string', endDate: 'string'};
    for (const field in reqBody) {
        if (!fields[field] || typeof reqBody[field] !== fields[field]) {
            throw new InvalidField(field);
        }
    }
}

module.exports = router;