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

const updateCryptoResultBattle = async ({ cryptoName, resultBattle }) => {
  try {
    await Crypto.updateOne({ cryptoName }, {
      $inc: resultBattle,
    });
  } catch (error) {
    return { error };
  }
};

module.exports = {
  findAllCrypto, updateCryptoResultBattle,
};
