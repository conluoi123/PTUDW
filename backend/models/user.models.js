import db from "../models/db.js";
import { v4 as uuidv4 } from "uuid";
const defaultAvatar =
  "https://res.cloudinary.com/dz9xfcbey/image/upload/f_auto,q_auto,w_400,h_400,c_fill,g_center/avatars/cb9trd7wuoebrlbdhjqj";
class User {
  static findUserByRfToken = async (refreshToken) => {
    try {
      return await db("users").where("refresh_token", refreshToken).first();
    } catch (error) {
      throw new Error("Error finding user: " + error.message);
    }
  };
  static findUserById = async (id) => {
    try {
      return await db("users").where({ id }).first();
    } catch (error) {
      throw new Error("Error finding user: " + error.message);
    }
  };
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
    avatar,
    role,
    email,
    phone,
    hashRefToken,
  ) => {
    try {
      const avatarDb = avatar || defaultAvatar;
      const [newUser] = await db("users")
        .insert({
          id: uuidv4(),
          name,
          username,
          password,
          avatar: avatarDb,
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
      const [user] = await db("users")
        .where({ id: userId })
        .update({
          refresh_token: hashRefToken,
          expires_at: new Date(Date.now() + 15 * 24 * 3600 * 1000),
        })
        .returning("*");

      return user;
    } catch (error) {
      throw new Error("Error updating token: " + error.message);
    }
  };
  static updateProfile = async (
    id,
    name,
    avatar,
    phone,
    role,
    streak,
  ) => {
    try {
      return db("users")
        .where({ id })
        .update({
          name,
          avatar,
          phone,
          role,
          streak,
        })
        .returning("*");
    } catch (error) {
      throw new Error("Error updating profile: " + error.message);
    }
  };
  static deleteUser = async (id) => {
    try {
      const cnt = await db("users").where({ id: id }).del();
      return cnt;
    } catch (error) {
      throw new Error("Error delete user: " + error.message);
    }
  };
  static updateUser = async (
    id,
    name,
    username,
    password,
    role,
    email,
    phone,
    avatar,
  ) => {
    try {
      return db("users")
        .where({ id })
        .update({
          name,
          username,
          password,
          avatar,
          phone,
          role,
          email,
        })
        .returning("*");
    } catch (error) {
      throw new Error("Error updating profile: " + error.message);
    }
  };
  static checkConflict = async (userId, username, email) => {
    const user = await db("users")
      .where((builder) => {
        builder.where({ username }).orWhere({ email });
      })
      .andWhereNot({ id: userId })
      .first();
    return !!user;
  };
  static getAllUsers = async () => {
    try {
      return await db("users").select(
        "id",
        "name",
        "username",
        "email",
        "role",
        "avatar",
        "phone",
        "created_at",
      );
    } catch (error) {
      throw new Error("Error fetching users: " + error.message);
    }
  };
  static getTotalGamesPlayed = async (userId) => {
    try {
      const result = await db("game_sessions")
        .where({ user_id: userId })
        .count("id as total");

      return parseInt(result[0].total);
    } catch (error) {
      console.error("Lỗi khi đếm số game:", error);
      return 0;
    }
  };
}

export default User;
