import { ObjectId } from "mongodb";
import { Room } from "../../models/room";
import { Message } from "../../models/message";
import { RedisCache } from "../../config/redis-cache";
export class RoomService {

    static async getAllRoomAdmin(){
        try {
            const key: String = `RoomService_getAllRoomAdmin`
            const data = await RedisCache.getCache(key);
            if(data){
                return {status: 200,message: "get Room chat success !", data: JSON.parse(data)}
            }
            const rooms = await Room.aggregate([{$lookup:{from:"Account", localField:"user",foreignField:"_id", as:"user"}},{$unwind:"$user"}]);
            let roomAndLastestMessage: Array<any>=[];
            let roomHaveMessage:Array<any>=[];
            let roomHaveNoMessage:Array<any>=[];
            for (let index = 0; index < rooms.length; index++) {
              let lastestMessage = await Message.find({room:rooms[index]._id}).sort({createdAt:-1}).limit(1)
              console.log(lastestMessage);
              
              if(lastestMessage.length<=0){
                roomHaveNoMessage.push(rooms[index]);
              }
              else{
                const tmp = rooms[index];
                tmp.lastestMessage = lastestMessage[0];
                roomHaveMessage.push(tmp);
              }
            }
            console.log("roomHaveMessage",roomHaveMessage);
            roomHaveMessage.sort((a,b) => (a.lastestMessage.createdAt.getTime() <  b.lastestMessage.createdAt.getTime()) ? 1 : (( b.lastestMessage.createdAt.getTime()< a.lastestMessage.createdAt.getTime()) ? -1 : 0))
            roomAndLastestMessage = [...roomHaveMessage, ...roomHaveNoMessage]               
            await RedisCache.setCache(key,JSON.stringify(roomAndLastestMessage),60*5)
            return {status:200, message:"get Room chat success", data:roomAndLastestMessage};
          } catch (error) {
            console.log(error);
            
            return{status: 500,message: "Something went wrong !", error: error};
          }
    }

}
