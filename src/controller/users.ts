import express from "express";
import Logging from "../lib/logging";
import {
  deleteUserById,
  getUsers,
  getUserById,
  getUserByEmail,
  createUser,
} from "../models/users";
import { authentication, random } from "../lib/auth";

export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const users = await getUsers();

    return res.status(200).json(users);
  } catch (error) {
    Logging.error(error);
    return res.sendStatus(400);
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    const deletedUser = await deleteUserById(id);

    return res.json({'message': 'User deleted','deleted_user':deletedUser});
  } catch (error) {
    Logging.error(error);
    return res.sendStatus(400);
  }
};

export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    //console.log(req.body);
    const { name, phone, username } = req.body;

    if (!(username || phone || name)) {
        return res.status(400).json({'message':'Invalid argument (invalid request payload)'});
    }
    const user = await getUserById(id);
    if(name) user.name = name;
    if(phone) user.phone = phone;
    if(username) user.username = username;
    //console.log(user);
    await user.save();

    return res.status(200).json(user).end();
  } catch (error) {
    Logging.error(error);
    return res.sendStatus(400);
  }
};

export const addUser = async (req: express.Request, res: express.Response) => {
  try {
    const { name, email, phone, password, username } = req.body;
    if (!name || !email || !phone || !password || !username) {
      return res.status(400).json({'message':'Invalid argument (invalid request payload)'});
    }
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({'message':'User already exists, please try with other email.'});
    }

    const salt = random();
    const user = await createUser({
      name,
      email,
      phone,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    Logging.error(error);
    return res.sendStatus(400);
  }
};
