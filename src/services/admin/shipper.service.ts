import { ObjectId } from "mongodb";
import { Room } from "../../models/room";
import { Account } from "../../models/account";
import {Supplier} from "../../models/supplier";
import { Message } from "../../models/message";
import { RedisCache } from "../../config/redis-cache";
import { Information } from "../../models/information";
export class MessageService {
    // static async createShipper(account: any) {
    //     try {
    //         if(!account.token){
    //           return {status:400, message:"token is missing"}
    //         }
    //         const user = await Account.findOne({ email: account.email });
    //         if(!user){
    //           const newInformation = await Information.create({
    //             name: account.name,
    //             email: account.email,
    //             phone: "",
    //             avatar: "https://cdn-icons-png.flaticon.com/512/147/147142.png"
    //           })
    //           // Generate a salt
    //           const salt = await bcrypt.genSalt(10);
    //           // Generate a password hash (salt + hash)
    //           const passwordHashed = await bcrypt.hash(account.password, salt);
    //           // Re-assign password hashed
    //           const newAccount = new Account({
    //             email: account.email,
    //             password: passwordHashed,
    //             nameDisplay: account.name,
    //             isVerifyPhone: false,
    //             information: newInformation._id,
    //             isVerifyAccountWeb:false
    //           })
    //           await newAccount.save();
    
    //           const cart = {
    //             account: newAccount._id,
    //           }
    //           const newCart = await CartService.createCart(cart);
    //           const favorite = {
    //             account: newAccount._id
    //           }
    //           const newFavorite = await FavoriteService.createFavorite(favorite)
    //           await Room.create({
    //             admin:new ObjectId("627a6fe62706176b4a5b5dfa"),
    //             user: newAccount._id,
    //             avatar: newInformation.avatar
    //           })
    //           const verifyCode = await bcrypt.hash(account.email+account.password, salt);
    //           await RedisCache.setCache(`${verifyCode}`,account.email, Number.parseInt(`${process.env.TTL_REGISTER}`));
    //           await SendMailService.sendMail(account.name,account.email,verifyCode, "I create account", (data: any)=>{});
    //           return {status: 201, message: "create account success, please check your email for verify !"} ;
    //         }
    //         else if(!user.isVerifyAccountWeb){
    //           // Generate a salt
    //           const salt = await bcrypt.genSalt(10);
    //           // Generate a password hash (salt + hash)
    //           const passwordHashed = await bcrypt.hash(account.password, salt);
    //           user.password = passwordHashed;
    //           user.nameDisplay = account.name;
    //           await user.save();
    //           const verifyCode = await bcrypt.hash(account.email+account.password, salt);
    //           await RedisCache.setCache(`${verifyCode}`,account.email, Number.parseInt(`${process.env.TTL_REGISTER}`));
    //           await SendMailService.sendMail(account.name,account.email,verifyCode, "I create account", (data: any)=>{});
    //           const keysRoom = await RedisCache.getKeys(`RoomService*`);
    //           await RedisCache.delKeys(keysRoom);
    //           return {status: 201, message: "create account success, please check your email for verify !"} ;
    //         }
    //         else{
    //           return {status: 409, message:"account is already exist !"};
    //         }
    //       } catch (error) {
    //         return {status: 500,message:"Something error when register account ! Please try again !", error: error} ;
    //       }
    // }

    static async addMessageAdmin(roomId:String, accountId: String, message: any, socket: any) { //Chưa làm gửi file
        try {
            const room = await Room.findOne({_id:new ObjectId(`${roomId}`)});
            // const admin = await Account.findOne({
            //     _id: room.admin,
            //     roleAccount: 'Admin',
            // });
            if (room.active === true) {
                const savedMessage = await Message.create({
                    room: room._id,
                    text: message.text,
                    // nameFile: nameFile,
                    sender: new ObjectId(`${accountId}`),
                    type: "Text",
                    active: true,
                });
                socket.to(room._id.toString()).emit("adminAddMessage",{savedMessage});
                const keysMessage = await RedisCache.getKeys(`MessageService*`);
                await RedisCache.delKeys(keysMessage);
                const keysRoom = await RedisCache.getKeys(`RoomService*`);
                await RedisCache.delKeys(keysRoom);
                return{status: 200,message: "Thêm tin nhắn thành công !", data: savedMessage};
            }
            else{
                return {status:400, message:"chat đã bị khóa !"};
            }
        } catch (error) {
            console.log(error);
            
            return{status: 500,message: "Something went wrong !", error: error};
        }
    }

}
