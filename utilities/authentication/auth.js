const {
  signUpSocial,
  signInSocial,
  findUserBySocial,
} = require('models/userModel');
const { generateSession } = require('./sessions');

exports.socialAuth = async ({
  alias, provider, avatar, id, postLocales,
}) => {
  const userBySocial = await findUserBySocial({ id, provider });
  const session = generateSession();

  if (!userBySocial) {
    const { user, session: existSession, errorSignUp } = await signUpSocial({
      alias, avatar, provider, id, session, postLocales,
    });
    return { errorSignUp, user, session: existSession };
  }
  if (!userBySocial) return { message: 'Invalid data fields' };
  return signInSocial({ id, userId: userBySocial._id, session });
};
