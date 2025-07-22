 

 import { createPurchaseService } from '../services/purchase.service'
 const userPurchase = async (req, res) => {
  try {
    const userId = req.user._id; // ✅ UserId from token
    const { itemId, purchaseType } = req.body;

    const newPurchase = await createPurchaseService(userId, itemId, purchaseType);

    return res.status(200).json({
      success: true,
      message: 'Purchase successful',
      data: newPurchase
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export {userPurchase}