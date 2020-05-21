const { Router } = require('express');
const {
  authController,
  battleController,
  userController,
} = require('controllers');
const { validateAuthToken } = require('utilities/authentication');

const apiRoutes = new Router();
const authRoutes = new Router();
const userRoutes = new Router();
const battleRoutes = new Router();

apiRoutes.use('/api', authRoutes);
apiRoutes.use('/api', userRoutes);
apiRoutes.use('/api', battleRoutes);

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
// endregion
// region user routes
userRoutes.route('/update-user-info')
  .post(validateAuthToken.verifyAuthToken, userController.updateUserInfo);
// endregion

module.exports = apiRoutes;
