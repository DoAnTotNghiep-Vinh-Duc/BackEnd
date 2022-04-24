import mongoose from "mongoose";
const Schema = mongoose.Schema;

const InformationSchema = new Schema({
    name: String,
    city: {
        type: String,
        default:""
    },
    county: {
        type: String,
        default:""
    },
    district: {
        type: String,
        default:""
    },
    address: String,
    email: String,
    phone: String,
},{timestamps: true, collection:"Information"});

export const Information = mongoose.model("Information", InformationSchema);
