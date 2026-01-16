//https://accounts.google.com/o/oauth2/v2/auth?client_id=329995792104-sbn88825k2gvqtur01e5giepd0uafli9.apps.googleusercontent.com&redirect_uri=http://localhost:3000/api/user/login/google/callback&response_type=code&scope=email%20profile&access_type=offline&prompt=select_account
import ENV from "../models/env.configs.js";
import crypto from "crypto";
import {
  verifyGoogleToken,
  createAccessToken,
  hashPassword,
  userInfoModel,
  userProfileModel,
  checkExistUser, // Added import
} from "../services/user.services.js";
import axios from "axios";
import User from "../models/user.models.js";

const defaultAvatar =
  "https://res.cloudinary.com/dz9xfcbey/image/upload/f_auto,q_auto,w_400,h_400,c_fill,g_center/avatars/cb9trd7wuoebrlbdhjqj";

// Register
async function Register(req, res) {
  try {
    const { name, username, password, role, email, phone } = req.body;
    if (!username || !password || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const isExistUser = await checkExistUser(username, email);
    if (isExistUser) {
      return res.status(400).json({ error: "User is exist. Please modify email or username" });
    }
    const hashPass = hashPassword(password);
    const user = await User.createNewUser(
      name,
      username,
      hashPass,
      defaultAvatar,
      role,
      email,
      phone,
      null
    );
    const userInfo = userInfoModel(user);
    return res.status(200).json({ message: "Register successfully", userInfo });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// GG
function DirectGoogle(req, res) {
  const state = crypto.randomBytes(16).toString("hex");
  req.session.oauthState = state;
  req.session.save((Error) => {
    if (Error) {
      console.error("Session save error:", Error);
      return res.status(500).json({ error: "Session error" });
    }

    const param = new URLSearchParams({
      client_id: ENV.GOOGLE_CLIENT_ID,
      redirect_uri: ENV.BACKEND_URL + ENV.GOOGLE_REDIRECT_URL,
      response_type: "code",
      scope: "email profile openid",
      state: state,
    });

    const ggLoginURL = `${ENV.GOOGLE_LOGIN_URL}?${param.toString()}`;
    return res.redirect(ggLoginURL);
  });
}

async function SignInWithGG(req, res) {
  try {
    const codeUser = req.query.code;
    if (!codeUser)
      return res.status(400).json({ error: "Missing code redirect_uri" });

    const stateReturn = req.query.state;
    const savedState = req.session.oauthState;

    if (!stateReturn || stateReturn !== savedState) {
      if (req.session) {
        await new Promise((resolve) => req.session.destroy(resolve));
        res.clearCookie("connect.sid");
      }
      return res
        .status(403)
        .json({ error: "State is not suitable, CSRF attack detected." });
    }
    if (req.session) {
      await new Promise((resolve) => req.session.destroy(resolve));
      res.clearCookie("connect.sid");
    }
    const reqGgToken = await axios.post("https://oauth2.googleapis.com/token", {
      code: codeUser,
      client_id: ENV.GOOGLE_CLIENT_ID,
      client_secret: ENV.GOOGLE_SECRET_ID,
      redirect_uri: ENV.BACKEND_URL + ENV.GOOGLE_REDIRECT_URL,
      grant_type: "authorization_code",
    });

    const { id_token: ggIdToken } = reqGgToken.data;

    if (!ggIdToken) return res.status(400).json({ error: "Missing id_token" });
    const ggUser = await verifyGoogleToken(ggIdToken);

    const userData = {
      email: ggUser.email,
      name: ggUser.name,
      avatar: ggUser.picture,
    };

    let user = await User.findUserByEmail(userData.email);
    const refToken = crypto.randomBytes(64).toString("hex");
    const hashRefToken = crypto
      .createHash("sha256")
      .update(refToken)
      .digest("hex");
    if (!user) {
      const newUser = await User.createNewUser(
        userData.name,
        userData.email || email.split("@")[0],
        null,
        userData.avatar ? userData.avatar : defaultAvatar,
        "user",
        userData.email,
        null,
        hashRefToken
      );
      user = newUser;
    } else {
      user = await User.updateRefreshToken(user.id, hashRefToken);
    }

    const accessToken = createAccessToken(user);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 24 * 3600 * 1000,
      path: "/",
    });

    res.cookie("refreshToken", refToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none", // none là fe và be không cùng 1 url nếu cùng thì là "strict"
      maxAge: 15 * 24 * 3600 * 1000,
      path: "/",
    });

    return res.redirect(`${ENV.FRONTEND_URL}/home`);
  } catch (err) {
    console.log(err);
    return res
      .status(401)
      .json({ error: "Cannot Sign In/ Sign Up with Google" });
  }
}

