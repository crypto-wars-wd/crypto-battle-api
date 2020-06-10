const { userModel } = require('models');

exports.withdrawBet = async (params) => {
  const { user, error } = await userModel.updateOne({
    condition: { _id: params.playerID },
    updateData: { $inc: { [`personalAccount.${params.betType}`]: -params.amount } },
  });
  if (error) return { error };
  return { user };
};
