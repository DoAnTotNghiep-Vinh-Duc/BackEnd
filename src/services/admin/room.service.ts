import { ObjectId } from "mongodb";
import { Room } from "../../models/room";
export class RoomService {

    static async getAllRoomAdmin(){
        try {
            const rooms = await Room.find();
            return {status:200, message:"get Room chat success", data:rooms};
          } catch (error) {
            return{status: 500,message: "Something went wrong !", error: error};
          }
    }

}
