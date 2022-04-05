import mongoose from "mongoose";
const Schema = mongoose.Schema;

const FacebookSchema = new Schema({
    idFacebook: String,
    password: String,
    nameDisplay: String,
    isVerifyPhone: Boolean,
    avatar: String,
    typeAccount: {
        type: String,
        default: "facebook"
    },
    information:{
        type: Schema.Types.ObjectId,
        ref: "Information",
    }
},{timestamps: true, collection:"FacebookAccount"});

export const FacebookAccount = mongoose.model("FacebookAccount", FacebookSchema);
