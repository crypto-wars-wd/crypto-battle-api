const { Crypto } = require('database').models;

const findAllCrypto = async () => {
  try {
    return { crypto: await Crypto.find().lean() };
  } catch (error) {
    return { error };
  }
};
const create = async (name) => {
  const crypto = new Crypto({
    name,
  });
  try {
    await crypto.save();
  } catch (err) {
    return { message: err };
  }
};
create('BTC');
create('UFR');

module.exports = {
  findAllCrypto,
};
