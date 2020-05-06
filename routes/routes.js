const { Router } = require('express');
const {
  AuthController,
} = require('controllers');

const apiRoutes = new Router();
const authRoutes = new Router();


apiRoutes.use('/api', authRoutes);

// region Auth
authRoutes.route('/auth')
  .post(AuthController.index);

module.exports = apiRoutes;
