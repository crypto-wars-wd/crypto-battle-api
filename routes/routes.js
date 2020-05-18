const { Router } = require('express');
const {
  authController,
  battleController,
  userController,
} = require('controllers');
const { validateAuthToken } = require('utilities/authentication');

const apiRoutes = new Router();
const authRoutes = new Router();

apiRoutes.use('/api', authRoutes);

//  authRoutes
authRoutes.route('/has-social-account')
  .get(authController.hasSocialAccount);
authRoutes.route('/auth/:provider')
  .post(authController.socialSignIn);
authRoutes.route('/validate-auth-token')
  .post(validateAuthToken.validateAuthToken, authController.validateAuthToken);
// battle routes
authRoutes.route('/create-battle')
  .post(battleController.createBattle);
// user routes
authRoutes.route('/update-user-info')
  // .post(validateAuthToken.validateAuthToken, userController.updateUserInfo);
  .post(userController.updateUserInfo);

module.exports = apiRoutes;
