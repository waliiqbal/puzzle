import { model } from 'mongoose';
import { storeSchema } from '../schema/storeSchema.js'
const storeData = model('store', storeSchema);
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config(); 
 const createStore = async (Data) => {
  try {
    const newStore = new storeData(Data); 
    await newStore.save();

    return {
      success: true,
      message: 'Store item created successfully',
      data: newStore
    };
  } catch (error) {
    throw new Error('Error while creating store item: ' + error.message);
  }
};

const getAllStores = async () => {
  try {
    const stores = await storeData.find(); 
    return {
      success: true,
      message: 'Store items fetched successfully',
      data: stores
    };
  } catch (error) {
    throw new Error('Error while fetching store items: ' + error.message);
  }
};
export {createStore, getAllStores}
