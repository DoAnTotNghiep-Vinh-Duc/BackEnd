
import passport from "passport";
import { googleStrategy } from "../config/google-strategy";
import { facebookStrategy } from "../config/facebook-strategy";
import { NextFunction, Request, Response } from "express";
import {AuthService} from "../services/authentication/auth.service";
import { AuthMiddleware } from "../middleware/auth-middleware";
import { Account } from "../models/account";
import { RedisCache } from "../config/redis-cache";

passport.use(googleStrategy);
passport.use(facebookStrategy);
export class AuthController{
    static async loginSuccess (req: Request, res: Response, next: NextFunction): Promise<any>{
      if(req.user){
        const user: any = req.user;
        const id = user._id;
        console.log("user:", user);
        
        console.log("id", id)
        // const accountGoogle = await GoogleAccount.findOne({googleId});
        const accessToken = await AuthService.signAccessToken(id);
        const refreshToken = await AuthService.signRefreshToken(id);
        res.setHeader("authorization", accessToken);
        res.setHeader("refreshToken", refreshToken);
        res.status(200).json({
          success: true, accessToken, refreshToken, account: user
          //   cookies: req.cookies
        });
      }
        
    }

    static async loginFail (req: Request, res: Response, next: NextFunction): Promise<any>{
      res.status(401).json({
        success: false,
        message: "failure",
      });
    }

    static async logout (req: Request, res: Response, next: NextFunction): Promise<any>{
        try {
          const { refreshToken } = req.body;
          // console.log(req.headers);
          if (!refreshToken) {
            return res.status(403).json({ message: "Have not refreshtoken" });
          }
          const { userId } = await AuthMiddleware.verifyRefreshToken(refreshToken);
          const user = await Account.findById(userId);
          
          await RedisCache.delCache(userId.toString());
          return res.status(200).json({ message: "Đăng xuất thành công !!!!" });
        } catch (error) {
          next(error);
        }
    }

    static async registerWebAccount (req: Request, res: Response) : Promise<any>{
      try {
        const newAccount = req.body
        const data = await AuthService.registerWebAccount(newAccount);
        console.log(data)
        return res.status(data.status).json(data)
       
      } catch (error: any) {
          return res.status(500).send({
            msg: error,
          });
      }
    }

    static async verifyRefreshToken(req: Request, res: Response) : Promise<any>{
      try {
        const {refreshToken} = req.body
        const data = await AuthService.verifyRefreshToken(refreshToken);
        return res.status(data.status).json(data)
       
      } catch (error: any) {
          return res.status(500).send({
            message: error,
          });
      }
    }

    static async signInWithWebAccount  (req: Request, res: Response, next: NextFunction) : Promise<any> {
      try {
        const { email, password } = req.body;
        const data = await AuthService.signInWithWebAccount({ email, password })
        const status = data.status
          if(status === 200){
            const account = data.message.account
            const accessToken = data.message.accessToken
            const refreshToken = data.message.refreshToken
            res.setHeader("authorization", accessToken);
            res.setHeader("refreshToken", refreshToken);
  
            return res
              .status(status)
              .send({ success: true, accessToken, refreshToken, account });
          }
          else{
            return res
              .status(status)
              .send({ error: data.message }); 
          }
      } catch (error) {
        next(error);
      }    
    };

    static async verifyAccountWeb(req: Request, res: Response, next: NextFunction) : Promise<any> {
      try {
        const {verifyCode} = req.body;
        
        const data = await AuthService.verifyAccountWeb(decodeURIComponent(verifyCode));
        return res.status(data.status).json(data);
      } catch (error) {
        return res.status(500).send({message:"Something went wrong"});
      }
    }
    static async changePassword(req: Request, res: Response, next: NextFunction) : Promise<any> {
      try {
        const {password, newPassword, reEnterPassword} = req.body;
        const {userId} = req.payload
        const data = await AuthService.changePassword(userId, password, newPassword, reEnterPassword);
        return res.status(data.status).json(data);
      } catch (error) {
        return res.status(500).send({message:"Something went wrong"});
      }
    }

    static async sendMailforForgotPassword(req: Request, res: Response, next: NextFunction) : Promise<any> {
      try {
        const {email, token} = req.body;
        const data = await AuthService.sendMailforForgotPassword(email, token);
        return res.status(data.status).json(data);
      } catch (error) {
        return res.status(500).send({message:"Something went wrong"});
      }
    }

    static async verifyForgotPassword(req: Request, res: Response, next: NextFunction) : Promise<any> {
      try {
        const {verifyCode} = req.body;
        
        const data = await AuthService.verifyForgotPassword(decodeURIComponent(verifyCode));
        return res.status(data.status).json(data);
      } catch (error) {
        return res.status(500).send({message:"Something went wrong"});
      }
    }
}
