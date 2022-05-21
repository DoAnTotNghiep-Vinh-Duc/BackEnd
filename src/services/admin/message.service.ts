import { ObjectId } from "mongodb";
import { Room } from "../../models/room";
import { Account } from "../../models/account";
import {Supplier} from "../../models/supplier";
import { Message } from "../../models/message";
export class MessageService {
    static async getMessageByRoomId(roomId: String) {
        try {
            const room = await Room.findOne({_id:new ObjectId(`${roomId}`)})            
            const messages = await Message.find({room:room._id});
            return{status: 200,message: "Lấy tin nhắn thành công !", data: messages};
        } catch (error) {
            return{status: 500,message: "Something went wrong !", error: error};
        }
    }

    static async addMessageAdmin(roomId:String, accountId: String, message: any) { //Chưa làm gửi file
        try {
            const room = await Room.findOne({user:new ObjectId(`${roomId}`)});
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
