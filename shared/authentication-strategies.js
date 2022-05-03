const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const UserController = require('../controllers/UserController');
const InvalidArgumentError = require('../errorTreatment/InvalidArgumentError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blackListManagement = require('../redis/black-list-management');

passport.use(
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        session: false
    }, async (email, password, done) => {
        try {
            const user = await UserController.getUserByEmail(email.toLowerCase());
            checkUser(user);
            await checkPassword(password, user.hashPassword);
            return done(null, user);
        }
        catch (error) {
            done(error);
        }
    })
);

passport.use(
    new BearerStrategy(
        async (token, done) => {
            try {
                await checkTokenInBlackList(token);
                const payload = jwt.verify(token, process.env.JWT_KEY);
                const user = await UserController.getUserById(payload.id);
                done(null, user, { token: token });
            }
            catch (error) { 
                done(error);
            }
        }
    )
);

function checkUser(user) {
    if (!user) {
        throw new InvalidArgumentError('There is no user with this email!');
    }
}

async function checkPassword(password, hashPassword) {
    const isPasswordValid = await bcrypt.compare(password, hashPassword);
    if (!isPasswordValid) {
        throw new InvalidArgumentError('Invalid email or password');
    }
}

async function checkTokenInBlackList(token) {
    const isTokenInTheBlackList = await blackListManagement.containsToken(token);
    if (isTokenInTheBlackList) {
        throw new jwt.JsonWebTokenError('Invalid Token by logout!');
    }
}

module.exports = passport;