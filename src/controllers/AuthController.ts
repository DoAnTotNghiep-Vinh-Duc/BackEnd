
const CLIENT_URL = "http://localhost:3000/";

import passport from "passport";
import { googleStrategy } from "../config/googleStrategy";
import { facebookStrategy } from "../config/facebookStrategy";
import { NextFunction, Request, Response } from "express";
import {AuthService} from "../services/authentication/Auth.service";
const  WebAccount  = require('../models/WebAccount') ;
const GoogleAccount = require('../models/GoogleAccount');

passport.use(googleStrategy);
passport.use(facebookStrategy);
export class authController{
    static async loginSuccess (req: Request, res: Response, next: NextFunction): Promise<any>{
      if(req.user){
        const user: any = req.user;
        const id = user._id;
        console.log(req.user)
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
        req.logout();
        res.redirect(CLIENT_URL);
    }

    static async registerWebAccount (req: Request, res: Response, next: NextFunction) : Promise<any>{
      try {
        const newAccount = req.body
        AuthService.RegisterWebAccount(newAccount, (data: any) => {
          res.status(200).send(data);
        });
       
      } catch (error: any) {
          return res.status(500).send({
            msg: error.message,
          });
      }
    }

    static async signInWithWebAccount  (req: Request, res: Response, next: NextFunction) : Promise<any> {
      try {
        const { email, password } = req.body;
        await AuthService.SignInWithWebAccount({ email, password }, (data: any)=>{
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
              .send({ error: data.error.message }); 
          }
        })
      } catch (error) {
        next(error);
      }    
        // Assign a token
    };
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
