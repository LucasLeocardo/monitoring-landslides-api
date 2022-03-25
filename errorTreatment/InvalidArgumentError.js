class InvalidArgumentError extends Error {
  constructor(menssage) {
    super(menssage);
    this.name = 'InvalidArgumentError';
  }
}

module.exports = InvalidArgumentError;