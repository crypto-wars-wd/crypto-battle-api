const { Crypto } = require('database').models;

const findAllCrypto = async () => {
  try {
    return { crypto: await Crypto.find().lean() };
  } catch (error) {
    return { message: error };
  }
};

module.exports = {
  findAllCrypto,
};
