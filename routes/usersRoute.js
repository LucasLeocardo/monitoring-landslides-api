const { Router } = require('express');
const UserController = require('../controllers/UserController');
const InvalidField = require('../errorTreatment/InvalidField');

const router = Router();

router
    .post('/users', (req, res, next) => { createUserAsync(req, res, next) });


async function createUserAsync(req, res, next) {
    try {
        validateRequest(req.body);
        const {name, email,  password} = req.body;
        const userCreated = await UserController.createUserAsync(name, email, password);
        return res.status(200).json(userCreated);
    }
    catch (error) {
        next(error);
    }
}

function validateRequest (reqBody) {
    const fields = {name:  'string', email: 'string', password: 'string'};
    for (const field in reqBody) {
        if (!fields[field] || typeof reqBody[field] !== fields[field]) {
            throw new InvalidField(field);
        }
    }
}

module.exports = router;