import express from "express";

import users from "./users";
import files from "./files";

const router = express.Router();

export default (): express.Router => {
  users(router);
  files(router);
  return router;
};
