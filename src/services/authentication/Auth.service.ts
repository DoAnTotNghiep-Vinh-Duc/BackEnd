import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { RedisCache } from '../../config/redis-cache';
import { Account } from '../../models/account';
import { Information } from '../../models/information';
import { InformationService } from '../information.service';
import { CartService } from "../cart.service";
import { AuthMiddleware } from "../../middleware/auth-middleware";
import {FavoriteService} from "../favorites.service";
import { SendMailService } from "../send-mail.service";
import {Room} from "../../models/room"
import axios from "axios";
import { ObjectId } from "mongodb";
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
                await RedisCache.setCache(userId.toString(), token, 365 * 24 * 60 * 60);
                resolve(token);
            } catch (error: any) {
                return reject(error);
            }
          });
        });
    };

    static async verifyRefreshToken(refreshToken: String): Promise<any>{
      const {userId} = await AuthMiddleware.verifyRefreshToken(refreshToken);
      const accessToken = await this.signAccessToken(userId)
      return {status: 200, message: "verify Refresh Token success !",data:{accessToken, refreshToken}}
    }
    
    static async createAccountFacebook(profile: any): Promise<any>{
      try {
        const account = await Account.findOne({ idFacebook: profile.id });
        if(!account){
          const newInformation = {
            name: "",
            email: "",
            phone: "",
            avatar: profile.photos[0].value,
          }
          const data = await InformationService.createInformation(newInformation);
          const newAccount: any = new Account({
            idFacebook: profile.id,
            nameDisplay: profile.displayName,
            isVerifyPhone: false,
            typeAccount: "FacebookAccount",
            information: data.data._id,
          });
          await newAccount.save();
          const cart = {
            account: newAccount._id,
          }
          const newCart = await CartService.createCart(cart)
          const favorite = {
            account: newAccount._id
          }
          const newFavorite = await FavoriteService.createFavorite(favorite)
          return {status: 201, 
                  message:"create account facebook success !", 
                  data:{nameDisplay: newAccount.nameDisplay, avatar: newInformation.avatar}} ;
        }
        return {status: 200, message:"login with facebook success !", data:{nameDisplay: account.nameDisplay}} ;
      } catch (error) {
        return {status: 500, message:"Something error when login with facebook ! Please try again !", error: error} ;
      }
    }

    static async createAccountGoogle(profile: any): Promise<any>{
      try {
        const account = await Account.findOne({ idGoogle: profile.id });
        if(!account){
          const newInformation = new Information({
            name: profile.displayName,
            email: "",
            phone: "",
            avatar: profile.photos[0].value,
          })
          await newInformation.save();
          const newAccount = new Account({
            idGoogle: profile.id,
            nameDisplay: profile.displayName,
            typeAccount: "GoogleAccount",
            information: newInformation._id,
          });
          await newAccount.save();
          const cart = {
            account: newAccount._id,
          }
          const newCart = await CartService.createCart(cart)
          const favorite = {
            account: newAccount._id
          }
          const newFavorite = await FavoriteService.createFavorite(favorite)

          return {status: 201, message:"create account google success !", data:{nameDisplay: newAccount.nameDisplay, avatar: newInformation.avatar},_id: newAccount._id} ;
        }
        else{
          return {status: 200, message:"get account google success !", data:{nameDisplay: account.nameDisplay},_id:account._id} ;
        }
      } catch (error) {
        return {status: 500,message:"Something error when login with google ! Please try again !", error:error} ;
      }
    }

    static async registerWebAccount(account: any): Promise<any>{
      // account: name, email, password
      console.log(account);
      
      try {
        if(!account.token){
          return {status:400, message:"token is missing"}
        }
        const googleVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.reCaptchaSecret}&response=${account.token}`;
        const response = await axios.post(googleVerifyUrl);
        const { success } = response.data;
        if(success){
          const user = await Account.findOne({ email: account.email });
          if(!user){
            const newInformation = await Information.create({
              name: account.name,
              email: account.email,
              phone: "",
              avatar: "https://cdn-icons-png.flaticon.com/512/147/147142.png"
            })
            // Generate a salt
            const salt = await bcrypt.genSalt(10);
            // Generate a password hash (salt + hash)
            const passwordHashed = await bcrypt.hash(account.password, salt);
            // Re-assign password hashed
            const newAccount = new Account({
              email: account.email,
              password: passwordHashed,
              nameDisplay: account.name,
              isVerifyPhone: false,
              information: newInformation._id,
              isVerifyAccountWeb:false
            })
            await newAccount.save();
  
            const cart = {
              account: newAccount._id,
            }
            const newCart = await CartService.createCart(cart);
            const favorite = {
              account: newAccount._id
            }
            const newFavorite = await FavoriteService.createFavorite(favorite)
            await Room.create({
              admin:new ObjectId("627a6fe62706176b4a5b5dfa"),
              user: newAccount._id,
              avatar: newInformation.avatar
            })
            const verifyCode = await bcrypt.hash(account.email+account.password, salt);
            await RedisCache.setCache(`${verifyCode}`,account.email, Number.parseInt(`${process.env.TTL_REGISTER}`));
            await SendMailService.sendMail(account.name,account.email,verifyCode, "I create account", (data: any)=>{});
            return {status: 201, message: "create account success, please check your email for verify !"} ;
          }
          else if(!user.isVerifyAccountWeb){
            // Generate a salt
            const salt = await bcrypt.genSalt(10);
            // Generate a password hash (salt + hash)
            const passwordHashed = await bcrypt.hash(account.password, salt);
            user.password = passwordHashed;
            user.nameDisplay = account.name;
            await user.save();
            const verifyCode = await bcrypt.hash(account.email+account.password, salt);
            await RedisCache.setCache(`${verifyCode}`,account.email, Number.parseInt(`${process.env.TTL_REGISTER}`));
            await SendMailService.sendMail(account.name,account.email,verifyCode, "I create account", (data: any)=>{});
            const keysRoom = await RedisCache.getKeys(`RoomService*`);
            await RedisCache.delKeys(keysRoom);
            return {status: 201, message: "create account success, please check your email for verify !"} ;
          }
          else{
            return {status: 409, message:"account is already exist !"};
          }
        }
        else{
          return {status: 400, message:"Invalid Captcha. Try again !"};
        }
      } catch (error) {
        return {status: 500,message:"Something error when register account ! Please try again !", error: error} ;
      }
    }

    static async verifyAccountWeb(veriyCode: any): Promise<any>{
      try {
        const emailNeedVerify = await RedisCache.getCache(`${veriyCode}`);
        console.log(veriyCode);
        
        if(emailNeedVerify){
          console.log(emailNeedVerify);
          
          const account = await Account.findOne({email:emailNeedVerify});
          console.log(account);
          
          account.isVerifyAccountWeb = true;
          await account.save();
          await RedisCache.delCache(`${veriyCode}`)
          return {status:200, message:"Verify success, you can login !"};
        }
        else{
          return {status: 400, message:"wrong code verify !"};
        }
      } catch (error) {
        console.log(error);
        
        return {status: 500, message:"Something went wrong"};
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
      if(!foundAccount.isVerifyAccountWeb){
        return {status:403, message:"Tài khoản chưa được xác thực. "}
      }
      if(foundAccount.status==="CLOSED"){
        return {status:403, message:"Tài khoản đã bị khóa. "}
      }
      else{
        const accessToken = await AuthService.signAccessToken(foundAccount._id);
        const refreshToken = await AuthService.signRefreshToken(foundAccount._id);
        const information = await Information.findOne({_id:foundAccount.information})
        return{status: 200, message:{account: {_id:foundAccount._id,email:foundAccount.email,nameDisplay:foundAccount.nameDisplay, role: foundAccount.roleAccount, avatar:information.avatar}, accessToken, refreshToken}}
      }
    }

    static async signInWithShipper(account: any): Promise<any>{
      // account : email, password
      const email = account.email;
      const foundAccount = await Account.findOne({ email });
      if (!foundAccount||foundAccount.typeAccount!=="Shipper") {
        return {status: 403, message: "Tài khoản chưa được đăng ký." }
        
      }
      const isValid = await foundAccount.isValidPassword(account.password);
      if (!isValid) {
        return {status:403,message:"Sai mật khẩu !"}
      }
      if(foundAccount.status==="CLOSED"){
        return {status:403, message:"Tài khoản đã bị khóa. "}
      }
      
      else{
        const accessToken = await AuthService.signAccessToken(foundAccount._id);
        const refreshToken = await AuthService.signRefreshToken(foundAccount._id);
        const information = await Information.findOne({_id:foundAccount.information})
        return{status: 200, message:{account: {_id:foundAccount._id,email:foundAccount.email,nameDisplay:foundAccount.nameDisplay, role: foundAccount.roleAccount, avatar:information.avatar}, accessToken, refreshToken}}
      }
    }

    static async changePassword(userId: any, password: String, newPassword: any, reEnterPassword:any): Promise<any>{
      try {
        const foundAccount = await Account.findOne({ _id: new ObjectId(`${userId}`) });
        if (!foundAccount)
          return {status:403, message:"Bạn cần đăng nhập !"};
        //Check password co ton tai khong
        const isValid = await foundAccount.isValidPassword(password);
        if (!isValid) {
          return {status:403,message:"Sai mật khẩu !"}
        }
        //Check password co giong khong
        if (newPassword !== reEnterPassword) {
          return {status:403,message:"Password nhập lại sai !"}
        }
        
        // Generate a salt
        const salt = await bcrypt.genSalt(10);
        // Generate a password hash (salt + hash)
        const passwordHashed = await bcrypt.hash(newPassword, salt);
        //Change Password
        foundAccount.password = passwordHashed;
        await foundAccount.save();
        return {status:204, message:"Đổi mật khẩu thành công !"};
      } catch (error) {
        return {status:500, message:"something went wrong !"};
      }
    }

    static async sendMailforForgotPassword(email: String, captchaToken: any):Promise<any>{
      try {
        if(!captchaToken){
          return {status:400, message:"chưa xác thực captcha"}
        }
        const googleVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.reCaptchaSecret}&response=${captchaToken}`;
        const response = await axios.post(googleVerifyUrl);
        const { success } = response.data;
        if(success){
          const account = await Account.findOne({email:email});
          if(!account){
            return {status:404, message:"Không tìm thấy tài khoản !"};
          }
          if(account.isVerifyAccountWeb===false){
            return {status:403, message:"Tài khoản của bạn chưa được xác thực, không thể thực hiện quên mật khẩu !"};
          }
          var pass = '';
          var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz0123456789@#$';
              
          for (let i = 1; i <= 8; i++) {
            var char = Math.floor(Math.random()* str.length + 1);     
            pass += str.charAt(char)
          }
          console.log("pass", pass);
          
          const salt = await bcrypt.genSalt(10);
          const verifyCode = await bcrypt.hash(email+pass.toString(), salt);
          await RedisCache.setCache(`${verifyCode}`,email+'_'+pass, Number.parseInt(`${process.env.TTL_FORGOTPASS}`));
          await SendMailService.sendMailForgotPassword(email,verifyCode,pass, (data: any)=>{});
          return {status:200, message:"Gửi mail thành công !"};
        }
        else{
          return {status: 400, message:"sai captcha !"};
        }
          
      } catch (error) {
        return {status:500, message:"Đã có lỗi sảy ra !"};
      }
    }

    static async verifyForgotPassword(veriyCode: String){
      try {
        const emailNeedVerify = await RedisCache.getCache(`${veriyCode}`);
        console.log(veriyCode);
        
        if(emailNeedVerify?.split("_")[0]){
          const email = emailNeedVerify.split("_")[0];
          const newPassword = emailNeedVerify.split("_")[1];
          console.log(emailNeedVerify);
          // Generate a salt
          const salt = await bcrypt.genSalt(10);
          // Generate a password hash (salt + hash)
          const passwordHashed = await bcrypt.hash(newPassword, salt);
          const account = await Account.updateOne({email:email},{password:passwordHashed});
          console.log(account);
          
          await RedisCache.delCache(`${veriyCode}`)
          return {status:200, message:"Xác thực thành công, mật khẩu của bạn đã được thay đổi !"};
        }
        else{
          return {status: 400, message:"wrong code verify !"};
        }
      } catch (error) {
        return {status:500, message:"Đã có lỗi sảy ra !"};
      }
    }
}