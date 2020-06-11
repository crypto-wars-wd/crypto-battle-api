const {
  signUpSocial,
  signInSocial,
  findOneSelect,
} = require('models/userModel');
const { generateSession } = require('./sessions');

exports.socialAuth = async ({
  alias, provider, avatar, id, postLocales,
}) => {
  const { user: userBySocial } = await findOneSelect({
    condition: { 'auth.provider': provider, 'auth.id': id },
    select: '+auth',
  });
  const session = generateSession();

  if (!userBySocial) {
    const { user, session: existSession, error } = await signUpSocial({
      alias, avatar, provider, id, session, postLocales,
    });
    return { error, user, session: existSession };
  }
  if (!userBySocial) return { message: 'Invalid data fields' };
  return signInSocial({ id, userId: userBySocial._id, session });
};
