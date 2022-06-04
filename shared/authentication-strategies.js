const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const UserController = require('../controllers/UserController');
const InvalidArgumentError = require('../errorTreatment/InvalidArgumentError');
const bcrypt = require('bcrypt');
const validateToken = require('./tokenValidation');

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
                const user = await validateToken(token);
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

module.exports = passport;