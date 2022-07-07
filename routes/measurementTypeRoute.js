const { Router } = require('express');
const MeasurementTypeController = require('../controllers/MeasurementTypeController');
const middlewaresAuthetication = require('../shared/middlewares-authentication');

const router = Router();

router
    .get('/measurementType/getAll', middlewaresAuthetication.bearer, (req, res, next) => { getAllMeasurementType(req, res, next) });

async function getAllMeasurementType(req, res, next) {
    try {
        const measurementTypeList = await MeasurementTypeController.getAllMeasurementTypeAsync();
        return res.status(200).json(measurementTypeList);
    }
    catch (error) {
        next(error);
    }
}

module.exports = router;