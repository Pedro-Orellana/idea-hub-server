import express from "express";
import cors from "cors";

//custom routers
import authRouter from "./routes/auth.js";
import ideaRouter from "./routes/ideas.js";

//import db connection function
import { connectDB } from "./config/db.js";

const PORT = 3000;

//create the server
const app = express();

//connnect to mongoDB
connectDB();

const allowedOrigins = ["http://localhost:5173"];

//neccessary middleware
app.use(cors(allowedOrigins));
app.use(express.json());

//using custom routers
app.use("/auth", authRouter);
app.use("/ideas", ideaRouter);

//make the server listen on a port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
