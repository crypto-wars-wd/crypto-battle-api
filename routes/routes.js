const { Router } = require('express');
const {
  AuthController,
} = require('controllers');
const { validateAuthToken } = require('utilities/authentication').validateAuthToken;

const apiRoutes = new Router();
const authRoutes = new Router();

apiRoutes.use('/api', authRoutes);

//  authRoutes
authRoutes.route('/has-social-account')
  .get(AuthController.hasSocialAccount);

authRoutes.route('/auth/:provider')
  .post(AuthController.socialSignIn);
authRoutes.route('/validate-auth-token')
  .post(validateAuthToken, AuthController.validateAuthToken);

module.exports = apiRoutes;
