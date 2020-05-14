const mongoose = require('mongoose');

const { Schema } = mongoose;

const BattleSchema = new Schema({
  warriors: { type: Array },
  playersInfo: {
    cryptoNames: { type: Array },
    playersId: { type: Array },
    healthPoints: { type: Number },
  },
  steps: { type: Array },
  gameStatus: { type: String, default: 'waiting' },
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
