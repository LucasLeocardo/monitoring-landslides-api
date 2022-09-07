const { Router } = require('express');
const VibrationController = require('../controllers/VibrationController');
const InvalidField = require('../errorTreatment/InvalidField');
const middlewaresAuthetication = require('../shared/middlewares-authentication');

const router = Router();

router
    .post('/vibrations/getDaillyLinearAccelerationByDeviceId', middlewaresAuthetication.bearer, (req, res, next) => { getDaillyLinearAccelerationByDeviceId(req, res, next) })
    .post('/vibrations/getDaillyAngularVelocityByDeviceId', middlewaresAuthetication.bearer, (req, res, next) => { getDaillyAngularVelocityByDeviceId(req, res, next) })
    .post('/vibrations/getHourlyLinearAccelerationByDeviceId', middlewaresAuthetication.bearer, (req, res, next) => { getHourlyLinearAccelerationByDeviceId(req, res, next) })
    .post('/vibrations/getHourlyAngularVelocityByDeviceId', middlewaresAuthetication.bearer, (req, res, next) => { getHourlyAngularVelocityByDeviceId(req, res, next) });


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

async function getDaillyAngularVelocityByDeviceId(req, res, next) {
    try {
        const reqBody = req.body;
        validateRequest(reqBody);
        const measurementData = await VibrationController.getDaillyAngularVelocityByDeviceId(reqBody.deviceId, reqBody.startDate, reqBody.endDate);
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

async function getHourlyAngularVelocityByDeviceId(req, res, next) {
    try {
        const reqBody = req.body;
        validateRequest(reqBody);
        const measurementData = await VibrationController.getHourlyAngularVelocityByDeviceId(reqBody.deviceId, reqBody.startDate, reqBody.endDate);
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