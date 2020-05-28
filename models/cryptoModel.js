const { Crypto } = require('database').models;

const findAllCrypto = async ({ limit, skip }) => {
  try {
    return {
      crypto: await Crypto.find().sort({ numberOfVictories: 'desc' }).skip(skip).limit(limit)
        .lean(),
    };
  } catch (error) {
    return { error };
  }
};

const updateOneByName = async ({ cryptoName, dataToUpdate }) => {
  try {
    await Crypto.updateOne({ cryptoName }, dataToUpdate);
  } catch (error) {
    return { error };
  }
};

module.exports = {
  findAllCrypto, updateOneByName,
};
