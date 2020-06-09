const { userModel } = require('models');

module.exports = async (params) => {
  const { user, error } = await userModel.updateOne({
    condition: { _id: params.userID },
    updateData: { 'personalAccount.hiveName': params.hiveName },
  });
  if (error) return { error: { status: 503, message: error.message } };

  return { user };
};
