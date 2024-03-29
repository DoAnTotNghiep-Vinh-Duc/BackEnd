import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import {client} from "../config/redis";
import { Account } from '../models/account';
import { ObjectId } from 'mongodb';

export class AuthMiddleware {

  static async verifyAccessToken (req: Request, res: Response, next: any): Promise<any>  {
    const authHeader: any = req.headers.authorization;
    if(authHeader){
      const bearerToken = authHeader.split(' ');
      const token = bearerToken[1];
      const accessToken = process.env.ACCESS_TOKEN_SECRET;
      jwt.verify(token, `${accessToken}`, (err: any, payload: any) => {
        if (err) {
          if (err.name === "JsonWebTokenError") {
            return res.status(403).json({ error: { message: "Unauthorized" } });
          }
          return res.status(401).json({ error: { message: err.message } });
        }
        req.payload = payload;
        
        next();
      });
    }
    else{
      return res.status(403).json({ error: { message: "Unauthorized" } });
    }
  };

  static async verifyRefreshToken (refreshToken: any) : Promise<any>  {
    return new Promise((resolve: any, reject: any) => {
      try {
        jwt.verify(refreshToken, `${process.env.REFRESH_TOKEN_SECRET}`, async (err: any, payload: any) => {
          if (err) {
            return reject(err);
          }
          
          const token = await client.get(payload.userId);
          if(refreshToken===token)
          {
            return resolve(payload)
          }
          return reject(err);  
        });   
      } catch (error) {
          reject(error);
      }
    });
  };

  static async checkAccountIsActive (req: Request, res: Response, next: any): Promise<any>  {
    const {userId} = req.payload;
    const account = await Account.findOne({_id: new ObjectId(`${userId}`)});
    if(account.status==="ACTIVE"){
      next();
    }
    else{
      return res.status(403).json({ error: { message: "your account has been closed !" } });
    }
  }; 
}
  