import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import {client} from "../config/redis";
import { Account } from '../models/account';
import { ObjectId } from 'mongodb';

export class CheckPhoneMiddleware {

  static async checkVerifyPhone (req: Request, res: Response, next: any): Promise<any>  {
    const userId = req.payload.userId;
    const account = await Account.findOne({_id: new ObjectId(`${userId}`)})
    if(account){
        next();
    }
    else{
      return res.status(403).json({ error: { message: "You need verify phone !" } });
    }
  }
}
  