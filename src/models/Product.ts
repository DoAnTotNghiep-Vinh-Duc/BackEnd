import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    supplier: {
        type: Schema.Types.ObjectId,
        ref: "Supplier",
    },
    discount:{
        type: Schema.Types.ObjectId,
        ref: "Discount",
    },
    name: {
        type:String,
        required: true,
    },
    description: {
        type:String,
        required: false,
    },
    typeProducts: {
        type:Array,
        default:[]
    },
    images:{
        type: Array,
        default: []
    },
    status:{
        type: String,
        enum : ['ACTIVE','DELETE'],
        default: 'ACTIVE'
    },
    voted: {
        type: Number,
        default:0
    },
    point: {
        type:Number,
        default:0
    },
    listProductDetail:{
        type:Array,
        default:[]
    },
    price:{
        type:Number,
        default:0
    }
},{timestamps:true, collection:"Product"});

export const Product = mongoose.model("Product", ProductSchema);

