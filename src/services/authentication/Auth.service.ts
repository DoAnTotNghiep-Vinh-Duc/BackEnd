import jwt from 'jsonwebtoken';
import { redisCache } from '../../config/redis-cache';
import bcrypt from "bcryptjs";
import {FacebookAccount} from '../../models/facebook-account';
import {GoogleAccount} from '../../models/google-account';
import {Information} from '../../models/information';
import {WebAccount} from '../../models/web-account';
import { InformationService } from '../information.service';
import { SendMailService } from '../send-mail.service';
import { Response } from 'express';
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
                await redisCache.setCache(userId.toString(), token, 365 * 24 * 60 * 60);
                resolve(token);
            } catch (error: any) {
                return reject(error);
            }
          });
        });
    };
    
    static async createAccountFacebook(profile: any, callback: any): Promise<any>{
      try {
        const account = await FacebookAccount.findOne({ idFacebook: profile.id });
        if(!account){
          const newInformation = {
            name: "",
            address: "",
            email: "",
            phone: ""
          }
          await InformationService.createInformation(newInformation,async(data: any)=>{
            const newAccount = new FacebookAccount({
              idFacebook: profile.id,
              password: profile.id,
              name: profile.displayName,
              isVerifyPhone: false,
              avatar: profile.photos[0].value,
              typeAccount: "facebook",
              information: data.data._id,
            });
            await newAccount.save();
            callback(newAccount) ;
          })
        }
        callback(account) ;
      } catch (error) {
        callback({message:"Something error when login with facebook ! Please try again !"}) ;
      }
    }

    static async createAccountGoogle(profile: any): Promise<any>{
      try {
        const account = await GoogleAccount.findOne({ idGoogle: profile.id });
        if(!account){
          const newInformation = new Information({
            name: "",
            address: "",
            email: "",
            phone: ""
          })
          await newInformation.save();
          const newAccount = new GoogleAccount({
            idGoogle: profile.id,
            password: profile.id,
            name: profile.displayName,
            isVerifyPhone: false,
            avatar: profile.photos[0].value,
            information: newInformation._id,
          });
          await newAccount.save();

          return newAccount ;
        }
        else{
          return account ;
        }
      } catch (error) {
        return {message:"Something error when login with google ! Please try again !", error:error} ;
      }
    }

    static async registerWebAccount(account: any, callback: any): Promise<any>{
      // account: name, email, password
      try {
        const user = await WebAccount.findOne({ email: account.email });
        if(!user){
          const newInformation = new Information({
            name: "",
            address: "",
            email: account.email,
            phone: ""
          })
          await newInformation.save();
          // Generate a salt
          const salt = await bcrypt.genSalt(10);
          // Generate a password hash (salt + hash)
          const passwordHashed = await bcrypt.hash(account.password, salt);
          // Re-assign password hashed
          const newPassword = passwordHashed;
          const newAccount = new WebAccount({
            email: account.email,
            password: passwordHashed,
            name: account.name,
            isVerifyPhone: false,
            avatar: "",
            information: newInformation._id,
          })
          await newAccount.save();
          await SendMailService.sendMail(account.name,account.email, "I create account", (data: any)=>{
            callback(newAccount) ;
          });
        }
        else{
          callback({message:"Account already exists ! "}) ;
        }
      } catch (error) {
        callback({message:"Something error when register account ! Please try again !", error: error}) ;
      }
    }

    static async signInWithWebAccount(account: any, callback: any): Promise<any>{
      // account : email, password
      const email = account.email;
      const foundAccount = await WebAccount.findOne({ email });
      if (!foundAccount) {
        callback({status: 403, error: { message: "Tài khoản chưa được đăng ký." } })
        
      }
      const isValid = await foundAccount.isValidPassword(account.password);
      if (!isValid) {
        callback({status:403,error:{message:"Sai mật khẩu !"}} )
      }
      else{
        const accessToken = await AuthService.signAccessToken(foundAccount._id);
        const refreshToken = await AuthService.signRefreshToken(foundAccount._id);
        
        callback({status: 200, message:{account: foundAccount, accessToken, refreshToken}})
      }
        
    }
}