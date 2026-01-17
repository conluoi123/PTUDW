import User from "../models/user.models.js";
import { checkConflicUpdate, checkExistUser } from "../services/admin.services.js";
async function deleteUser(req, res) {
  const { userId } = req.params;
  try {
    const cnt = await User.deleteUser(userId);
    if (cnt === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function getUserInfo(req, res) {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }
    const user = await User.findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ message: "Get user successfully", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function addUser(req, res) {
  try {
    const { name, username, password, role, email, phone, avatar } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing require fields" });
    }
    const isExistUser = await checkExistUser(username, email);
    if (isExistUser) {
      return res.status(400).json({ error: "User is exist" });
    }
    const user = await User.createNewUser(
      name,
      username,
      password,
      role,
      email,
      phone,
      avatar,
      null
    );
    return res.status(200).json({ message: "Add user successfully", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function updateUser(req, res) {
  try {
    const { userId } = req.params;
    const { name, username, password, role, email, phone, avatar } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }
    const isConflic = await checkConflicUpdate(userId, username, email);
    if (isConflic) {
      return res.status(400).json({ error: "Username or email is exist" });
    }
    let user = await User.findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user = await User.updateUser(
      userId,
      name,
      username,
      password,
      role,
      email,
      phone,
      avatar
    );
    return res.status(200).json({ message: "Update user successfully", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getAllUsers(req, res) {
  try {
    const listUser = await User.getAllUsers();
    if (listUser.length === 0) {
      return res
        .status(200)
        .json({ message: "No users found in the system" });
    }
    return res.status(200).json({
      message: "Users retrieved successfully",
      listUser
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Lỗi lấy all user",
    });
  }
}

async function getDashboardOverview(req, res) {
  try {
    const Admin = (await import("../models/admin.models.js")).default;

    // Fetch all data in parallel using model methods
    const [stats, dailyActiveUsers, gamePopularity] = await Promise.all([
      Admin.getDashboardStats(),
      Admin.getDailyActiveUsers(),
      Admin.getGamePopularity()
    ]);

    const overview = {
      stats,
      dailyActiveUsers,
      gamePopularity
    };

    return res.status(200).json({
      message: "Dashboard overview retrieved successfully",
      data: overview
    });

  } catch (error) {
    console.error("Error in getDashboardOverview:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message
    });
  }
}

export { deleteUser, getUserInfo, addUser, updateUser, getAllUsers, getDashboardOverview };
