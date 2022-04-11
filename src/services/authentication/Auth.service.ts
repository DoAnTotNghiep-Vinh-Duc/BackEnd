import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { redisCache } from '../../config/redis-cache';
import { Account } from '../../models/account';
import { Information } from '../../models/information';
import { InformationService } from '../information.service';
import { CartService } from "../cart.service";
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
    
    static async createAccountFacebook(profile: any): Promise<any>{
      try {
        const account = await Account.findOne({ idFacebook: profile.id });
        if(!account){
          const newInformation = {
            name: "",
            address: "",
            email: "",
            phone: ""
          }
          const data = await InformationService.createInformation(newInformation);
          const newAccount: any = new Account({
            idFacebook: profile.id,
            nameDisplay: profile.displayName,
            isVerifyPhone: false,
            avatar: profile.photos[0].value,
            typeAccount: "FacebookAccount",
            information: data.data._id,
          });
          await newAccount.save();
          const cart = {
            account: newAccount._id,
          }
          const newCart = await CartService.createCart(cart)
          return {status: 201, 
                  message:"create account facebook success !", 
                  data:{nameDisplay: newAccount.nameDisplay, avatar: newAccount.avatar}} ;
        }
        return {status: 200, message:"login with facebook success !", data:{nameDisplay: account.nameDisplay, avatar: account.avatar}} ;
      } catch (error) {
        return {status: 500, message:"Something error when login with facebook ! Please try again !", error: error} ;
      }
    }

    static async createAccountGoogle(profile: any): Promise<any>{
      try {
        const account = await Account.findOne({ idGoogle: profile.id });
        if(!account){
          const newInformation = new Information({
            name: "",
            address: "",
            email: "",
            phone: ""
          })
          await newInformation.save();
          const newAccount = new Account({
            idGoogle: profile.id,
            nameDisplay: profile.displayName,
            typeAccount: "GoogleAccount",
            avatar: profile.photos[0].value,
            information: newInformation._id,
          });
          await newAccount.save();
          const cart = {
            account: newAccount._id,
          }
          const newCart = await CartService.createCart(cart)

          return {status: 201, message:"create account google success !", data:{nameDisplay: newAccount.nameDisplay, avatar: newAccount.avatar}} ;
        }
        else{
          return {status: 200, message:"create account google success !", data:{nameDisplay: account.nameDisplay, avatar: account.avatar}} ;
        }
      } catch (error) {
        return {status: 500,message:"Something error when login with google ! Please try again !", error:error} ;
      }
    }

    static async registerWebAccount(account: any): Promise<any>{
      // account: name, email, password
      try {
        const user = await Account.findOne({ email: account.email });
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
          const newAccount = new Account({
            email: account.email,
            password: passwordHashed,
            name: account.name,
            isVerifyPhone: false,
            avatar: "",
            information: newInformation._id,
          })
          await newAccount.save();

          const cart = {
            account: newAccount._id,
          }
          const newCart = await CartService.createCart(cart);
          return {status: 201, message: newAccount} ;
          // await SendMailService.sendMail(account.name,account.email, "I create account", (data: any)=>{
          // });
        }
        else{
          return {status: 409, message:"Account already exists ! "} ;
        }
      } catch (error) {
        return {status: 500,message:"Something error when register account ! Please try again !", error: error} ;
      }
    }

    static async signInWithWebAccount(account: any): Promise<any>{
      // account : email, password
      const email = account.email;
      const foundAccount = await Account.findOne({ email });
      if (!foundAccount) {
        return {status: 403, message: "Tài khoản chưa được đăng ký." }
        
      }
      const isValid = await foundAccount.isValidPassword(account.password);
      if (!isValid) {
        return {status:403,message:"Sai mật khẩu !"}
      }
      else{
        const accessToken = await AuthService.signAccessToken(foundAccount._id);
        const refreshToken = await AuthService.signRefreshToken(foundAccount._id);
        
        return{status: 200, message:{account: foundAccount, accessToken, refreshToken}
      }
    }
    }
}