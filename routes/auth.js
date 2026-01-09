import express from "express";
import User from "../models/User.js";

const authRouter = express.Router();

//register new user function

authRouter.post("/register", async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    //make sure all information is passed
    if (!name || !email || !password) {
      res.status(400); //bad request
      throw new Error("Fill out the form completely to register a user");
    }

    //make sure there is no existing user with this email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400); //bad request
      throw new Error("User already exists");
    }

    //create new user
    const newUser = await User.create({ name, email, password });
    //TODO(create the tokens and pass them)
    res.status(201).json({
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    next(err);
  }
});

//user login function
authRouter.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    //make sure all data is passed to the request
    if (!email || !password) {
      res.status(400); //bad request
      throw new Error("Both email and passord are required");
    }

    //make sure there is a created user
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error("No user registered with these credentials");
    }

    //make sure the password matches
    const isMatch = await user.matchPasswords(password);
    if (!isMatch) {
      res.status(404);
      throw new Error("Invalid credentials");
    }
    //this is where we get information from database
    //send access token
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default authRouter;
