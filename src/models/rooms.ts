const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomSchema = Schema(
  {
    name: String,
    admin:{
      type: Schema.Types.ObjectId,
    },
    user: {
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

