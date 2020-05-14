const crypto = require('crypto-js');

const encodeToken = ({ accessToken }) => crypto.AES.encrypt(accessToken, process.env.CRYPTO_KEY || 'db5c57b3fc1c105e772a3784df6b798c').toString();

const decodeToken = async ({ accessToken }) => {
  try {
    return crypto.AES.decrypt(accessToken, process.env.CRYPTO_KEY || 'db5c57b3fc1c105e772a3784df6b798c').toString(crypto.enc.Utf8);
  } catch (error) {
    return null;
  }
};

module.exports = { encodeToken, decodeToken };
