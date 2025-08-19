import mongoose from "mongoose";
import slug from "mongoose-slug-updater";
mongoose.plugin(slug);

const songSchema = new mongoose.Schema(
  {
    title: String,
    slug: {
      type: String,
      slug: "title",
      unique: true
    },
    avatar: String,
    description: String,
    singerId: String,
    topicId: String,
    like: {
      type: Number,
      default: 0
    },
    listen: {
      type: Number,
      default: 0
    },
    lyrics: String,
    audio: String,
    status: String,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

export const Song = mongoose.model("Song", songSchema, "songs");