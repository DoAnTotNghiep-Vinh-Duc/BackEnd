import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import {Request, Response, NextFunction} from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import { Routes } from "./routes/index";
import * as http from "http";
import passport from "passport";
import {ConnectDatabase} from "./config/database/database"

import cookieSession from "cookie-session"; 

import {RedisCache} from "./config/redis-cache";
ConnectDatabase.connectDatabase();
const app = express();
app.use(
  cookieSession({ name: "session", keys: ["vinhlenguyenthanh"], maxAge: 24 * 60 * 60 * 100 })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.all('/', function (req: Request, res: Response, next:NextFunction) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next()
});


app.use("/", Routes);


const server = http.createServer(app);

server.listen(process.env.PORT, () => {
    RedisCache.connect();
    console.log(`Listening on port ${process.env.PORT}`);
});