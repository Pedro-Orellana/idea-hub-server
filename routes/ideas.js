import express from "express";
import { protect } from "../middleware/authHandler.js";

const ideaRouter = express.Router();

//create new idea function. Only for authorized users
ideaRouter.post("/", protect, async (req, res) => {
  const idea = req.body;
  const accessToken = req.headers.authorization;
  console.log(idea);
  console.log(accessToken);
});

//get all ideas function. Only for authorized users
ideaRouter.get("/", protect, async (req, res) => {});

export default ideaRouter;
