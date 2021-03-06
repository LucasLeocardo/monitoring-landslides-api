const { Router } = require('express');
const UserController = require('../controllers/UserController');
const InvalidField = require('../errorTreatment/InvalidField');
const middlewaresAuthetication = require('../shared/middlewares-authentication');
const blackListManagement = require('../redis/black-list-management');

const router = Router();

router
    .post('/user', middlewaresAuthetication.bearer, (req, res, next) => { createUserAsync(req, res, next) })
    .post('/users/login', middlewaresAuthetication.local, (req, res) => { login(req, res) })
    .post('/users/logout', middlewaresAuthetication.bearer, (req, res, next) => { logout(req, res, next) })
    .get('/users', middlewaresAuthetication.bearer, (req, res, next) => { getUsers(res, next) })
    .post('/users/deleteByIds', middlewaresAuthetication.bearer, (req, res, next) => { deleteByIds(req, res, next) });


async function createUserAsync(req, res, next) {
    try {
        validateRequest(req.body);
        const {name, email,  password, phoneNumber} = req.body;
        const userCreated = await UserController.createUserAsync(name, email.toLowerCase(), password, phoneNumber);
        return res.status(200).json(userCreated);
    }
    catch (error) {
        next(error);
    }
}

async function deleteByIds(req, res, next) {
    try {
        const userIds = req.body;
        await UserController.deleteUsers(userIds);
        return res.status(200).send();
    }
    catch (error) {
        next(error);
    }
}

async function getUsers(res, next) {
    try{
        const usersList = await UserController.getAllUsersList();
        return res.status(200).json(usersList);
    }
    catch (error) {
        next(error);
    }
}

function login(req, res) {
    const token = UserController.createJwtToken(req.user);
    const { name, email, phoneNumber, isAdmin } = req.user;
    return res.status(200).json({ name, email, phoneNumber, isAdmin, token });
}

async function logout(req, res, next) {
    try {
        const token = req.token;
        await blackListManagement.addToken(token);
        return res.status(204).send();
    }
    catch (error) {
        next(error);
    }
}

function validateRequest (reqBody) {
    const fields = {name:  'string', email: 'string', password: 'string', phoneNumber: 'string'};
    for (const field in reqBody) {
        if (!fields[field] || typeof reqBody[field] !== fields[field]) {
            throw new InvalidField(field);
        }
    }
}

module.exports = router;