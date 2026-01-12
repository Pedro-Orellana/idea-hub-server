import User from "../models/User.js";
import { JwtSecret } from "../utils/getJWTSecret.js";
import { jwtVerify } from "jose";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      //no authorization header, throw an error
      res.status(403); //unauthorized
      throw new Error("Not authorized to get this content");
    }

    //get token
    const token = authHeader.split(" ")[1].toString();

    //get the userId from the token
    const { payload } = await jwtVerify(token, JwtSecret);

    //get user from the userId in the payload
    const user = await User.findById(payload.userId).select("_id name email");

    if (!user) {
      res.status(403); //unauthorized
      throw new Error("User not found");
    }

    //if there is a user, add the user to the request and call next
    req.user = user;
    next();
  } catch (err) {
    res.status(403);
    throw new Error("Unabled to authorize");
  }
};
