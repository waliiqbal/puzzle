
import { Schema } from 'mongoose';
import mongoose from 'mongoose';


const PurchaseSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StoreItem',
    required: true
  },
  itemType: {
    type: String,
    enum: ['hint', 'revert', 'theme', 'pole', 'frame', 'coin_pack'],
    required: true
  },
  priceAtPurchase: {
    type: Number,
    required: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  purchasedAt: {
    type: Date,
    default: Date.now
  },

  purchaseType: {
    type: String,
    enum: ['coins', 'inAppPurchase'], 
    required: true
  },
});

export {PurchaseSchema }