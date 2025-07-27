import { model } from 'mongoose';
import axios from "axios";
import { OAuth2Client } from "google-auth-library";
import { userSchema } from '../schema/userSchema.js'
const userData = model('User', userSchema);
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config(); 




const generateGuestUsername = () => {
  return `guest${Math.floor(1000 + Math.random() * 9000)}`;
};


const createUserService = async (deviceId) => {
  const finalUsername = generateGuestUsername();

  const existingUser = await userData.findOne({ deviceId: deviceId });

  if (existingUser) {
      const token = jwt.sign(
        { id: existingUser._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "365d" }
      );

      return { user: existingUser, token };
    

    // const err = new Error("Username is already taken by a guest");
    // err.statusCode = 409;
    // throw err;
  }


  const newUser = new userData({
    username: finalUsername,
    authProvider: "guest",
    deviceId: deviceId
  });

  await newUser.save();

  const token = jwt.sign(
    { id: newUser._id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "365d" }
  );

  return { user: newUser, token };
};


const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ✅ Social Login Service
const socialLoginService = async ({
  authProvider,
  token,
  socialId,
  name,
  email,
  deviceId
}) => {
  // 1) Normalize social profile data
  if (authProvider === "google") {
    // const ticket = await googleClient.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID });
    // const payload = ticket.getPayload();
    // socialId = payload.sub;
    // email    = payload.email;
    // name     = payload.name;
  }
  else if (authProvider === "facebook") {
    // const fbRes = await axios.get(`https://graph.facebook.com/me?fields=id,name,email&access_token=${token}`);
    // socialId = fbRes.data.id;
    // email    = fbRes.data.email;
    // name     = fbRes.data.name;
  }
  else if (authProvider === "apple") {
    // …similar…
  }
  else {
    throw new Error("Unsupported auth provider");
  }

  let user;

  // 2) Try to find by deviceId first
  if (deviceId) {
    user = await userData.findOne({ deviceId: deviceId });
    if (user) {
      // link the social account
      user.authProvider = authProvider;
      user.providerId   = socialId;
      user.username     = user.username || name;
      user.email        = user.email    || email;
      await user.save();
    }
  }

  // 3) If no user by device, find (or create) by social provider
  if (!user) {
    user = await userData.findOne({ providerId: socialId, authProvider });
    if (!user) {
      user = new userData({
        deviceId,
        authProvider,
        providerId: socialId,
        username:   name,
        email
      });
      await user.save();
    }
  }

  // 4) Issue a JWT (1‑year expiry)
  const jwtToken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "365d" }
  );

  return { user, token: jwtToken };
};

const addScoreUserService = async (userId, payload) => {
  try {
    const updateData = {
      $inc: { score: payload.score }, // ✅ Auto-increment score
      $set: {
        totalScore: payload.totalScore,
        totalWin: payload.totalWin,
        longestWordCount: payload.longestWordCount,
      },
    };

    const updatedUser = await userData.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return updatedUser;
  } catch (error) {
    throw new Error(error.message || "Failed to update user");
  }
};

const editUserService = async (_id, updateFields) => {
  if (!_id) {
    const error = new Error("User ID is required");
    error.statusCode = 400;
    throw error;
  }

  const updatedUser = await userData.findByIdAndUpdate(
    _id,
    updateFields,
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return {user: updatedUser};
};

const getUserService = async (_id) => {
  if (!_id) {
    const error = new Error("User ID is required");
    error.statusCode = 400;
    throw error;
  }

  const user = await userData.findById(_id)

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

const getUserByIdService = async (_id) => {
  if (!_id) {
    const error = new Error("User ID is required");
    error.statusCode = 400;
    throw error;
  }

  const user = await userData.findById(_id).select("-__v");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};


const getLeaderboardService = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const users = await userData.find({})
    .sort({ totalScore: -1 }) // 🔥 highest totalScore first
    .skip(skip)
    .limit(limit)
    .select("userName email displayPic totalWin score totalScore longestWordCount");

  const totalUsers = await userData.countDocuments();

  return {
    users,
    totalUsers,
    totalPages: Math.ceil(totalUsers / limit),
    page,
    limit,
  };
};


export { createUserService, socialLoginService, editUserService, getUserService, getUserByIdService,  addScoreUserService, getLeaderboardService  };