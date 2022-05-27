import { ObjectId } from "mongodb";
import { Room } from "../models/room";
import { Account } from "../models/account";
import {Supplier} from "../models/supplier";
import { Message } from "../models/message";
import { RedisCache } from "../config/redis-cache";
export class MessageService {
    static async getMessageOfUser(accountId: String) {
        try {
            const key = `MessageService_getMessageOfUser(accountId:${accountId})`;
            const dataCache = await RedisCache.getCache(key);
            if(dataCache){
                return {status: 200,message: "Lấy tin nhắn thành công !", data: JSON.parse(dataCache)};
            }            
            const room = await Room.findOne({user:new ObjectId(`${accountId}`)})            
            const messages = await Message.find({room:room._id});
            await RedisCache.setCache(key, JSON.stringify(messages), 60*5);
            return{status: 200,message: "Lấy tin nhắn thành công !", data: messages};
        } catch (error) {
            return{status: 500,message: "Something went wrong !", error: error};
        }
    }

    static async addMessage(accountId: String, message: any, socket:any) { //Chưa làm gửi file
        try {
            const account = await Account.findOne({
                _id: new ObjectId(`${accountId}`),
                roleAccount: 'User',
            });
            const room = await Room.findOne({user:account._id});
            if (room.active === true) {
                const savedMessage = await Message.create({
                    room: room._id,
                    text: message.text,
                    // nameFile: nameFile,
                    sender: account._id,
                    type: "Text",
                    active: true,
                });
                socket.to(room._id.toString()).emit("addMessage",{savedMessage});
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
            return{status: 500,message: "Something went wrong !", error: error};
        }
    }

}
