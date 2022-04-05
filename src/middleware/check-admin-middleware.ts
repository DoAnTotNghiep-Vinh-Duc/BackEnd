import { Request, Response, NextFunction } from 'express'
import {client} from "../config/redis";

export class AuthMiddleware {
  static async isAdmin (req: Request, res: Response, next: any): Promise<any>  {
    
  }; 
}
  