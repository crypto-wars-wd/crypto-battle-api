const { Crypto } = require('database').models;

const findAllCrypto = async () => ({ crypto: await Crypto.find().lean() });

module.exports = {
  findAllCrypto,
};
