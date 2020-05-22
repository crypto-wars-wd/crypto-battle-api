const { userModel } = require('models');
const { sessions } = require('utilities/authentication');

module.exports = async (req, res, params) => {
  const { payload, error: getAuthError } = await sessions.getAuthData({ req });
  if (getAuthError) return { error: { status: 401, message: 'No token provided' } };

  const { user, error: findUserError } = await userModel.findUserById(params.id);
  if (findUserError) return { error: { status: 404, message: 'User not found' } };

  const session = sessions
    .findSession({ sessions: user && user.auth && user.auth.sessions, sid: payload.sid });
  const { successDestroy, error: destroySessionError } = await userModel
    .destroySession({ userId: user._id, session });
  if (destroySessionError) return { error: { status: 503, message: 'Destroy session error' } };

  return { successDestroy };
};