// Login
async function Login(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    let user = await User.findUserByUsername(username);
    if (!user) {
      user = await User.findUserByEmail(username);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
    }
    const hash = hashPassword(password);
    if (user.password !== hash) {
      return res.status(401).json({ error: "Password is wrong" });
    }
    const refToken = crypto.randomBytes(64).toString("hex");
    const hashRefToken = crypto
      .createHash("sha256")
      .update(refToken)
      .digest("hex");
    user = await User.updateRefreshToken(user.id, hashRefToken);
    const accessToken = createAccessToken(user);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 24 * 3600 * 1000,
      path: "/",
    });

    res.cookie("refreshToken", refToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none", // none là fe và be không cùng 1 url nếu cùng thì là "strict"
      maxAge: 15 * 24 * 3600 * 1000,
      path: "/",
    });
    const userInfo = userInfoModel(user);
    return res.status(200).json({ message: "Login successfully", userInfo });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function Logout(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const hashRefreshToken = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");
      const user = await User.findUserByRfToken(hashRefreshToken);
      if (user) {
        await User.updateRefreshToken(user.id, null);
      }
    }

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    return res.status(200).json({
      message: "Logout successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Logout failed",
    });
  }
}

async function getProfile(req, res) {
  try {
    const email = req.user.email;
    const user = await User.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const profile = userProfileModel(user);
    return res
      .status(200)
      .json({ message: "Get profile successfully", profile });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Get profile failed",
    });
  }
}

async function updateProfile(req, res) {
  try {
    const { name, avatar, phone, role } = req.body;
    const emailDb = req.user.email;
    const user = await User.findUserByEmail(emailDb);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const update = await User.updateProfile(req.user.id, name, avatar, phone, role);
    const profile = userProfileModel(update);
    return res.status(200).json({ message: "Update profile successfully", profile })
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Update profile failed",
    });
  }
}

const authMe = async (req, res) => {
  try {
    const user = await User.findUserByEmail(req.user.email);
    if (!user) {
      return res.status(404).json("Tài khoản không tồn tại!");
    }
    const data = {
      userId: user._id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
    };
    return res.status(200).json({ data });
  } catch (error) {
    console.error("Error when get user");
  }
};

async function refreshAccessToken(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is wrong" });
    }

    const hashRefreshToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    const user = await User.findUserByRfToken(hashRefreshToken);
    if (!user) {
      return res
        .status(401)
        .json({ message: "refresh token is expired or wrong" });
    }
    const newRefreshToken = crypto.randomBytes(64).toString("hex");
    const newHashRefreshToken = crypto
      .createHash("sha256")
      .update(refToken)
      .digest("hex");
    await User.updateRefreshToken(user.id, newHashRefreshToken);
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 24 * 3600 * 1000,
      path: "/",
    });
    const newAccessToken = createAccessToken(user);
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 24 * 3600 * 1000,
      path: "/",
    });
    return res.status(200).json({ message: "Refresh successfully" });
  } catch (error) {
    console.log("REFRESH TOKEN IS EXPIRED OR WRONG", error);
    return res
      .status(401)
      .json({ message: "REFRESH TOKEN IS EXPIRED OR WRONG" });
  }
}

const findUserByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Please provide an email" });
    }
    const user = await User.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Only return safe public info
    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export { SignInWithGG, DirectGoogle, Login, Register, Logout, getProfile, updateProfile, authMe, refreshAccessToken, findUserByEmail };