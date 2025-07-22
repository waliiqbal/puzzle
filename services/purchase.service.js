import { model } from 'mongoose';
import { storeSchema } from '../schema/storeSchema.js'
const storeData = model('store', storeSchema);
import { userSchema } from '../schema/userSchema.js'
const userData = model('user', userSchema);
import { PurchaseSchema } from "../schema/purchaseSchema.js"
const purchaseData = model('purchase', PurchaseSchema);
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config(); 

const createPurchaseService = async (userId, itemId, purchaseType) => {
  const item = await storeData.findById(itemId);
  if (!item) {
    throw new Error('Item not found');
  }

  const user = await userData.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const itemType = item.type;
  const price = item.price;
  const value = item.value;

 
  const isCosmetic = ['theme', 'pole', 'frame'].includes(itemType);

  if (isCosmetic) {
    const alreadyPurchased = await purchaseData.findOne({
      userId,
      itemId,
      itemType
    });

    if (alreadyPurchased) {
      throw new Error('You have already purchased this item');
    }
  }

  
  if (purchaseType === 'coins') {
    if (itemType === 'coin_pack') {
      throw new Error("Coin packs can't be purchased with coins");
    }

    if (user.coins < price) {
      throw new Error('Not enough coins');
    }

    user.coins -= price;
  }

  if (purchaseType === 'inAppPurchase' && itemType === 'coin_pack') {
    user.coins += value;
  }

  if (itemType === 'hint') {
    user.hintsLeft += value;
  }

  if (itemType === 'revert') {
    user.revertsLeft += value;
  }


  if (itemType === 'theme') {
    user.themeId = item._id;
  }

  if (itemType === 'pole') {
    user.poleId = item._id;
  }

  if (itemType === 'frame') {
    user.frameId = item._id;
  }

  await user.save();

  const newPurchase = new purchaseData({
    userId: user._id,
    itemId: item._id,
    itemType,
    priceAtPurchase: price,
    value,
    purchaseType
  });

  await newPurchase.save();

  return newPurchase;
};



export {createPurchaseService}