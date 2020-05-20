const { Router } = require('express');
const {
  authController,
  battleController,
  userController,
} = require('controllers');
const { validateAuthToken } = require('utilities/authentication');

const apiRoutes = new Router();
const authRoutes = new Router();
const battleRoutes = new Router();

apiRoutes.use('/api', authRoutes);
apiRoutes.use('/api', battleRoutes);

//  authRoutes
authRoutes.route('/has-social-account')
  .get(authController.hasSocialAccount);
authRoutes.route('/auth/:provider')
  .post(authController.socialSignIn);
authRoutes.route('/validate-auth-token')
  .post(validateAuthToken.validateAuthToken, authController.validateAuthToken);
authRoutes.route('/logout')
  .post(authController.logout);
// battle routes
battleRoutes.route('/create-battle')
  .post(battleController.createBattle);
battleRoutes.route('/crypto-currencies')
  .get(battleController.getCryptoCurrencies);
// user routes
authRoutes.route('/update-user-info')
  .post(validateAuthToken.verifyAuthToken, userController.updateUserInfo);


module.exports = apiRoutes;
