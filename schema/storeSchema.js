import { Schema } from 'mongoose';
import mongoose from 'mongoose';

const storeSchema = new Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['coin_pack', 'hint', 'revert', 'theme', 'pole', 'frame'],
    required: true
  },
  price: { type: Number, required: true }, 
  value: { type: mongoose.Schema.Types.Mixed, required: true }, 
 
}, {
  timestamps: true
});





export { storeSchema }