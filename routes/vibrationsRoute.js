const { Router } = require('express');
const VibrationController = require('../controllers/VibrationController');
const InvalidField = require('../errorTreatment/InvalidField');
const middlewaresAuthetication = require('../shared/middlewares-authentication');

const router = Router();

router
    .post('/vibrations/getDaillyLinearAccelerationByDeviceId', middlewaresAuthetication.bearer, (req, res, next) => { getDaillyLinearAccelerationByDeviceId(req, res, next) })
    .post('/vibrations/getDaillyAngularAccelerationByDeviceId', middlewaresAuthetication.bearer, (req, res, next) => { getDaillyAngularAccelerationByDeviceId(req, res, next) })
    .post('/vibrations/getHourlyLinearAccelerationByDeviceId', middlewaresAuthetication.bearer, (req, res, next) => { getHourlyLinearAccelerationByDeviceId(req, res, next) })
    .post('/vibrations/getHourlyAngularAccelerationByDeviceId', middlewaresAuthetication.bearer, (req, res, next) => { getHourlyAngularAccelerationByDeviceId(req, res, next) });


async function getDaillyLinearAccelerationByDeviceId(req, res, next) {
    try {
        const reqBody = req.body;
        validateRequest(reqBody);
        const measurementData = await VibrationController.getDaillyLinearAccelerationByDeviceId(reqBody.deviceId, reqBody.startDate, reqBody.endDate);
        return res.status(200).json(measurementData);
    }
    catch (error) {
        next(error);
    }
}

async function getDaillyAngularAccelerationByDeviceId(req, res, next) {
    try {
        const reqBody = req.body;
        validateRequest(reqBody);
        const measurementData = await VibrationController.getDaillyAngularAccelerationByDeviceId(reqBody.deviceId, reqBody.startDate, reqBody.endDate);
        return res.status(200).json(measurementData);
    }
    catch (error) {
        next(error);
    }
}

async function getHourlyLinearAccelerationByDeviceId(req, res, next) {
    try {
        const reqBody = req.body;
        validateRequest(reqBody);
        const measurementData = await VibrationController.getHourlyLinearAccelerationByDeviceId(reqBody.deviceId, reqBody.startDate, reqBody.endDate);
        return res.status(200).json(measurementData);
    }
    catch (error) {
        next(error);
    }
}

async function getHourlyAngularAccelerationByDeviceId(req, res, next) {
    try {
        const reqBody = req.body;
        validateRequest(reqBody);
        const measurementData = await VibrationController.getHourlyAngularAccelerationByDeviceId(reqBody.deviceId, reqBody.startDate, reqBody.endDate);
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