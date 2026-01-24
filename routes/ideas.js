import express from "express";
import { protect } from "../middleware/authHandler.js";
import Idea from "../models/Idea.js";
import mongoose from "mongoose";

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

//get single idea function
ideaRouter.get("/:ideaId", protect, async (req, res, next) => {
  try {
    const { ideaId } = req.params;

    //check if ideaId is a valid id
    if (!mongoose.Types.ObjectId.isValid(ideaId)) {
      res.status(404); //not found
      throw new Error("The idea you're looking for does not exist");
    }

    const idea = await Idea.findById(ideaId);

    if (!idea) {
      res.status(404); //not found
      throw new Error("The idea you're looking for does not exist");
    }

    res.status(200).json(idea);
  } catch (err) {
    res.status(err.status);
    throw new Error(err);
  }
});

//function to edit a single idea
ideaRouter.put("/:ideaId", protect, async (req, res) => {
  try {
    const { ideaId } = req.params;

    //check if the ideaId is a valid object id
    if (!mongoose.Types.ObjectId.isValid(ideaId)) {
      res.status(404); //idea not found
      throw new Error("Idea does not exist");
    }

    //get idea from ideaId
    const idea = await Idea.findById(ideaId);
    if (!idea) {
      res.status(404); //idea not found
      throw new Error("Idea does not exist");
    }

    //make sure the user is authorized to modify this idea
    if (idea.userId !== req.user_id) {
      res.status(403); //forbidden
      throw new Error("User does not have permission to modify this idea");
    }

    //get data fields from request
    const { title, summary, description, tags } = req.body;

    if (!title || !summary || !description || !tags) {
      res.status(400); //bad request
      throw new Error("All data fields must be filled");
    }

    idea.title = title;
    idea.summary = summary;
    idea.description = description;
    idea.tags = tags;

    const updatedIdea = await idea.save();
    res
      .status(200) //ok
      .json(updatedIdea);
  } catch (err) {
    res.status(err.status);
    throw new Error(err);
  }
});

export default ideaRouter;
