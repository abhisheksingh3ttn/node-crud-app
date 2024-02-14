import express from "express";
import Logging from "../lib/logging";
import fs from "fs/promises";
import type { UserList, User } from './types';
import { nanoid } from 'nanoid';


export const getAllData = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const user_data = await fs.readFile(__dirname + '/../files/user.json', {
        encoding: 'utf8',
      });
    const allUsers: UserList = JSON.parse(user_data);
    return res.status(200).send(allUsers);
  } catch (error) {
    Logging.error(error);
    return res.sendStatus(400);
  }
};

export const addData = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
        const data = await fs.readFile(__dirname + '/../files/user.json', {encoding: 'utf8'});
        const allUsers: UserList = JSON.parse(data);
        const newUser: User = req.body;
        const [user_id, created_at, updated_at] = [nanoid(),new Date().toLocaleString(),new Date().toLocaleString()]
        newUser.id = user_id;
        newUser.created_at = created_at;
        newUser.updated_at = updated_at;
        allUsers.users.push(newUser);
        await fs.writeFile(__dirname + '/../files/user.json', JSON.stringify(allUsers, null, 2), {
            encoding: 'utf8',
        });
        return res.status(200).send(newUser);
    } catch (error) {
        Logging.error(error);
        return res.sendStatus(400);
    }
};

export const deleteFileData = async (req: express.Request, res: express.Response) => {
    try {
      const data = await fs.readFile(__dirname + '/../files/user.json', {
        encoding: 'utf8',
      });
      const allUsers: UserList = JSON.parse(data);
      const userId: string = String(req.params.id);
      const userExists = allUsers.users.find((user) => user.id === userId);
      if(userExists){
        allUsers.users = allUsers.users.filter((user) => user.id !== userId);
        await fs.writeFile(__dirname + '/../files/user.json', JSON.stringify(allUsers), {
          encoding: 'utf8',
        });
        return res.status(200).send(allUsers);
      }
      return res.status(500).send('Invalid Request: User does not exist.');
    } catch (error) {
        Logging.error(error);
        return res.status(500).send('An error occurred when deleting the user with id: ' + req.params.id);
    }
};

export const copyFileData = async (req: express.Request, res: express.Response) => {
    try {
        await fs.copyFile(__dirname + '/../files/user.json', __dirname + '/../files/copy_user_data.json');
        return res.status(200).send('Success');
    } catch (error) {
        Logging.error(error);
        return res.status(500).send('An error occurred when copying file');
    }
};

export const createExcelFile = async (req: express.Request, res: express.Response) => {
    try {
        var xl = require('excel4node');
        const wb = new xl.Workbook();
        const ws = wb.addWorksheet('JSON User List');
        const headingColumnNames = ["Name","City","Mobile","Id", "CreatedAt", "UpdatedAt"];
        let headingColumnIndex = 1;
        headingColumnNames.forEach(heading => { ws.cell(1, headingColumnIndex++).string(heading) });
        let rowIndex = 2;
        const data = await fs.readFile(__dirname + '/../files/user.json', {
            encoding: 'utf8',
        });
        const allUsers: UserList = JSON.parse(data);
        allUsers.users.forEach( record => {
            let columnIndex = 1;
            Object.keys(record ).forEach(columnName =>{
                if(columnName === 'mobile') ws.cell(rowIndex,columnIndex++).number(record [columnName]);
                else ws.cell(rowIndex,columnIndex++).string(record [columnName])
            });
            rowIndex++;
        });
        const file = `${__dirname}/../files/excel/jsonUserList.xlsx`;
        wb.write(file);
        return res.status(200).send('Excel file created & saved to server');
    } catch (error) {
        Logging.error(error);
        return res.status(500).send('An error occurred when creating Excel file');
    }
};
