import express from "express";
import { protect } from "../middleware/authHandler.js";
import Idea from "../models/Idea.js";

const ideaRouter = express.Router();

//create new idea function. Only for authorized users
ideaRouter.post("/", protect, async (req, res, next) => {
  try {
    const { title, summary, description, tags } = req.body;

    //return if for some reason data is not provided
    if (!title || !summary || !description || !tags) {
      res.status(404); //not all data found
      throw new Error("All data must be provided");
    }

    //create a new idea from data provided
    const newIdea = await Idea.create({
      userId: req.user._id,
      title,
      summary,
      description,
      tags,
    });

    //send a response to the frontend
    res.status(201); //created new resource
    res.json(newIdea);
  } catch (err) {
    next(err);
  }
});

//get all ideas function. Only for authorized users
ideaRouter.get("/", protect, async (req, res) => {
  try {
    const limit = parseInt(req.query._limit);

    //get all ideas, sorted from the newest one to the oldest one
    const allIdeasQuery = Idea.find().sort({ createdAt: -1 });

    //apply the limit to the query
    if (!isNaN(limit)) {
      allIdeasQuery.limit(limit);
    }

    const ideas = await allIdeasQuery.exec();
    res.status(200).json(ideas);
  } catch (err) {
    res.status(500); //internal error
    throw new Error("Something went wrong and could not get all ideas");
  }
});

export default ideaRouter;
