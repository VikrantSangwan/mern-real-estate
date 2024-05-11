import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import User from "../models/users.model.js";

export const test = (req, res) => {
  res.json({
    message: "Hello World",
  });
};

export const updateUser = async (req, res, next) => {
  // Checking if cookie id and url id are equal or no
  if (req.user.id != req.params.id)
    return next(errorHandler(401, "You can only update your own account"));
  try {
    // hashing the password
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    // updating the user
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          username: req.body.username,
          password: req.body.password,
          email: req.body.email,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    // removing password part from the user information
    const { password: pass, ...rest } = updatedUser._doc;

    // Sending the response
    res.status(200).json({
        success: true,
        message : 'User updated successfully!!!',
        user : rest
    });
  } catch (error) {
    next(error);
  }
};
