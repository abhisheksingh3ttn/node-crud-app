import express from "express";
import http from "http";
import mongoose from "mongoose";
import { config } from "./config/config";
import Logging from "./lib/logging";
import router from "./routes";

const app = express();

mongoose
  .connect(config.mongo.url)
  .then(() => {
    //console.log("DB connected");
    Logging.info("Database connected successfully.");
    StartServer();
  })
  .catch((error) => Logging.error(error));

const StartServer = () => {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    next();
  });
  const server = http.createServer(app);
  server.listen(config.server.port, () =>
    Logging.info(`Server is running on port ${config.server.port}`)
  );
  app.use("/", router());
};
