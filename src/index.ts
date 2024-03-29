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
import {AuthMiddleware} from "./middleware/auth-middleware"

import cookieSession from "cookie-session"; 

import {RedisCache} from "./config/redis-cache";
// import {RedisSubcribe} from "./config/redis-subcribe"
import discountSchedule from "./config/cron-job";
ConnectDatabase.connectDatabase();
const app = express();
const server = http.createServer(app);
let io = require("socket.io")(server);
app.use((req, res, next) => {
  io.req = req;
  req.io = io;
  next();
});
app.use(
  cookieSession({ name: "session", keys: ["vinhlenguyenthanh"], maxAge: 24 * 60 * 60 * 100 })
);
app.use(passport.initialize());
  
app.use(passport.session());
app.use(morgan("dev"));
app.use(
  cors({
    origin: [`${process.env.DOMAIN_FRONTEND}`, "http://localhost:3006"],
    // origin: "http://localhost:3000",
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
require("./config/socket")(io);

discountSchedule.start();

server.listen(process.env.PORT,async () => {
    await RedisCache.connect();
    // await RedisSubcribe.connect();
    // await RedisSubcribe.pubsubchanel();
    console.log(`Listening on port ${process.env.PORT}`);
});