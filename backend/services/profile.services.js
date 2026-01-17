import User from "../models/user.models.js";

async function saveUrl(optimizedUrl, userId) {
  const user = await User.findUserById(userId);
  if (!user) {
    console.log("User not found");
    return 0;
  }
  await User.updateProfile(
    user.id,
    user.name,
    optimizedUrl,
    user.phone,
    user.role,
  );
  return 1;
}
export { saveUrl };
