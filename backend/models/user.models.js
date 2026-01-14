import db from "../configs/db.js";
import {v4 as uuidv4} from "uuid"

class User {
  static findUserByEmail = async (email) => {
    try {
      return await db("users").where({ email }).first();
    } catch (error) {
      throw new Error("Error finding user: " + error.message);
    }
  };
  static findUserByUsername = async (username) => {
    try {
      return await db("users").where({ username }).first();
    } catch (error) {
      throw new Error("Error finding user: " + error.message);
    }
  };
  static createNewUser = async (
    name,
    username,
    password,
    role,
    email,
    phone,
    hashRefToken
  ) => {
    try {
      const [newUser] = await db("users")
        .insert({
          id: uuidv4(),
          name,
          username,
          password,
          role,
          email,
          phone,
          refresh_token: hashRefToken,
          expires_at: new Date(Date.now() + 15 * 24 * 3600 * 1000),
        })
        .returning("*");

      return newUser;
    } catch (error) {
      throw new Error("Error creating user: " + error.message);
    }
  };

  static updateRefreshToken = async (userId, hashRefToken) => {
    try {
      return await db("users")
        .where({ id: userId })
        .update({
          refresh_token: hashRefToken,
          expires_at: new Date(Date.now() + 15 * 24 * 3600 * 1000),
        })
        .returning("*");
    } catch (error) {
      throw new Error("Error updating token: " + error.message);
    }
  };
}

export default User;
