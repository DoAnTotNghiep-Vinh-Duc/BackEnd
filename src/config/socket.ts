import { ObjectId } from "mongodb";
import { Room } from "../models/rooms";
import { Account } from "../models/account";

module.exports = (io: any) => {
    io.on("connection", (socket: any) => {
        if (io.req) {
            console.log("Bạn chưa đăng nhập");
            console.log("io.req.payload",io.req.payload);
            
            if (io.req.payload) {
                console.log("Kết nối socket thành công");
                socket.emit("OKOK","KAKAKA")
                const accountIdLogin = io.req.payload.userId;
                addSocketIdInDB(socket.id, accountIdLogin);
                let rooms = getAllRoomById(accountIdLogin);
                rooms.then(function (result) {
                    //console.log(result) // "Rooms here"
                    for (let i = 0; i < result.length; i++) {
                      const idRoom = result[i]._id.toString();
                      socket.join(idRoom);
                    }
                    // console.log(socket.adapter.rooms)
                });
                socket.on('disconnect', () => {
                    console.log('disconnect !!!!' + accountIdLogin);
                    removeSocketIdInDB(accountIdLogin);
                });
            }
        }
    });
};
async function addSocketIdInDB(socketId: String, accountId:String) {
    const account = await Account.findOne({_id:accountId});
    if (socketId) {
        account.socketId = socketId;
    }
    await account.save();
}

async function getAllRoomById(accountId:String) {
    const _id = new ObjectId(`${accountId}`);
    const rooms = await Room.find({
      users: { $in: [_id] },
    });
    return rooms;
}

async function removeSocketIdInDB(accountId: String) {
    const account = await Account.findOne({_id:accountId});
    account.socketId = "";
    await account.save();
}