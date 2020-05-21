const { Crypto } = require('database').models;
const cryptoList = require('./cryptoList');

const addCrypto = async () => {
  await Crypto.insertMany(cryptoList, (error) => console.error(error));
};
addCrypto();
