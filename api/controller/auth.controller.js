import User from "../models/users.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  // Generating the hash value of password through bcryptjs
  const hashPassword = bcryptjs.hashSync(password, 10);

  // Creating new user with hash password
  const newUser = new User({ username, email, password: hashPassword });

  // Saving the user
  try {
    await newUser.save();
    res.status(201).json("User created successfully!!");
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // Validating the users credentials
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found")); // generating new error from utils
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials!!")); // generating new error from utils

    // Generating the token using jwt
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    // selecting only limited details to send as a response.
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (err) {
    next(err);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    console.log(user);
    if (!user) {
      // Generate a random password;
      const generatePassword = Math.random().toString(36).slice(-8);
      const hashPassword = bcryptjs.hashSync(generatePassword, 10);
      const username =
        req.body.name.split(" ").join("").toLowerCase() +
        Math.random().toString(36).slice(-4);
      const newUser = new User({
        username: username,
        email: req.body.email,
        password: hashPassword,
        avatar : req.body.photo
      });
      await newUser.save();
      const token = jwt.sign({id : newUser.id}, process.env.JWT_SECRET);
      const {password : pass, ...rest} = newUser._doc;
      res.cookie("access_token", token, {httpOnly : true}).status(200).json(rest);
    } else {
      // create a token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been logout!!');
  } catch (error) {
    next(error);
  }
}
