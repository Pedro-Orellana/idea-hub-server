import express from "express";

const authRouter = express.Router();

//register new user function

authRouter.post("/register", (req, res) => {
  const data = req.body;
  console.log(data);
  res.json({
    message: "successfully created a new user!",
  });
});

//user login function
authRouter.post("/login", (req, res) => {
  const data = req.body;
  console.log(data);
  res.sendStatus(200);
});

export default authRouter;
