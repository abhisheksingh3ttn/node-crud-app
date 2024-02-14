import express from "express";

import { getAllData, addData, deleteFileData, copyFileData } from "../controller/files";

export default (router: express.Router) => {
  router.get("/files", getAllData);
  router.post("/files/addData", addData);
  router.delete("/files/deleteData/:id", deleteFileData);
  router.get("/files/copy_file", copyFileData);
};
