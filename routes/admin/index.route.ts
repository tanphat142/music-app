import { Express } from "express";
import { dashboardRoute } from "./dashboard.route";
import { systemConfig } from "../../config/system";
import { topicRoutes } from "./topic.route";
import { songRoutes } from "./song.route";
import { uploadRoutes } from "./upload.route";

export const routesAdmin = (app: Express) => {

  const path = systemConfig.prefixAdmin;

  app.use(`/${path}/dashboard`, dashboardRoute);

  app.use(`/${path}/topics`, topicRoutes);

  app.use(`/${path}/songs`, songRoutes);

  app.use(`/${path}/upload`, uploadRoutes);

}