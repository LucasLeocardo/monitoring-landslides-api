const { Router } = require('express');
const UserController = require('../controllers/UserController');
const InvalidField = require('../errorTreatment/InvalidField');
const middlewaresAuthetication = require('../shared/middlewares-authentication');

const router = Router();

router
    .post('/users', middlewaresAuthetication.bearer, (req, res, next) => { createUserAsync(req, res, next) })
    .post('/users/login', middlewaresAuthetication.local, (req, res) => { login(req, res) })
    .post('/users/logout', middlewaresAuthetication.local, (req, res) => { login(req, res) });


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

function login(req, res) {
    const token = UserController.createJwtToken(req.user);
    res.set('Authorization', token);
    return res.status(204).send();
}

module.exports = router;