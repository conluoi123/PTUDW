import jwt from "jsonwebtoken";
import ENV from "../configs/env";

function authenticateAccessToken(req, res, next) {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ message: "ACCESS TOKEN NOT FOUND" });
    }
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "ACCESS TOKEN IS EXPIRED" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "ACCESS TOKEN IS EXPIRED OR WRONG" });
  }
}

export { authenticateAccessToken };
