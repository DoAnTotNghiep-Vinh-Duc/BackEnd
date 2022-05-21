import { ObjectId } from "mongodb";
import { Room } from "../models/room";
import { Account } from "../models/account";
import {Supplier} from "../models/supplier";
import { Message } from "../models/message";
export class RoomService {

    static async getRoomChatForUser(accountId: String){
        try {
            const account = await Account.findOne({
              user: new ObjectId(`${accountId}`),
              roleAccount: 'User',
            });
            if (!account) {
              return({status: 403, message: 'Người dùng chưa đăng nhập!!!',});
            }
            else{
                const room = await Room.findOne({userId:new ObjectId(`${accountId}`)});
                return {status:200, message:"get Room chat success", data:room};
            }
          } catch (error) {
            return{status: 500,message: "Something went wrong !", error: error};
          }
    }

}
