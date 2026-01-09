import { SignJWT } from "jose";
import { JwtSecret } from "./getJWTSecret.js";

export default generateToken = async (payload, expiresIn = "15m") => {
  const token = await new SignJWT(payload)
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JwtSecret);

  return token;
};
