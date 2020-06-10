const { userModel } = require('models');

module.exports = async (params) => {
  let condition;
  if (params.cryptoType === 'HIVE' || params.cryptoType === 'HBD') {
    condition = { 'personalAccount.hiveName': params.senderName };
  } else if (params.cryptoType === 'STEEM' || params.cryptoType === 'SBD') {
    condition = { 'personalAccount.steemName': params.senderName };
  }
  const updateData = {
    $inc: { [`personalAccount.${params.cryptoType}`]: params.amount },
  };
  const { user, error } = await userModel.updateOne({ condition, updateData });
  if (user.n === 0 || user.nModified === 0) return { error: { status: 404, message: 'User not found' } };
  if (error) return { error: { status: 503, message: error.message } };

  return { user };
};
