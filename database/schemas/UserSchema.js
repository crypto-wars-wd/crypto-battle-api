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
  email: {
    type: String, index: true, unique: true, required: true,
  },
  level: { type: Number, default: 1 },
  health: { type: Number, default: 100 },
  alias: { type: String },
  avatar: { type: String },
  auth: { type: UserAuthSchema },
}, { timestamps: true });

const UserModel = mongoose.model('User', UserSchema, 'User');

module.exports = UserModel;
