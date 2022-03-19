import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import {client} from "../config/redis";
import {IGetPayloadAuthInfoRequest} from "../interface/RequestInterface"

export class AuthMiddleware {
    static async signAccessToken (userId: any): Promise<any> {
        return new Promise((resolve, reject) => {
          const payload = {
            userId,
          };
          const secret = process.env.ACCESS_TOKEN_SECRET;
          const options = {
            expiresIn: "1h",
          };
          jwt.sign(payload, `${secret}`, options, (err, token) => {
            if (err) reject(err);
            resolve(token);
          });
        });
      };
      
      static async verifyAccessToken (req: IGetPayloadAuthInfoRequest, res: Response, next: any): Promise<any>  {
        const authHeader: any = req.headers["Authorization"];
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
      };
      static async signRefreshToken (userId: any): Promise<any>  {
        return new Promise(async (resolve, reject) => {
          const payload = {
            userId,
          };
          const secret = process.env.REFRESH_TOKEN_SECRET;
          const options = {
            expiresIn: "1y",
          };
          jwt.sign(payload, `${secret}`, options, async (err: any, token: any) => {
            if (err) reject(err);
            try {
                await client.set(userId.toString(), token);
                await client.expire("abc", 365 * 24 * 60 * 60);
                resolve(token);
            } catch (error: any) {
                return reject(error);
            }
          });
        });
      };
      static async verifyRefreshToken (refreshToken: any) : Promise<any>  {
        return new Promise((resolve: any, reject: any) => {
            try {
                jwt.verify(
                    refreshToken,
                    `${process.env.REFRESH_TOKEN_SECRET}`, async (err: any, payload: any) => {
                      if (err) {
                        return reject(err);
                      }
                      
                      const token = await client.get(payload.userId);
                      if(refreshToken===token)
                      {
                          return resolve(payload)
                      }
                      return reject(err);
                    }
                  );   
            } catch (error) {
                reject(error);
            }
        });
      };
}
  