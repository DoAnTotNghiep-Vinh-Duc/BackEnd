import mongoose from "mongoose";
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

const WebAccount = mongoose.model("WebAccount", WebAccountSchema);

module.exports = WebAccount;
