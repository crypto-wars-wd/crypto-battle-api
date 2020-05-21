const { Crypto } = require('database').models;

const findAllCrypto = async () => {
  try {
    return { crypto: await Crypto.find().lean() };
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
      }, { upsert: true }),
    };
  } catch (error) {
    return { message: error };
  }
};

module.exports = {
  findAllCrypto, updateCryptoResultBattle,
};
