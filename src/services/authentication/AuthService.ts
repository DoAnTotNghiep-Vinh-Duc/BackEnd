import jwt from 'jsonwebtoken'
import {client} from "../../config/redis";
export class AuthService{
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
}