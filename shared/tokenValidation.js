const blackListManagement = require('../redis/black-list-management');
const jwt = require('jsonwebtoken');
const UserController = require('../controllers/UserController');

const validateToken = async token => {
    await checkTokenInBlackList(token);
    const payload = jwt.verify(token, process.env.JWT_KEY);
    const user = await UserController.getUserById(payload.id);
    return user;
};

async function checkTokenInBlackList(token) {
    const isTokenInTheBlackList = await blackListManagement.containsToken(token);
    if (isTokenInTheBlackList) {
        throw new jwt.JsonWebTokenError('Invalid Token by logout!');
    }
}

module.exports = validateToken;