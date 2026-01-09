import dotenv from "dotenv";

dotenv.config();

export const JwtSecret = new TextEncoder().encode(process.env.JWT_SECRET);
