import {Order} from "../models/order";
import {Cart} from "../models/cart"
import { ProductDetail } from "../models/product-detail";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { CartDetail } from "../models/cart-detail";
import { RedisCache } from "../config/redis-cache";
import { Account } from "../models/account";
import { Information } from "../models/information";
export class OrderService {

    static async getOrderByOrderId(accountId: String,orderId: String){
        try {
            const key = `OrderService_getOrderByOrderId(accountId:${accountId},orderId:${orderId})`;
            const dataCache = await RedisCache.getCache(key);
            if(dataCache){
                return {status: 200,message: "found Order success !", data: JSON.parse(dataCache)};
            }
            const order = await Order.aggregate([{$match:{$and:[{_id:new ObjectId(`${orderId}`)},{account:accountId}]}},{$lookup:{from:"Account", localField:"account",foreignField:"_id", as:"account"}},{$unwind:"$account"},{$lookup:{from:"Information", localField:"account.information",foreignField:"_id", as:"account.information"}},{$unwind:"$account.information"},{$project:{"account.password":0}},{$unwind:"$listOrderDetail"},{$lookup:{from:"ProductDetail", localField:"listOrderDetail.productDetail",foreignField:"_id", as:"listOrderDetail.productDetail"}},{$unwind:"$listOrderDetail.productDetail"},{ "$lookup": { "from": "Product", "localField": "listOrderDetail.productDetail.product", "foreignField": "_id", "as": "listOrderDetail.productDetail.product" }},{$unwind:"$listOrderDetail.productDetail.product"},{ "$lookup": { "from": "Color", "localField": "listOrderDetail.productDetail.color", "foreignField": "_id", "as": "listOrderDetail.productDetail.color" }},{$unwind:"$listOrderDetail.productDetail.color"},{$project:{"listOrderDetail.productDetail.product.listProductDetail":0}},{ "$group": { "_id": "$_id",account:{$first:"$account"},status:{$first:"$status"},subTotal:{$first:"$subTotal"},feeShip:{$first:"$feeShip"},total:{$first:"$total"},typePayment:{$first:"$typePayment"},name:{$first:"$name"},city:{$first:"$city"},district:{$first:"$district"},ward:{$first:"$ward"},street:{$first:"$street"},phone:{$first:"$phone"},createdAt:{$first:"$createdAt"},updatedAt:{$first:"$updatedAt"}, "listOrderDetail": { "$push": "$listOrderDetail" } }}])
            if(order){
                await RedisCache.setCache(key, JSON.stringify(order), 60*5);
                return {status: 200,message: "found Order success !", data: order}
            }
            else
                return {status: 404, message: "Not found Order !"}
        } catch (error) {
            return {status: 500, message: "Something went wrong !", error: error};
        }
    }

    static async createOrder(order: any){
        const session = await mongoose.startSession();
        session.startTransaction();
        const opts = {session,returnOriginal: false}
        try {
            const cart = await Cart.findOne({account: order.account})
            const account = await Account.findOne({_id: order.account});
            const info = await Information.findOne({_id:account.information});
            if(info.city===""||info.district===""||info.ward===""||info.street===""){
                info.city= order.city,
                info.district= order.district, 
                info.ward= order.ward, 
                info.street= order.street,
                await info.save(opts);
            }
            const cartDetail = await CartDetail.find({$and:[{cartId:cart._id}, {status:"ACTIVE"}]});
            let totalOrderPrice = 0;
            let listOrderDetail = [];
            let listOutOfStock = [];
            for(let i =0;i< order.listOrderDetail.length; i++){
                let result = cartDetail.find((obj: any) => {
                    return obj.productDetail.toString() === order.listOrderDetail[i]
                })          
                if(result){
                    const productDetail = await ProductDetail.findOne({_id: result.productDetail})
                    if(result.quantity>productDetail.quantity){
                        listOutOfStock.push(result)
                    }
                }
            }
            if(listOutOfStock.length>0){
                return {status: 400, message: "can not create order ! product out of stock !"}
            }
            for(let i =0;i< order.listOrderDetail.length; i++){
                let result = cartDetail.find((obj: any) => {
                    return obj.productDetail.toString() === order.listOrderDetail[i]
                })          
                if(result){
                    const productDetail = await ProductDetail.findById(result.productDetail)
                    listOrderDetail.push({productDetail:result.productDetail,quantity:result.quantity, price: result.priceDiscount})
                    totalOrderPrice+=result.quantity*result.priceDiscount
                    
                    productDetail.quantity-=result.quantity; // Giảm số lượng trong kho
                    await productDetail.save(opts);
                    const cartDetail = await CartDetail.findById({_id:result._id});
                    cartDetail.status = "PAID";
                    await cartDetail.save(opts);
                    await Cart.findByIdAndUpdate({_id:cart._id},{$pull:{'listCartDetail':result._id}}, opts);         
                }
            }
            
            if(totalOrderPrice>0){
                const newOrder = new Order({
                    account: order.account,
                    listOrderDetail,
                    subTotal: totalOrderPrice,
                    feeShip: 30000,
                    total: totalOrderPrice+30000,
                    name: order.name,
                    city: order.city,
                    district: order.district, 
                    ward: order.ward, 
                    street: order.street,
                    phone: order.phone
                })
                await newOrder.save(opts);

                await session.commitTransaction();
                session.endSession();
                // await RedisCache.clearCache();
                delKeyRedisWhenChangeOrder();
                return {status: 201, message: "create Order success !", data:newOrder}
            }
            else{
                await session.abortTransaction();
                session.endSession();
                return {status: 400, message: "can not create order !",}
            }
           
        } catch (error) {
            console.log("error",error);
            await session.abortTransaction();
            session.endSession();
            return{status:500,message: "Something went wrong !", error: error};
        }
    }
    static async getOrderByAccountId(accountId: String){
        try {
            const order = await Order.aggregate([{$match:{account:new ObjectId(`${accountId}`)}},{$project:{account:1,status:1,subTotal:1,feeShip:1,total:1,typePayment:1,name:1,city:1,district:1,ward:1,street:1,phone:1,createdAt:1,updatedAt:1,quantity:{$sum:"$listOrderDetail.quantity"}}}])
            if(order){
                return {status: 200,message: "found Order success !", data: order}
            }
            else
                return {status: 404, message: "Not found Order !"}
        } catch (error) {
            return {status: 500, message: "Something went wrong !", error: error};
        }
    }
}
async function delKeyRedisWhenChangeOrder() {
    const keysOrder = await RedisCache.getKeys(`OrderService*`);
    await RedisCache.delKeys(keysOrder);
    const keysCart = await RedisCache.getKeys(`CartService*`);
    await RedisCache.delKeys(keysCart);
    const keysProduct = await RedisCache.getKeys(`ProductService*`);
    await RedisCache.delKeys(keysProduct);
}