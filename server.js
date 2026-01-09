import express from "express";

//custom routers
import authRouter from "./routes/auth.js";
import ideaRouter from "./routes/ideas.js";

const PORT = 3000;

//create the server
const app = express();

//using custom routers
app.use("/auth", authRouter);
app.use("/ideas", ideaRouter);

//make the server listen on a port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
