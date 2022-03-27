const blackList = require('./black-list');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const { createHash } = require('crypto');
const setAsync = promisify(blackList.set).bind(blackList);
const existsAsync = promisify(blackList.exists).bind(blackList);

function createTokenHash(token) {
    return createHash('sha256').update(token).digest('hex');
}

module.exports = {
    addToken: async token => {
        const expirationDate = jwt.decode(token).exp;
        const tokenHash = createTokenHash(token);
        await setAsync(tokenHash, '');
        blackList.expireat(tokenHash, expirationDate);

    },
    containsToken: async token => {
        const tokenHash = createTokenHash(token);
        const result = await existsAsync(tokenHash);
        return result === 1;
    }
}