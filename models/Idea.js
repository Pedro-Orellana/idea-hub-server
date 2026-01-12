import mongoose from "mongoose";

const IdeaSchema = new mongoose.Schema(
  {
    // user id to relate an idea to a creator
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    summary: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Idea = mongoose.model("Idea", IdeaSchema);

export default Idea;
