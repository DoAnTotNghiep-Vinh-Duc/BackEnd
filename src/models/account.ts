import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
    email: {
        type: String,
        required:false,
    },
    password: {
        type: String,
        required: false,
    },
    idFacebook:{
        type: String,
        required: false
    },
    idGoogle:{
        type: String,
        required: false
    },
    nameDisplay: String,
    isVerifyPhone: {
        type: Boolean,
        default: false
    },
    isVerifyAccountWeb:{
        type: Boolean,
        required: false  
    },
    avatar: {
        type: String,
        required: false
    },
    typeAccount: {
        type: String,
        enum: ['WebAccount', 'FacebookAccount', 'GoogleAccount'],
        default: 'WebAccount'
    },
    roleAccount: {
        type: String,
        enum:['Admin', 'User'],
        default: 'User'
    },
    information:{
        type: Schema.Types.ObjectId,
        ref: "Information",
    },
    status:{
        type: String,
        enum:['ACTIVE','CLOSED'],
        default:'ACTIVE'
    }
    
},{timestamps: true, collection:"Account"});
AccountSchema.methods.isValidPassword = async function (newPassword: string) {
    try {
      return await bcrypt.compare(newPassword, this.password);
    } catch (error: any) {
      throw new Error(error);
    }
  };
export const Account = mongoose.model("Account", AccountSchema);

