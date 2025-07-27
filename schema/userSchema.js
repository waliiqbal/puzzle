import { Schema, model } from "mongoose";
import mongoose from "mongoose";

const userSchema = new Schema({
   username: { type: String, required: true },
  displayPic: { type: String, default: 'default_avatar' },
  email: { type: String, unique: true, sparse: true },
  authProvider: {
    type: String,
    enum: ['google', 'facebook', 'apple', 'guest'],
    default: 'guest',
  },
  providerId: { type: String, default: null },
  deviceId: { type: String, default: null },
  // Consumables
  coins: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  totalScore: { type: Number, default: 0 },
  totalWin: { type: Number, default: 0 },
  longestWordCount: { type: Number, default: 0 },
  hintsLeft: { type: Number, default: 0 },
  revertsLeft: { type: Number, default: 0 },

 
  // Cosmetic Selections
  themeId: { type: mongoose.Schema.Types.ObjectId, ref: 'store', default: null },
  poleId: { type: mongoose.Schema.Types.ObjectId, ref: 'store', default: null },
  frameId: { type: mongoose.Schema.Types.ObjectId, ref: 'store', default: null },

 
  // Settings
  language: { type: String, default: 'en' },
  musicOn: { type: Boolean, default: true },
  notificationsOn: { type: Boolean, default: true },
}, {
  timestamps: true
});



export { userSchema  }; 
