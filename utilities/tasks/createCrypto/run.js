const { Crypto } = require('database').models;
const cryptoList = require('./cryptoList');

const addCrypto = async () => {
  try {
    await Crypto.insertMany(cryptoList);
    console.log('Crypto successfully added');
  } catch (error) {
    console.error(error);
  }
};

(async () => {
  await addCrypto();
})();
