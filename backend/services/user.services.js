import ENV from "../configs/env.configs.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto"


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

export {verifyGoogleToken, createAccessToken, hashPassword}
