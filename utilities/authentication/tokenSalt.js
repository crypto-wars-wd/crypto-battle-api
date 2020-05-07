const crypto = require('crypto-js');

const encodeToken = ({ access_token }) => crypto.AES.encrypt(access_token, process.env.CRYPTO_KEY || 'db5c57b3fc1c105e772a3784df6b798c').toString();

const decodeToken = async ({ access_token }) => {
  try {
    return crypto.AES.decrypt(access_token, process.env.CRYPTO_KEY || 'db5c57b3fc1c105e772a3784df6b798c').toString(crypto.enc.Utf8);
  } catch (error) {
    return null;
  }
};

module.exports = { encodeToken, decodeToken };
