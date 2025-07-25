
import { Schema } from 'mongoose';
import mongoose from 'mongoose';

const gameRoundSchema = new Schema({
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  roundNumber: { type: Number, required: true },
  
  // 🆕 Updated structure
  roundStats: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      roundScore: { type: Number, default: 0 },
      words: [
        {
          word: { type: String, required: true },
          score: { type: Number, required: true },
        }
      ]
    }
  ],

  // ✅ These remain as general round info
  durationSeconds: Number,
  startedAt: Date,
  endedAt: Date
});

export {gameRoundSchema}