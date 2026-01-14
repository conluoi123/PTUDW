//https://accounts.google.com/o/oauth2/v2/auth?client_id=329995792104-sbn88825k2gvqtur01e5giepd0uafli9.apps.googleusercontent.com&redirect_uri=https://israel-ramose-premeditatingly.ngrok-free.dev/api/user/login/google/callback&response_type=code&scope=email%20profile&access_type=offline&prompt=select_account
import ENV from "../configs/env.configs.js";
import crypto from "crypto";
import { verifyGoogleToken, createAccessToken } from "../services/user.services.js";
import axios from "axios";
import User from "../models/user.models.js";

// Register
async function Register(req, res) {
  
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
      path: "/"
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
  const { username, password } = req.body;
  
}
export {
  SignInWithGG,
  DirectGoogle,
  Login
};