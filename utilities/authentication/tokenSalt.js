const crypto = require('crypto-js');

const encodeToken = ({ accessToken }) => crypto.AES.encrypt(accessToken, process.env.CRYPTO_KEY || 'asdfsdfgdfgr').toString();

const decodeToken = async ({ accessToken }) => {
  try {
    return crypto.AES.decrypt(accessToken, process.env.CRYPTO_KEY || 'asdfsdfgdfgr').toString(crypto.enc.Utf8);
  } catch (error) {
    return null;
  }
};

module.exports = { encodeToken, decodeToken };
