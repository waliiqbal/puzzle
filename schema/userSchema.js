import { Schema, model } from "mongoose";
import mongoose from "mongoose";

const userSchema = new Schema({
   username: { type: String, required: true },
  avatar: { type: String, default: 'default_avatar' },
  email: { type: String, unique: true, sparse: true },
  authProvider: {
    type: String,
    enum: ['google', 'facebook', 'guest'],
    default: 'guest',
  },
  providerId: { type: String, default: null },

  // Consumables
  coins: { type: Number, default: 0 },
  hintsLeft: { type: Number, default: 0 },
  revertsLeft: { type: Number, default: 0 },

 
  // Cosmetic Selections
  themeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Theme', default: null },
  poleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pole', default: null },
  frameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Frame', default: null },

 
  // Settings
  language: { type: String, default: 'en' },
  musicOn: { type: Boolean, default: true },
  notificationsOn: { type: Boolean, default: true },
}, {
  timestamps: true
});

export { userSchema  }; // ✅ Named Export
