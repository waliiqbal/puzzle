import { model } from 'mongoose';
import { gameSchema } from '../schema/gameSchema.js'
const gameData = model('game', gameSchema);
import { userSchema } from '../schema/userSchema.js'
const userData = model('User', userSchema);
import { gameRoundSchema } from '../schema/roundSchema.js'
const roundData = model('round', gameRoundSchema);
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config(); 

const createFriendGameService = async (creatorId, invitedUserIds, ) => {
  // Create new game
  const newGame = await gameData.create({
    mode: 'multiplayer',
    matchType: 'friend',
    creatorId,
    invitedUserIds,
    players: [creatorId]
  });

  // Find creator’s username
  const creator = await userData.findById(creatorId);
  if (!creator) {
    throw new Error('Creator not found');
  }

  const payload = {
    gameId: newGame._id,
    creatorUsername: creator.username
  };

  // ✅ No push notification here

  return { gameId: newGame._id, payload };
};

const joinGameService = async (userId, gameId) => {
  const game = await gameData.findById(gameId);

  if (!game) {
    throw new Error('Game not found');
  }


  if (game.players.includes(userId)) {
    throw new Error('User already joined this game');
  }


  game.players.push(userId);
  await game.save();

  return 'User successfully joined the game';
};


const startGameService = async (req) => {
  const { gameType, userIds, gameId, matchType } = req.body;

  // ✅ SINGLE PLAYER GAME
  if (gameType === 'single') {

    const newGame = await gameData.create({
      gameType: 'single',
      players: userIds,
      status: 'in-progress',
    });

    await roundData.create({
      gameId: newGame._id,
      roundNumber: 1,
      startedAt: new Date()
    });

    return {
      message: 'Single player game created.',
      gameId: newGame._id,
    };
  }

  // ✅ MULTI PLAYER GAME
  if (gameType === 'multiplayer') {
    if (matchType === 'friend') {
      if (!gameId) {
        throw new Error('Game ID is required for friend match');
      }

      const existingGame = await gameData.findById(gameId);
      if (!existingGame) {
        throw new Error('Game not found');
      }

      const playersInDb = existingGame.players.map(id => id.toString()).sort();
      const playersInReq = userIds.map(id => id.toString()).sort();

      const isSamePlayers =
        playersInDb.length === playersInReq.length &&
        playersInDb.every((val, index) => val === playersInReq[index]);

      if (!isSamePlayers) {
        throw new Error('Players do not match with the game');
      }

      existingGame.status = 'in_progress';
      await existingGame.save();

      await roundData.create({
        gameId: existingGame._id,
        roundNumber: 1,
        startedAt: new Date()
      });

      return {
        message: 'All invited players joined this match',
        gameId: existingGame._id,
      };
    }

    if (matchType === 'random') {
      const newGame = await gameData.create({
        gameType: 'multiplayer',
        matchType: 'random',
        players: userIds,
        status: 'in_progress',
      });

      await roundData.create({
        gameId: newGame._id,
        roundNumber: 1,
        startedAt: new Date()
      });

      return {
        message: 'Random multiplayer game created.',
        gameId: newGame._id,
      };
    }
  }

  throw new Error('Invalid gameType or missing required data');
};


 const endRoundService = async (req) => {
  const { gameId, roundNumber, roundStats } = req.body;

  const round = await roundData.findOne({ gameId, roundNumber });

  if (!round) {
    throw new Error('Round not found for the given game and round number');
  }

  // ✅ Set endedAt
  round.endedAt = new Date();

  if (round.startedAt) {
    const duration = Math.floor((round.endedAt - round.startedAt) / 1000);
    round.durationSeconds = duration;
  }

  // ✅ Save roundStats instead of roundData
  round.roundStats = roundStats;

  await round.save();

   const newRound = new roundData({
    gameId,
    roundNumber: roundNumber + 1
   
  });

  await newRound.save();

  return {
    message: 'Round ended successfully',
    roundId: round._id,
    durationSeconds: round.durationSeconds,
    roundStats: round.roundStats
  };
};




export { createFriendGameService, joinGameService, startGameService, endRoundService}