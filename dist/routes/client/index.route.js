"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routesClient = void 0;
const topic_route_1 = require("./topic.route");
const song_route_1 = require("./song.route");
const routesClient = (app) => {
    app.use("/topics", topic_route_1.topicsRoute);
    app.use("/songs", song_route_1.songsRoute);
};
exports.routesClient = routesClient;
