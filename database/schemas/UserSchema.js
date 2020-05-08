const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserAuthSchema = new Schema({
  id: { type: String },
  provider: { type: String },
  sessions: [{
    sid: { type: String, required: true },
    secretToken: { type: String, required: true },
  }],
}, { _id: false });

const UserSchema = new Schema({
  name: {
    type: String, index: true, unique: true, required: true,
  },
  level: { type: Number, default: 1 },
  health: { type: Number, default: 100 },
  alias: { type: String },
  email: { type: String },
  avatar: { type: String },
  objectsFollow: { type: [String], default: [] }, // arr of author_permlink of objects what user following
  usersFollow: { type: [String], default: [] }, // arr of users which user follow
  auth: { type: UserAuthSchema },
  followersCount: { type: Number, default: 0 },
}, { timestamps: true });

const UserModel = mongoose.model('User', UserSchema, 'User');

module.exports = UserModel;
