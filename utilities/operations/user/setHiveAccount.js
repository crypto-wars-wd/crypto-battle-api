const { userModel } = require('models');
const { hiveHelper } = require('utilities/helpers');

module.exports = async (params) => {
  if (!await hiveHelper.isAccountExist({ name: params.hiveName })) {
    return { error: { status: 404, message: 'this username does not exist' } };
  }

  const { user, error } = await userModel.updateOne({
    condition: { _id: params.userID },
    updateData: { 'personalAccount.hiveName': params.hiveName },
  });
  if (error) return { error: { status: 503, message: error.message } };

  return { user };
};
