import User from "../models/user.models.js";
const userMiddleware = async (req, res, next) => {
  let id = "";
  if (req.body && req.body.userId) {
    const { userId } = req.body;
    id = userId;
  } else if (req.query && req.query.userId) {
    const { userId } = req.query;
    id = userId.toString();
  } else if (req.params && req.params.id) {
    id = req.params.id;
  } else if (req.user && req.user.id) {
      id = req.user.id;
  }
  const user = await User.findUserById(id);
  if (!id || !user) {
    res.status(404).json("Tài khoản không tồn tại!");
  }
  res.locals.userInfo = user;
  req.userId = user.id;
  next();
};

export { userMiddleware };
