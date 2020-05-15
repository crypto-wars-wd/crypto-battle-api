const mongoose = require('mongoose');

const { Schema } = mongoose;

const BattleSchema = new Schema({
  playersInfo: {
    firstPlayer: {
      cryptoName: { type: String, required: true },
      playerID: { type: String, required: true },
      extraLife: { type: Number },
    },
    secondPlayer: {
      cryptoName: { type: String },
      playerID: { type: String },
      extraLife: { type: Number },
    },
    healthPoints: { type: Number, required: true },
  },
  steps: { type: Array },
  gameStatus: { type: String, default: 'WAITING' },
  winner: {
    playerId: { type: String },
    cryptoName: { type: String },
  },
  looser: {
    playerId: { type: String },
    cryptoName: { type: String },
  },
}, { timestamps: true });

const BattleModel = mongoose.model('Battle', BattleSchema, 'battles');

module.exports = BattleModel;
