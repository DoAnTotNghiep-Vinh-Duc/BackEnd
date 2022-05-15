
const CLIENT_URL = "http://localhost:3000/";

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
        const {email} = req.body;
        const data = await AuthService.sendMailforForgotPassword(email, "abc");
        return res.status(data.status).json(data);
      } catch (error) {
        return res.status(500).send({message:"Something went wrong"});
      }
    }
    //   static async signUp (req: IGetPayloadAuthInfoRequest, res: Response, next: NextFunction) : Promise<any>{
    //     try {
    //       const { name, phone, password } = req.value.body;
    //       // Check if there is a user with the same user
    //       const foundUser = await User.findOne({ phone });
    //       if (foundUser)
    //         return res
    //           .status(403)
    //           .json({ error: { message: "Số điện thoại đã được sử dụng." } });
    //       // Generate a salt
    //       const salt = await bcrypt.genSalt(10);
    //       // Generate a password hash (salt + hash)
    //       const passwordHashed = await bcrypt.hash(password, salt);
    //       // Re-assign password hashed
    //       const newPassword = passwordHashed;
    //       // Create a new user
    //       const newUser = await User.create({
    //         name,
    //         phone,
    //         password: newPassword,
    //       });
    //       return res.status(201).json({ success: true, newUser });
    //     } catch (error) {
    //       next(error);
    //     }
    //   };
    //   static async refreshToken (req: IGetPayloadAuthInfoRequest, res: Response, next: NextFunction) : Promise<any> {
    //     try {
    //       const { refreshToken } = req.body;
    //       if (!refreshToken) {
    //         return res.status(403).json({ message: "không có refreshtoken" });
    //       }
    //       console.log(refreshToken);
    //       const { userId } = await verifyRefreshToken(refreshToken);
    //       const accessToken = await signAccessToken(userId);
    //       const refToken = await signRefreshToken(userId);
    //       return res.status(200).json({ accessToken, refToken });
    //     } catch (error) {
    //       next(error);
    //     }
    //   };
    //   static async Logout (req: IGetPayloadAuthInfoRequest, res: Response, next: NextFunction) : Promise<any> {
    //     try {
    //       const { refreshToken } = req.body;
    //       // console.log(req.headers);
    //       if (!refreshToken) {
    //         return res.status(403).json({ message: "không có refreshtoken" });
    //       }
    //       const { userId } = await verifyRefreshToken(refreshToken);
    //       const user = await User.findById(userId);
    //       user.active = false;
    //       await user.save();
    //       client.del(userId.toString(), (err, reply) => {
    //         if (err) return res.status(500).json({ message: "Lỗi không xác định" });
    //         return res.status(200).json({ message: "Đăng xuất thành công !!!!" });
    //       });
    //     } catch (error) {
    //       next(error);
    //     }
    //   };
    //   static async ChangePassword (req: IGetPayloadAuthInfoRequest, res: Response, next: NextFunction) : Promise<any> {
    //     try {
    //       const { password, reEnterPassword, newPassword } = req.body;
    //       console.log(req.payload);
    //       // Check if there is a user with the same user
    //       const foundUser = await User.findOne({ _id: req.payload.userId });
    //       if (!foundUser)
    //         return res
    //           .status(403)
    //           .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    //       //Check password co ton tai khong
    //       const isValid = await foundUser.isValidPassword(password);
    //       if (!isValid) {
    //         return res
    //           .status(403)
    //           .json({ error: { message: "Password Không Đúng " } });
    //       }
    //       //Check password co giong khong
    //       if (password !== reEnterPassword) {
    //         return res
    //           .status(403)
    //           .json({ error: { message: "Password Nhập Sai!!!" } });
    //       }
    //       // Generate a salt
    //       const salt = await bcrypt.genSalt(10);
    //       // Generate a password hash (salt + hash)
    //       const passwordHashed = await bcrypt.hash(newPassword, salt);
    //       // Re-assign password hashed
    //       const newChangePassword = passwordHashed;
    //       //Change Password
    //       foundUser.password = newChangePassword;
    //       await foundUser.save();
    //       return res.status(200).json({ success: true });
    //     } catch (error) {
    //       next(error);
    //     }
    //   };
    //   static async forgotPassword (req: IGetPayloadAuthInfoRequest, res: Response, next: NextFunction): Promise<any> {
    //     try {
    //       const { phone, code, Password, reEnterPassword } = req.body;
    //       if (Password !== reEnterPassword) {
    //         return res
    //           .status(403)
    //           .send([{ message: "Password and reEnterpassword Không giống nhau " }]);
    //       }
    //       const result = await verifyOtp(phone, code);
    //       if (result) {
    //         const FoundUser = await User.findOne({ phone });
    //         // Generate a salt
    //         const salt = await bcrypt.genSalt(10);
    //         // Generate a password hash (salt + hash)
    //         const passwordHashed = await bcrypt.hash(Password, salt);
    //         // Re-assign password hashed
    //         const newChangePassword = passwordHashed;
    //         //Change Password
    //         FoundUser.password = newChangePassword;
    //         await FoundUser.save();
    //         res
    //           .status(200)
    //           .send([{ message: "Password đã được cập nhật ", FoundUser }]);
    //       } else {
    //         res.status(400).send([
    //           {
    //             msg: "Code is used or expired",
    //             param: "otp",
    //           },
    //         ]);
    //       }
    //     } catch (error) {
    //       next(error);
    //     }
    //   };
}
