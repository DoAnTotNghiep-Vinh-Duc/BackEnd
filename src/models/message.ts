const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    roomId: {
      type: String,
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
      type: String
    },
    
    nameFile: {
      type: String
    }
  },
  { timestamps: true }
);
export const message = mongoose.model("Message", MessageSchema);
