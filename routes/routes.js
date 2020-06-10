const { Router } = require('express');
const {
  authController,
  battleController,
  userController,
  transferController,
} = require('controllers');
const { validateAuthToken } = require('utilities/authentication');

const apiRoutes = new Router();
const authRoutes = new Router();
const userRoutes = new Router();
const battleRoutes = new Router();
const parserRoutes = new Router();

apiRoutes.use('/api', authRoutes);
apiRoutes.use('/api', userRoutes);
apiRoutes.use('/api', battleRoutes);
apiRoutes.use('/api', parserRoutes);

//  region auth routes
authRoutes.route('/has-social-account')
  .get(authController.hasSocialAccount);
authRoutes.route('/auth/:provider')
  .post(authController.socialSignIn);
authRoutes.route('/validate-auth-token')
  .post(validateAuthToken.validateAuthToken, authController.validateAuthToken);
authRoutes.route('/logout')
  .post(authController.logout);
// endregion
// region battle routes
battleRoutes.route('/create-battle')
  .post(battleController.createBattle);
battleRoutes.route('/crypto-currencies')
  .get(battleController.getCryptoCurrencies);
battleRoutes.route('/top-warriors')
  .get(battleController.getTopWarriors);
battleRoutes.route('/connect-battle')
  .post(battleController.connectBattle);
battleRoutes.route('/update-battles')
  .post(battleController.updateBattles);
battleRoutes.route('/get-battles')
  .get(battleController.getBattles);
battleRoutes.route('/cancel-battle')
  .post(validateAuthToken.verifyAuthToken, battleController.cancelBattle);
// endregion
// region user routes
userRoutes.route('/update-user-info')
  .post(validateAuthToken.verifyAuthToken, userController.updateUserInfo);
userRoutes.route('/image')
  .post(validateAuthToken.verifyAuthToken, userController.uploadImage);
userRoutes.route('/set-hive-account')
  .post(validateAuthToken.verifyAuthToken, userController.linkToHive);
userRoutes.route('/get-personal-account')
  .get(validateAuthToken.verifyAuthToken, userController.getPersonalAccount);
// endregion
// region parser routes
parserRoutes.route('/replenish-account').post(transferController.updateUserBalance);
// endregion
module.exports = apiRoutes;
