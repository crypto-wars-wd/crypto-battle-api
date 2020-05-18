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
  steps: { type: Array, default: [] },
  gameStatus: { type: String, default: 'WAITING' },
  winner: {
    playerID: { type: String },
    cryptoName: { type: String },
  },
  looser: {
    playerID: { type: String },
    cryptoName: { type: String },
  },
}, { timestamps: true });

const BattleModel = mongoose.model('Battle', BattleSchema, 'battles');

module.exports = BattleModel;
