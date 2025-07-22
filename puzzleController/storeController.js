import { createStore, getAllStores } from '../services/storeService'
 const createStoreItem = async (req, res) => {
  try {
    const result = await createStore(req.body); 
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getAllStoreItems = async (req, res) => {
  try {
    const result = await getAllStores();
    res.status(200).json(result); // 200 OK
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export {createStoreItem, getAllStoreItems}