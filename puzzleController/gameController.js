import { createFriendGameService, joinGameService, startGameService,endRoundService  } from '../services/gameService.js'
const initiateFriendsGame = async (req, res) => {
  try {
    const creatorId = req.user.id;
    const { invitedUserIds, } = req.body;

    const { gameId, payload } = await createFriendGameService(creatorId, invitedUserIds);

    return res.status(201).json({
      message: 'Game created successfully',
      gameId,
      payload
    });

  } catch (error) {
    console.error('Error in controller:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

const joinGameController = async (req, res) => {
  try {
    
    const {userId , gameId } = req.body;

    const result = await joinGameService(userId, gameId);
    return res.status(200).json({ success: true, message: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const startGame = async (req, res) => {
  try {
    const result = await startGameService(req);

    return res.status(200).json({
      success: true,
      ...result   
    });
  } catch (error) {
    console.error('Error in startGameController:', error.message);

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const roundEnd = async (req, res) => {
  try {
    const result = await endRoundService(req);

    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};



export {initiateFriendsGame, joinGameController, startGame, roundEnd}