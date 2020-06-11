const ObjectId = require('mongodb').ObjectID;
const render = require('concerns/render');
const { userModel } = require('models');
const sessions = require('./sessions');

const verifyAuthToken = async (req, res, next) => {
  const { payload, decodedToken, error } = await sessions.getAuthData({ req });

  if (error) return render.unauthorized(res, error);


  const { user } = await userModel.findOneSelect({
    condition: { _id: ObjectId(payload.id) },
    select: '+auth',
  });
  if (!user) return render.unauthorized(res, 'User not exist');
  const session = sessions.findSession(
    { sessions: user && user.auth && user.auth.sessions, sid: payload.sid },
  );
  if (session) {
    const { result } = sessions.confirmAuthToken({
      req, user, session, decodedToken,
    });
    if (!result) return render.unauthorized(res);
    return next();
  }
  await sessions.removeAuthSession({ userId: user._id, session: payload });
  return render.unauthorized(res);
};

const validateAuthToken = async (req, res, next) => {
  const { payload, decodedToken, error } = await sessions.getAuthData({ req });

  if (error) return render.unauthorized(res, error);

  const { user } = await userModel.findOneSelect({
    condition: { _id: ObjectId(payload.id) },
    select: '+auth',
  });
  if (!user) return render.unauthorized(res, 'User not exist');
  const session = sessions.findSession(
    { sessions: user.auth && user.auth.sessions, sid: payload.sid },
  );
  if (session) {
    const { result } = await sessions.verifyToken({
      decodedToken, session, doc: user, req, res,
    });

    if (!result) return render.unauthorized(res);
    return next();
  }
  if (user._id) await sessions.removeAuthSession({ userId: user._id, session: payload });
  return render.unauthorized(res);
};

module.exports = {
  validateAuthToken,
  verifyAuthToken,
};
