class InvalidField extends Error {
    constructor (field) {
        const message = `The request field ${field} is invalid`;
        super(message);
        this.name = 'InvalidField';
    }
}

module.exports = InvalidField