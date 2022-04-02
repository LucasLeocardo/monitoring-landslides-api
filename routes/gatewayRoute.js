const { Router } = require('express');
const GatewayController = require('../controllers/GatewayController');
const InvalidField = require('../errorTreatment/InvalidField');
const middlewaresAuthetication = require('../shared/middlewares-authentication');

const router = Router();

router
    .post('/gateways', middlewaresAuthetication.bearer, (req, res, next) => { saveNewGatewayAsync(req, res, next) });


async function saveNewGatewayAsync(req, res, next) {
    try {
        const reqBody = req.body;
        validateRequest(reqBody);
        const gatewayCreated = await GatewayController.createGatewayAsync(reqBody.name);
        return res.status(200).json(gatewayCreated);
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