import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import {Request, Response} from "express";
import bodyParser from "body-parser";
import { Routes } from "./routes/index";
import * as http from "http";
import {ConnectDatabase} from "./config/database/database"
dotenv.config();
ConnectDatabase.connectDatabase();
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.all('/', function (req: Request, res: Response, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next()
});

app.use("/", Routes);


const server = http.createServer(app);

server.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});