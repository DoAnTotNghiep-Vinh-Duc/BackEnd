const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomSchema = Schema(
  {
    name: String,
    adminId:{
      type: Schema.Types.ObjectId,
    },
    userId: {
      type: Schema.Types.ObjectId,
    },
    avatar:String,
    active:{
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

export const Room = mongoose.model("Room", RoomSchema);

