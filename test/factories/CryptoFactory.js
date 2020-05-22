const { faker, Crypto } = require('test/testHelper');

const createNewCrypto = async ({
  cryptoName, onlyData,
} = {}) => {
  const cryptoData = {
    cryptoName: cryptoName || `${faker.name.firstName()}`,
  };
  if (onlyData) return cryptoData;
  const crypto = new Crypto(cryptoData);

  await crypto.save();
  crypto.toObject();
  return crypto;
};

module.exports = { createNewCrypto };
