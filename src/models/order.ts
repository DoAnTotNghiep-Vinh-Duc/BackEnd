import mongoose from "mongoose";
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    account: {
        type: Schema.Types.ObjectId,
        ref:'Account'
    },
    listOrderDetail: {
        type:[
            {
                productDetail:{
                    type: Schema.Types.ObjectId,
                    ref:'ProductDetail'
                },
                quantity: {
                    type: Number,
                    default: 1
                },
                price:{
                    type: Number,
                }
            }
        ],
        default:[],
        _id: false
    },
    status:{
        type: String,
        enum : ['HANDLING','DELIVERING','DONE','CANCELED'],
        default: 'HANDLING'
    },
    total:{
        type: Number,
        required: true
    },
    name:{
        type: String,
        required: true
    },
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
    phone:{
        type:String,
        required: true
    },
    deliveryDay:{
        type: Date,
        required:false
    },
    receiveDay:{
        type: Date,
        required:false
    }
},{timestamps: true, collection:"Order"});

export const Order = mongoose.model("Order", OrderSchema);
