const { Router } = require('express');
const {
  AuthController,
} = require('controllers');

const apiRoutes = new Router();
const authRoutes = new Router();

apiRoutes.use('/api', authRoutes);

//  authRoutes
authRoutes.route('/auth')
  .post(AuthController.hasSocialAccount);

module.exports = apiRoutes;
