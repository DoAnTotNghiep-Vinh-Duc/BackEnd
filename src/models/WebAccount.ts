import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const Schema = mongoose.Schema;

const WebAccountSchema = new Schema({
    email: String,
    password: String,
    nameDisplay: String,
    isVerifyPhone: Boolean,
    avatar: String,
    typeAccount: {
        type: String,
        default: "WebAccount"
    },
    information:{
        type: Schema.Types.ObjectId,
        ref: "Information",
    }
},{timestamps: true, collection:"WebAccount"});
WebAccountSchema.methods.isValidPassword = async function (newPassword: string) {
    try {
      return await bcrypt.compare(newPassword, this.password);
    } catch (error: any) {
      throw new Error(error);
    }
  };
const WebAccount = mongoose.model("WebAccount", WebAccountSchema);

module.exports = WebAccount;
