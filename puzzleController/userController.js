import { createUserService, socialLoginService, editUserService, getUserService, getUserByIdService } from '../services/userService'

const createUser = async (req, res) => {
  try {
    const { username } = req.body;

    const { user, token } = await createUserService(req.body);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
      token,
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
    const { authProvider, token } = req.body;

    const result = await socialLoginService({ authProvider, token });

    res.status(200).json({
      success: true,
      message: "Social login successful",
      ...result,
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      message: err.message || "Social login failed",
    });
  }
};




const editUser = async (req, res) => {
  try {
    const _id = req.user.id; // 🟢 middleware se id mil rahi

    const {
      username,
      avatar,
      email,
      authProvider,
      providerId,
      coins,
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
      username,
      avatar,
      email,
      authProvider,
      providerId,
      coins,
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
      user: updatedUser,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
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






export { createUser, socialLogin, editUser, getUser, getUserById };