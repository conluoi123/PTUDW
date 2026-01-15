import User from "../models/user.models.js";
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

export {deleteUser, getUserInfo}