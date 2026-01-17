import ENV from "../models/env.configs.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";
import User from "../models/user.models.js";

const client = new OAuth2Client(ENV.GOOGLE_CLIENT_ID);
async function verifyGoogleToken(idToken) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: ENV.GOOGLE_CLIENT_ID,
  });
  return ticket.getPayload();
}
function createAccessToken(user) {
  const tokenPayLoad = {
    id: user.id,
    email: user.email,
    name: user.name,
  };
  const accessToken = jwt.sign(tokenPayLoad, ENV.JWT_SECRET, {
    expiresIn: "15m",
  });
  return accessToken;
}

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function userInfoModel(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    phone: user.phone,
    username: user.username,
    role: user.role,
    streak: user.streak,
    created_at: user.created_at,
  };
}

function userProfileModel(user) {
  return {
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    phone: user.phone,
    username: user.username,
    role: user.role,
    streak: user.streak,
    created_at: user.created_at,
  };
}

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

const updateStreak = (lastDateStr, currentStreak) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (!lastDateStr) {
    return 1; 
  }
  const lastDate = new Date(lastDateStr);
  lastDate.setHours(0, 0, 0, 0);
  const diffDays =
    (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
  if (diffDays === 1) {
    return currentStreak + 1; 
  }
  if (diffDays === 0) {
    return currentStreak; 
  }
  return 1; 
};


export {
  verifyGoogleToken,
  createAccessToken,
  hashPassword,
  userInfoModel,
  userProfileModel,
  checkExistUser,
};
