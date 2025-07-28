import { createUserService, socialLoginService, editUserService, getUserService, getUserByIdService,  addScoreUserService, getLeaderboardService  } from '../services/userService.js'
import { uploadToS3 } from '../MiddleWear/uploadS3.js';

const createUser = async (req, res) => {
  try {
    const { deviceId } = req.body;

    const { user, token } = await createUserService(deviceId);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {user, token}
    });

  } catch (err) {
    console.error("Create User Error:", err);

    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Failed to create user",
    });
  }
};

const socialLogin = async (req, res) => {
  try {
    const { authProvider, token, socialId, name, email, deviceId  } = req.body;

    const result = await socialLoginService({ authProvider, token, socialId, name, email, deviceId });

    res.status(200).json({
      success: true,
      message: "Social login successful",
      data: result,
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      message: err.message || "Social login failed",
    });
  }
};


const uploadAppFile = async (req, res) => {
  try {
    const filePath = req.file.path;
    const s3Url = await uploadToS3(req.file);
    console.log("lokout", filePath);

    return res.status(200).json({
      message: "File Processed & Data Inserted",
      data: s3Url
    });
  } catch (error) {
    console.error("Error Processing File:", error);
    return res.status(500).json({
      message: `Error Processing File: ${error.message}`,
      error: error.message
    });
  }
};



const editUser = async (req, res) => {
  try {
    const _id = req.user.id; // 🟢 middleware se id mil rahi

    const {
      name,
      displayPic,
      email,
      authProvider,
      providerId,
      coins,
      score,
      totalScore,
      totalWin,
      longestWordCount,
      hintsLeft,
      revertsLeft,
      themeId,
      poleId,
      frameId,
      language,
      musicOn,
      notificationsOn
    } = req.body;

    const updateFields = {
      username: name,
      displayPic: displayPic,
      email,
      authProvider,
      providerId,
      coins,
      score,
      totalScore,
      totalWin,
      longestWordCount,
      hintsLeft,
      revertsLeft,
      themeId,
      poleId,
      frameId,
      language,
      musicOn,
      notificationsOn
    };

    const updatedUser = await editUserService(_id, updateFields);

    res.status(200).json({
      message: "User updated successfully",
      data: updatedUser 
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message || "Failed to update user",
    });
  }
};

const updateScore = async (req, res) => {
  try {
    const _id = req.user.id;
    const { score, coins, totalScore, totalWin, longestWordCount } = req.body;

    const payload = { score, coins, totalScore, totalWin, longestWordCount };

    const updatedUser = await addScoreUserService(_id, payload);

    return res.status(200).json({
      message: "User updated successfully",
      data: {user: updatedUser},
    });
  } catch (error) {
    console.error("Error in addScoreUser:", error.message);
    return res.status(500).json({
      error: error.message || "Failed to update user",
    });
  }
};

const getUser = async (req, res) => {
  try {
    const _id = req.user.id; 

    const user = await getUserService(_id);

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch user",
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await getUserByIdService(id);

    res.status(200).json({
      success: true,
      message: "User fetched successfully by ID",
      user,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch user",
    });
  }
};


const getLeaderboard = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const leaderboardData = await getLeaderboardService(page, limit);

    return res.status(200).json({
      message: "Leaderboard fetched successfully",
      data: leaderboardData,
    });
  } catch (error) {
    console.error("Error in getLeaderboard:", error.message);
    return res.status(500).json({
      error: "Failed to fetch leaderboard",
    });
  }
};



export { createUser, socialLogin, uploadAppFile, editUser, getUser, getUserById, updateScore, getLeaderboard };