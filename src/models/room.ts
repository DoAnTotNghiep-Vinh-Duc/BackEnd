import mongoose from "mongoose";
const Schema = mongoose.Schema;

const RoomSchema = new Schema(
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
  { timestamps: true, collection:"Room" });

export const Room = mongoose.model("Room", RoomSchema);

