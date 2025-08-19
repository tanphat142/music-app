import { Express } from "express";
import { topicsRoute } from "./topic.route";
import { songsRoute } from "./song.route";

export const routesClient = (app: Express) => {

  app.use("/topics", topicsRoute);

  app.use("/songs", songsRoute);

}