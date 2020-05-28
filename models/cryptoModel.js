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

const updateOne = async ({ condition, updateData }) => {
  try {
    await Crypto.updateOne(condition, updateData);
  } catch (error) {
    return { error };
  }
};

module.exports = {
  findAllCrypto, updateOne,
};
