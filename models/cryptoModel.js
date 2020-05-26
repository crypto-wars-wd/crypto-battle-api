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
    return {
      result: await Crypto.updateOne({ cryptoName }, {
        $inc: {
          numberOfLosses: (resultBattle) === 'lose' ? 1 : 0,
          numberOfVictories: (resultBattle) === 'win' ? 1 : 0,
          numberOfFights: 1,
        },
      }),
    };
  } catch (error) {
    return { error };
  }
};

module.exports = {
  findAllCrypto, updateCryptoResultBattle,
};
