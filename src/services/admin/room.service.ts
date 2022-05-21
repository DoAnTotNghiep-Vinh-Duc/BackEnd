import { ObjectId } from "mongodb";
import { Room } from "../../models/room";
import { Message } from "../../models/message";
export class RoomService {

    static async getAllRoomAdmin(){
        try {
            const rooms = await Room.aggregate([{$lookup:{from:"Account", localField:"user",foreignField:"_id", as:"user"}},{$unwind:"$user"}]);
            let roomAndLastestMessage: Array<any>=[];
            for (let index = 0; index < rooms.length; index++) {
                let lastestMessage = await Message.find({room:rooms[index]._id}).sort({createdAt:-1}).limit(1)
                const tmp = rooms[index];
                tmp.lastestMessage = lastestMessage[0];
                roomAndLastestMessage.push(tmp);
                
              }
            console.log(roomAndLastestMessage);
            return {status:200, message:"get Room chat success", data:rooms};
          } catch (error) {
            return{status: 500,message: "Something went wrong !", error: error};
          }
    }

}
