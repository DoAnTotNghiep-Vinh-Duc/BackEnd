import mongoose from "mongoose";
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    room: {
      type: Schema.Types.ObjectId,
    },
    text: {
      type: String,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
    active: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      default:"Text"
    },
    
    nameFile: {
      type: String,
      require:false
    }
  },
  { timestamps: true , collection:"Message"});
export const Message = mongoose.model("Message", MessageSchema);
