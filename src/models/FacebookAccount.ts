import mongoose from "mongoose";
const Schema = mongoose.Schema;

const FacebookSchema = new Schema({
    idFacebook: String,
    password: String,
    name: String,
    isVerifyPhone: Boolean,
    avatar: String,
    typeAccount: String,
},{timestamps: true, collection:"FacebookAccount"});

const account = mongoose.model("FacebookAccount", FacebookSchema);
module.exports = account;
