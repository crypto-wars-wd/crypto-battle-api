const { userModel } = require('models');
const { sessions } = require('utilities/authentication');

module.exports = async (req, res, params) => {
  const { payload, error: getAuthError } = await sessions.getAuthData({ req });
  if (getAuthError) return { error: { status: 401, message: 'No token provided' } };


  const { user, error: findUserError } = await userModel.findOneSelect({
    condition: { _id: params.id },
    select: '+auth',
  });
  if (!user) return { error: { status: 404, message: 'User not found' } };
  if (findUserError) return { error: { status: 503, message: findUserError.message } };

  const session = sessions
    .findSession({ sessions: user && user.auth && user.auth.sessions, sid: payload.sid });
  const { successDestroy, error: destroySessionError } = await userModel
    .destroySession({ userId: user._id, session });
  if (destroySessionError) return { error: { status: 503, message: destroySessionError.message } };

  return { successDestroy };
};
