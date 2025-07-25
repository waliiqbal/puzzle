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


const createUserService = async (body) => {
  const { username } = body;
  const finalUsername = username || generateGuestUsername();

  const existingUser = await userData.findOne({ username: finalUsername });

  if (existingUser) {
    if (["google", "facebook"].includes(existingUser.authProvider)) {
      const token = jwt.sign(
        { id: existingUser._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "7d" }
      );

      return { user: existingUser, token };
    }

    const err = new Error("Username is already taken by a guest");
    err.statusCode = 409;
    throw err;
  }


  const newUser = new userData({
    username: finalUsername,
    authProvider: "guest",
  });

  await newUser.save();

  const token = jwt.sign(
    { id: newUser._id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );

  return { user: newUser, token };
};


const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ✅ Social Login Service
const socialLoginService = async ({ authProvider, token }) => {
  let socialId, email, name;

  if (authProvider === "google") {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    socialId = payload.sub;
    email = payload.email;
    name = payload.name;
  }

  else if (authProvider === "facebook") {
    const fbRes = await axios.get(
      `https://graph.facebook.com/me?fields=id,name,email&access_token=${token}`
    );

    socialId = fbRes.data.id;
    email = fbRes.data.email;
    name = fbRes.data.name;
  }

  else {
    throw new Error("Unsupported auth provider");
  }

  let user = await userData.findOne({ providerId: socialId, authProvider });

  // ❗FIXED: Use userData instead of User
  if (!user) {
    user = new userData({
      username: name,
      email,
      authProvider,
      providerId: socialId,
    });

    await user.save();
  }

  const jwtToken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );

  return { user, token: jwtToken };
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

  return updatedUser;
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

export { createUserService, socialLoginService, editUserService, getUserService, getUserByIdService };