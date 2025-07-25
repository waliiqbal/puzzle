import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const gameSchema = new Schema({
  mode: {
    type: String,
    enum: ['single', 'multiplayer'],
    required: true
  },
  status: {
    type: String,
    enum: ['waiting', 'in_progress', 'completed'],
    default: 'waiting'
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  winnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  matchType: {
    type: String,
    enum: ['friend', 'random'],
    required: function () {
      return this.mode === 'multiplayer';
    }
  },
  invitedUserIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  startedAt: Date,
  endedAt: Date
}, {
  timestamps: true
});

export { gameSchema }
