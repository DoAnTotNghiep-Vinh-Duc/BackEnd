import { Request, Response, NextFunction } from 'express'
import {Account} from '../models/account'
import {client} from "../config/redis";
import { ObjectId } from 'mongodb';

export class CheckAdminMiddleware {
  static async isAdmin (req: Request, res: Response, next: any): Promise<any>  {
    const {userId} = req.payload;
    const account = await Account.findOne({_id: new ObjectId(`${userId}`)});
    if(account.roleAccount==="Admin"){
      next();
    }
    else{
      return res.status(403).json({ error: { message: "you have not permission !" } });
    }
  }; 
}
  