import express from "express";

import {
  getAllUsers,
  deleteUser,
  updateUser,
  addUser,
} from "../controller/users";

export default (router: express.Router) => {
  router.get("/users", getAllUsers);
  router.delete("/users/:id", deleteUser);
  router.patch("/users/:id", updateUser);
  router.put("/users", addUser);
};
