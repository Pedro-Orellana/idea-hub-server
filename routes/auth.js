import express from "express";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { jwtVerify } from "jose";
import { JwtSecret } from "../utils/getJWTSecret.js";

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

    const tokenPayload = { userId: newUser._id.toString() };

    const accessToken = await generateToken(tokenPayload, "1m");
    const refreshToken = await generateToken(tokenPayload, "30d");

    //send the refreshToken as a cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.status(201).json({
      accessToken,
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

    const tokenPayload = { userId: user._id.toString() };

    const accessToken = await generateToken(tokenPayload, "1m");
    const refreshToken = await generateToken(tokenPayload, "30d");

    //set refresh token in an http only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(200).json({
      accessToken,
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

//logout function
authRouter.post("/logout", (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(200).json({
    message: "Logged out successfully",
  });
});

//refresh token function
authRouter.post("/refresh", async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      res.status(403);
      throw new Error("No refresh token found");
    }

    //get userId from refresh token
    const { payload } = await jwtVerify(refreshToken, JwtSecret);
    const userId = payload.userId;

    //get user from userId
    const foundUser = await User.findById(userId);
    if (!foundUser) {
      res.status(404);
      throw new Error("User does not exist");
    }

    //create new access token with the found user
    const newPayload = { userId: foundUser._id.toString() };
    const newToken = await generateToken(newPayload, "1m");

    res.status(200).json({
      accessToken: newToken,
      user: {
        id: foundUser._id,
        name: foundUser.name,
        email: foundUser.email,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default authRouter;
