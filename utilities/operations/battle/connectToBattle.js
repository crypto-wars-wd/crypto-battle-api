const { battleModel } = require('models');
const { withdrawHelper } = require('utilities/helpers');

module.exports = async (params) => {
  if (params.betType) {
    const { user, error } = await withdrawHelper.withdrawBet(params);
    if (user.n === 0 || user.nModified === 0) return { error: { status: 404, message: 'User not found' } };
    if (error) return { error: { status: 503, message: error.message } };
  }
  const { battle, error } = await battleModel.connectBattle(params);
  if (error) return { error: { status: 503, message: error.message } };

  return { battle };
};
