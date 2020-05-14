const mongoose = require('mongoose');

const { Schema } = mongoose;

const playersInfoSchema = new Schema({
  cryptoNames: { type: Array },
  playersId: { type: Array },
  healthPoints: { type: Number },
}, { _id: false });

const BattleSchema = new Schema({
  warriors: { type: Array },
  playersInfo: { type: playersInfoSchema },
  steps: { type: Array },
  gameStatus: { type: String, default: 'waiting' },
  winner: { type: Array },
  loser: { type: Array },
}, { timestamps: true });

const BattleModel = mongoose.model('Battle', BattleSchema, 'battles');

module.exports = BattleModel;
