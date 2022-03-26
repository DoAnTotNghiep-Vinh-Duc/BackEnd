import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import {Request, Response, NextFunction} from "express";
import bodyParser from "body-parser";
import { Routes } from "./routes/index";
import * as http from "http";
import passport from "passport";
import {ConnectDatabase} from "./config/database/database"

import cookieSession from "cookie-session"; 

import {redisCache} from "./config/redisCache";
ConnectDatabase.connectDatabase();
const app = express();
app.use(
  cookieSession({ name: "session", keys: ["vinhlenguyenthanh"], maxAge: 24 * 60 * 60 * 100 })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
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
    redisCache.Connect();
    console.log(`Listening on port ${process.env.PORT}`);
});