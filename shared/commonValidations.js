const InvalidArgumentError = require('../errorTreatment/InvalidArgumentError');

module.exports = {
    stringFieldNotNull: (value, name) => {
    if (typeof value !== 'string' || value === 0)
      throw new InvalidArgumentError(`It is necessary to fill the field ${name}!`);
    },

    minimumSizeField: (value, name, minimum) => {
        if (value.length < minimum)
        throw new InvalidArgumentError(
            `The field ${name} must be greater than ${minimum} characters!`
        );
    },

    maximumSizeField : (value, name, maximum) => {
        if (value.length > maximum)
        throw new InvalidArgumentError(
            `The field ${name} must be less than ${maximum} characters!`
        );
    }
}