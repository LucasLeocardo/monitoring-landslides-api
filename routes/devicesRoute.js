const { Router } = require('express');
const DeviceController = require('../controllers/DeviceController');
const InvalidField = require('../errorTreatment/InvalidField');
const middlewaresAuthetication = require('../shared/middlewares-authentication');

const router = Router();

router
    .post('/devices', middlewaresAuthetication.bearer, (req, res, next) => { saveNewDeviceAsync(req, res, next) })
    .get('/devices', middlewaresAuthetication.bearer, (req, res, next) => { getAllDevicesAsync(req, res, next) })
    .get('/activeDevices', middlewaresAuthetication.bearer, (req, res, next) => { getActiveDevicesAsync(req, res, next) })
    .delete('/removeDevicesByIds', middlewaresAuthetication.bearer, (req, res, next) => { deleteDevicesAsync(req, res, next) })
    .put('/devices', middlewaresAuthetication.bearer, (req, res, next) => { updateDeviceAsync(req, res, next) })
    .put('/devices/:deviceId', middlewaresAuthetication.bearer, (req, res, next) => { updateDeviceStatusAsync(req, res, next) });


async function saveNewDeviceAsync(req, res, next) {
    try {
        const reqBody = req.body;
        validateRequest(reqBody);
        const deviceCreated = await DeviceController.createDeviceAsync(reqBody.name, reqBody.latitude, reqBody.longitude, req.user._id);
        return res.status(200).json(deviceCreated._id);
    }
    catch (error) {
        next(error);
    }
}

async function getAllDevicesAsync(req, res, next) {
    try {
        const devices = await DeviceController.getAllDevicesAsync(req.user);
        return res.status(200).json(devices);
    }
    catch (error) {
        next(error);
    }
}

async function getActiveDevicesAsync(req, res, next) {
    try {
        const devices = await DeviceController.getActiveDevicesAsync(req.user);
        return res.status(200).json(devices);
    }
    catch (error) {
        next(error);
    }
}

async function deleteDevicesAsync(req, res, next) {
    try {
        const { deviceIds } = req.body;
        const deletedObject = await DeviceController.deleteDevicesAsync(deviceIds);
        return res.status(200).json(`The number of deleted devices was: ${deletedObject.deletedCount}`);
    }
    catch (error) {
        next(error);
    }
}

async function updateDeviceStatusAsync(req, res, next) {
    try {
        const deviceId = req.params.deviceId;
        const { newDeviceStatus } = req.body;
        const deviceUpdated = await DeviceController.updateDeviceStatusAsync(deviceId, newDeviceStatus);
        return res.status(200).json(`The number of updated devices was: ${deviceUpdated.modifiedCount}`);
    }
    catch (error) {
        next(error);
    }
}

async function updateDeviceAsync(req, res, next) {
    try {
        const reqBody = req.body;
        validateRequest(reqBody);
        const deviceUpdated = await DeviceController.updateDeviceAsync(reqBody);
        return res.status(200).json(`The number of updated devices was: ${deviceUpdated.modifiedCount}`);
    }
    catch (error) {
        next(error);
    }
}

function validateRequest (reqBody) {
    const fields = {id:  'string', name: 'string', latitude: 'number', longitude: 'number'};
    for (const field in reqBody) {
        if (!fields[field] || typeof reqBody[field] !== fields[field]) {
            throw new InvalidField(field);
        }
    }
}

module.exports = router;