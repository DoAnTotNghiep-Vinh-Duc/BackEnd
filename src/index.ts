import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import {Request, Response, NextFunction} from "express";
import bodyParser from "body-parser";
import { Routes } from "./routes/index";
import * as http from "http";
import {ConnectDatabase} from "./config/database/database"
ConnectDatabase.connectDatabase();
const app = express();
app.use(cors());
app.all('/', function (req: Request, res: Response, next:NextFunction) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next()
});
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", Routes);


const server = http.createServer(app);

server.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});