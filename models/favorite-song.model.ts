import mongoose from "mongoose";

const favoriteSongSchema = new mongoose.Schema(
  {
    userId: String,
    songId: String
  },
  {
    timestamps: true,
  }
);

export const FavoriteSong = mongoose.model("FavoriteSong", favoriteSongSchema, "favorite-songs");