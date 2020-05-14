const _ = require('lodash');
const jwt = require('jsonwebtoken');
const { ObjectID } = require('bson');
const crypto = require('crypto-js');
const { uuid } = require('uuidv4');
const config = require('config');
const moment = require('moment');
const { destroySession, updateSession } = require('models/userModel');
const { encodeToken, decodeToken } = require('./tokenSalt');

const generateSession = () => ({
  sid: new ObjectID(),
  secretToken: crypto.SHA512(`${uuid()}`).toString(),
});

const removeAuthSession = async ({ userId, session }) => {
  await destroySession({ userId, session });
};

const setAuthHeaders = (res, client, session) => {
  const { accessToken, expiresIn } = tokenSign(client, session);

  res.setHeader('access-token', encodeToken({ accessToken }));
  res.setHeader('expires-in', expiresIn);
};

const setAuthSession = ({ req, user, session }) => {
  req.auth = { user, session };
};

const getAuthData = async ({ req }) => {
  const accessToken = req.headers['access-token'];

  if (!accessToken) return { error: 'Token not found' };
  const decodedToken = await decodeToken({ accessToken });
  const payload = await jwt.decode(decodedToken);

  if (!payload || !payload.id || !decodedToken) return { error: 'Invalid token' };
  return { payload, decodedToken };
};

const findSession = ({ sessions, sid }) => _.find(sessions, (hash) => hash.sid === sid);

const refreshSession = async ({ req, doc, oldSession }) => {
  const newSession = generateSession();

  await destroySession({ userId: doc._id, session: oldSession });
  await updateSession(doc, newSession);
  setAuthSession({ req, user: doc, session: newSession });
};

const tokenSign = (self, tokenHash) => {
  const accessToken = jwt.sign(
    { email: self.email, id: self._id, sid: tokenHash.sid },
    tokenHash.secretToken,
    { expiresIn: config.sessionExpiration },
  );
  return { accessToken, expiresIn: jwt.decode(accessToken).exp };
};

const verifyToken = async ({
  decodedToken, session, doc, req, res,
}) => {
  try {
    jwt.verify(decodedToken, session.secretToken);
    setAuthSession({ req, user: doc, session });
    return { result: true };
  } catch (error) {
    if (error.message === 'jwt expired' && error.expiredAt > moment.utc().subtract(1, 'day')) {
      await refreshSession({
        res, req, doc, oldSession: session,
      });
      return { result: true };
    }
    return { result: false };
  }
};

const confirmAuthToken = ({
  req, user, session, decodedToken, secretToken,
}) => {
  try {
    jwt.verify(decodedToken, secretToken);
    setAuthSession({ req, user, session });
    return { result: true };
  } catch (error) {
    return { result: false };
  }
};

module.exports = {
  tokenSign,
  generateSession,
  setAuthHeaders,
  decodeToken,
  verifyToken,
  confirmAuthToken,
  findSession,
  getAuthData,
  removeAuthSession,
};
