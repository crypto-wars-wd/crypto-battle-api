const { userModel } = require('models');
const render = require('concerns/render');
const { sessions } = require('utilities/authentication');

exports.killSession = async (req, res, params) => {
  const { payload, error } = await sessions.getAuthData({ req });
  if (error) return render.unauthorized(res, error);

  const { user, message } = await userModel.findUserById(params.id);
  if (message) return render.error(res, message);

  const session = sessions
    .findSession({ sessions: user && user.auth && user.auth.sessions, sid: payload.sid });
  await userModel.destroySession({ userId: user._id, session });
};
