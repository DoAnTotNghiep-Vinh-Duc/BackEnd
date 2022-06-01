import mongoose from "mongoose";
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    account: {
        type: Schema.Types.ObjectId,
        ref:'Account'
    },
    shipper:{
        type: Schema.Types.ObjectId,
        ref:'Account',
        default:null
    },
    shipperName:{
        type:String,
        default:""
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
    subTotal: {
        type: Number,
        required: true
    },
    feeShip:{
        type: Number,
        required: true
    },
    total:{
        type: Number,
        required: true
    },
    typePayment:{
        type:String,
        enum:['CASH','PAYPAL'],
        default:'CASH'
    },
    paymentId:{
        type:String,
        required:false
    },
    payerId:{
        type:String,
        required:false
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
        default:null
    },
    receiveDay:{
        type: Date,
        default:null
    },
    confirmOrderImage:{
        type:Array,
        default:[]
    }
},{timestamps: true, collection:"Order"});

export const Order = mongoose.model("Order", OrderSchema);
