const { userModel } = require('models');
const { sessions } = require('utilities/authentication');

module.exports = async (req, res, params) => {
  const { payload, error } = await sessions.getAuthData({ req });
  if (error) return { error };

  const { user, findUserError } = await userModel.findUserById(params.id);
  if (findUserError) return { findUserError };

  const session = sessions
    .findSession({ sessions: user && user.auth && user.auth.sessions, sid: payload.sid });
  const { successDestroy, destroySessionError } = await userModel
    .destroySession({ userId: user._id, session });
  if (destroySessionError) return { destroySessionError };

  return { successDestroy };
};
