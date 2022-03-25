const User = require('../models/User');
const commonValidations = require('../shared/commonValidations');
const bcrypt = require('bcrypt');

class UserController {

    static async createUserAsync(name, email, password) {
        UserController.validateUser(name, email, password);
        const hashPassword = await UserController.createHashPassword(password);
        return await User.create({name: name, email: email, hashPassword: hashPassword});
    }

    static async createHashPassword(password) {
        const hashCost  = 12;
        return await bcrypt.hash(password, hashCost);
    }

    static validateUser(name, email, password) {
        commonValidations.stringFieldNotNull(name, 'name');
        commonValidations.stringFieldNotNull(email, 'email');
        commonValidations.stringFieldNotNull(password, 'password');
        commonValidations.minimumSizeField(password, 'password', 6);
        commonValidations.maximumSizeField(password, 'password', 64);
    }

}

module.exports = UserController;