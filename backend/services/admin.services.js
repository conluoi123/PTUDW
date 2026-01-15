import User from "../models/user.models.js";

const checkExistUser = async (username, email) => {
  try {
    const userByEmail = await User.findUserByEmail(email);
    if (userByEmail) return true;

    const userByUsername = await User.findUserByUsername(username);
    if (userByUsername) return true;

    return false;
  } catch (error) {
    console.error("checkExistUser error:", error);
    throw new Error("Failed to check existing user");
  }
};

export { checkExistUser };
