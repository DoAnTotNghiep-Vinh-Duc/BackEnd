import mongoose from "mongoose";
const Schema = mongoose.Schema;

const InformationSchema = new Schema({
    name: String,
    city: {
        type: String,
        default:""
    },
    district: {
        type: String,
        default:""
    },
    ward: {
        type: String,
        default:""
    },
    street: {
        type: String,
        default:""
    },
    email: String,
    phone: String,
    avatar: {
        type: String
    },
},{timestamps: true, collection:"Information"});

export const Information = mongoose.model("Information", InformationSchema);
