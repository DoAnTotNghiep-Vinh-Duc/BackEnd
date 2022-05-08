import {Order} from "../models/order";
import {Cart} from "../models/cart"
import { ProductDetail } from "../models/product-detail";
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import vi from "date-fns/locale/vi";
import { zonedTimeToUtc,utcToZonedTime } from 'date-fns-tz';
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { CartDetail } from "../models/cart-detail";
import paypal from "paypal-rest-sdk"
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'ATStXMWKaLIbz91tuL_W6Zt4Mor9WbYytaisCdVdse-62sP3YYbzELeoGvlgO6Mrfx6gUF-Kkg5m5bwm',
    'client_secret': 'ENeq_uLxVXKoLb37jwFQkUQdRzIsi7jNoQh--DtN-30F26iChl4OV7qRysYF8KLY8l9CgAl8-gvDiDnz'
});
const items=   [{
    "name": "Red Sox Hat",
    "sku": "001",
    "price": "1.0",
    "currency": "USD",
    "quantity": 15
},
{
  "name": "Blue Sox Hat",
  "sku": "002",
  "price": "1.5",
  "currency": "USD",
  "quantity": 1
},
{
    "name": "Blue Sox Hat",
    "sku": "003",
    "price": "1.5",
    "currency": "USD",
    "quantity": 1
  },
  {
    "name": "Blue Sox Hat",
    "sku": "004",
    "price": "1.5",
    "currency": "USD",
    "quantity": 1
  }];
var total =0;
for(let i = 0;i<items.length;i++)
{
    total+=parseFloat(items[i].price)*items[i].quantity;
}
export class OrderService {

    static async getOrderByOrderId(orderId: String){
        try {
            const order = await Order.aggregate([{$match:{_id:new ObjectId(`${orderId}`)}},{$lookup:{from:"Account", localField:"account",foreignField:"_id", as:"account"}},{$unwind:"$account"},{$lookup:{from:"Information", localField:"account.information",foreignField:"_id", as:"account.information"}},{$unwind:"$account.information"},{$project:{"account.password":0}},{$unwind:"$listOrderDetail"},{$lookup:{from:"ProductDetail", localField:"listOrderDetail.productDetail",foreignField:"_id", as:"listOrderDetail.productDetail"}},{$unwind:"$listOrderDetail.productDetail"},{ "$lookup": { "from": "Product", "localField": "listOrderDetail.productDetail.product", "foreignField": "_id", "as": "listOrderDetail.productDetail.product" }},{$unwind:"$listOrderDetail.productDetail.product"},{ "$lookup": { "from": "Color", "localField": "listOrderDetail.productDetail.color", "foreignField": "_id", "as": "listOrderDetail.productDetail.color" }},{$unwind:"$listOrderDetail.productDetail.color"},{$project:{"listOrderDetail.productDetail.product.listProductDetail":0}},{ "$group": { "_id": "$_id",account:{$first:"$account"}, "listOrderDetail": { "$push": "$listOrderDetail" } }}])
            if(order){
                return {status: 200,message: "found Order success !", data: order}
            }
            else
                return {status: 404, message: "Not found Order !"}
        } catch (error) {
            return {status: 500, message: "Something went wrong !", error: error};
        }
    }

    static async getAllOrderWithUser(){
        try {
            const order = await Order.aggregate([{$lookup:{from:"Account", localField:"account",foreignField:"_id", as:"account"}},{$unwind:"$account"},{$lookup:{from:"Information", localField:"account.information",foreignField:"_id", as:"account.information"}},{$unwind:"$account.information"},{$project:{"account.password":0}}])
            if(order){
                return {status: 200,message: "found Order success !", data: order}
            }
            else
                return {status: 404, message: "Not found Order !"}
        } catch (error) {
            return {status: 500, message: "Something went wrong !", error: error};
        }
    }

    static async getOrderByAccountId(accountId: String){
        try {
            const order = await Order.findOne({account: accountId})
            if(order){
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

    static async getOrdersByDate(typeRequest: String, beginDate?: Date, endDate?: Date){
        try {
            let orders = null;
            if(typeRequest==="TODAY"){
                let start = new Date();
                start.setHours(0,0,0,0);

                let end = new Date();
                end.setHours(23,59,59,999);
                orders = await Order.aggregate([{$match:{createdAt: { $gte: start, $lte: end}}},{$group:{"_id":"$_id",totalQuantity:{$sum:{$sum:"$listOrderDetail.quantity"}},totalPrice:{$sum:"$total"} }},{$sort:{totalPrice:1}}])
            }

            else if(typeRequest==="YESTERDAY"){
                let yesterdayStart = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);
                yesterdayStart.setHours(0,0,0,0);
                let yesterdayEnd = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);
                yesterdayEnd.setHours(23,59,59,999);
                orders = await Order.aggregate([{$match:{createdAt: { $gte: yesterdayStart, $lte: yesterdayEnd}}},{$group:{"_id":"$_id",totalQuantity:{$sum:{$sum:"$listOrderDetail.quantity"}},totalPrice:{$sum:"$total"} }},{$sort:{totalPrice:1}}])
            }

            else if(typeRequest === "THISWEEK"){
                const timezone = "Asia/Ho_Chi_Minh";
                let date = zonedTimeToUtc(new Date(), timezone);

                let start = startOfWeek(date,{locale:vi,weekStartsOn: 1 });
                let end = endOfWeek(date,{locale: vi,weekStartsOn: 1 });
                start.setHours(start.getHours()+7);
                end.setHours(end.getHours()+7);
                
                orders = await Order.aggregate([{$match:{createdAt: { $gte: start, $lte: end}}},{$group:{"_id":"$_id",totalQuantity:{$sum:{$sum:"$listOrderDetail.quantity"}},totalPrice:{$sum:"$total"} }},{$sort:{totalPrice:1}}])
            }

            else if(typeRequest === "LASTWEEK"){
                const timezone = "Asia/Ho_Chi_Minh";
                let date = zonedTimeToUtc(new Date(), timezone);

                let start = startOfWeek(date,{locale:vi,weekStartsOn: 1 });
                let end = endOfWeek(date,{locale: vi,weekStartsOn: 1 });
                start.setHours(start.getHours()+7);
                start.setDate(start.getDate()-7);
                end.setHours(end.getHours()+7);
                end.setDate(end.getDate()-7);
                
                orders = await Order.aggregate([{$match:{createdAt: { $gte: start, $lte: end}}},{$group:{"_id":"$_id",totalQuantity:{$sum:{$sum:"$listOrderDetail.quantity"}},totalPrice:{$sum:"$total"} }},{$sort:{totalPrice:1}}])
            }

            else if(typeRequest === "THISMONTH"){
                const timezone = "Asia/Ho_Chi_Minh";
                let date = zonedTimeToUtc(new Date(), timezone);

                let start = startOfMonth(date);
                let end = endOfMonth(date);
                start.setHours(start.getHours()+7);
                end.setHours(end.getHours()+7);
                
                orders = await Order.aggregate([{$match:{createdAt: { $gte: start, $lte: end}}},{$group:{"_id":"$_id",totalQuantity:{$sum:{$sum:"$listOrderDetail.quantity"}},totalPrice:{$sum:"$total"} }},{$sort:{totalPrice:1}}])
            }

            else if(typeRequest === "LASTMONTH"){
                const timezone = "Asia/Ho_Chi_Minh";
                let date = zonedTimeToUtc(new Date(), timezone);

                let start = startOfMonth(date);
                let end = endOfMonth(date);
                start.setHours(start.getHours()+7);
                start.setMonth(start.getMonth()-1);
                end.setHours(end.getHours()+7);
                end.setMonth(end.getMonth()-1);

                console.log("start: ",start)
                console.log("end: ", end);
                orders = await Order.aggregate([{$match:{createdAt: { $gte: start, $lte: end}}},{$group:{"_id":"$_id",totalQuantity:{$sum:{$sum:"$listOrderDetail.quantity"}},totalPrice:{$sum:"$total"} }},{$sort:{totalPrice:1}}])
            }

            else if(typeRequest === "TWODATE"){
                if(beginDate&&endDate){
                    const timezone = "Asia/Ho_Chi_Minh";
                    let date = zonedTimeToUtc(new Date(), timezone);
    
                    let start = zonedTimeToUtc(new Date(beginDate), timezone);
                    let end = zonedTimeToUtc(new Date(endDate), timezone);
                    end.setHours(23,59,59,999);
                    orders = await Order.aggregate([{$match:{createdAt: { $gte: start, $lte: end}}},{$group:{"_id":"$_id",totalQuantity:{$sum:{$sum:"$listOrderDetail.quantity"}},totalPrice:{$sum:"$total"} }},{$sort:{totalPrice:1}}])
                }
                
            }

            if(orders){
                return {status: 200,message: "found Orders success !", data: orders}
            }
            else
                return {status: 404, message: "Not found Orders !"}
        } catch (error) {
            return {status: 500, message: "Something went wrong !", error: error};
        }
    }

    static async getTopCustomer(){
        try {
            const orders = await Order.aggregate([{$match:{}},{$group:{"_id":"$account",totalQuantity:{$sum:{$sum:"$listOrderDetail.quantity"}},totalPrice:{$sum:"$total"} }},{$sort:{totalPrice:-1}},{$lookup:{from:"Account", localField:"_id",foreignField:"_id", as:"account"}},{$unwind:"$account"},{$project:{"account.information":1, totalQuantity:1, totalPrice:1}},{$lookup:{from:"Information", localField:"account.information",foreignField:"_id", as:"account"}},{$unwind:"$account"},{$project:{"information":"$account", totalQuantity:1, totalPrice:1}}])
            if(orders){
                return {status: 200,message: "found Order success !", data: orders}
            }
            else
                return {status: 404, message: "Not found Order !"}
        } catch (error) {
            return {status: 500, message: "Something went wrong !", error: error};
        }
    }

    static async getTopCustomerLimitPage(page: number, limit: number){
        try {
            const orders = await Order.aggregate([{$match:{}},{$group:{"_id":"$account",totalQuantity:{$sum:{$sum:"$listOrderDetail.quantity"}},totalPrice:{$sum:"$total"} }},{$sort:{totalPrice:-1}},{$lookup:{from:"Account", localField:"_id",foreignField:"_id", as:"account"}},{$unwind:"$account"},{$project:{"account.information":1, totalQuantity:1, totalPrice:1}},{$lookup:{from:"Information", localField:"account.information",foreignField:"_id", as:"account"}},{$unwind:"$account"},{$project:{"information":"$account", totalQuantity:1, totalPrice:1}},{$skip:(page-1)*limit},{$limit:limit}])
            if(orders){
                return {status: 200,message: "found Order success !", data: orders}
            }
            else
                return {status: 404, message: "Not found Order !"}
        } catch (error) {
            return {status: 500, message: "Something went wrong !", error: error};
        }
    }
   
    static async getTopSellProduct(){
        try {
            const orders = await Order.aggregate([{$match:{}},{$project:{listOrderDetail:1}} ,{$unwind:"$listOrderDetail"}, {$lookup:{from:"ProductDetail", localField:"listOrderDetail.productDetail",foreignField:"_id", as:"listOrderDetail.productDetail"}},{$unwind:"$listOrderDetail.productDetail"},{$group:{"_id":"$listOrderDetail.productDetail.product",totalQuantity:{$sum:"$listOrderDetail.quantity"}}},{$sort:{"totalQuantity":-1}},{$lookup:{from:"Product", localField:"_id",foreignField:"_id", as:"product"}}])
            if(orders){
                return {status: 200,message: "found Order success !", data: orders}
            }
            else
                return {status: 404, message: "Not found Order !"}
        } catch (error) {
            return {status: 500, message: "Something went wrong !", error: error};
        }
    }

    static async getTopSellProductLimitPage(page: number, limit: number){
        try {
            const orders = await Order.aggregate([{$match:{}},{$project:{listOrderDetail:1}} ,{$unwind:"$listOrderDetail"}, {$lookup:{from:"ProductDetail", localField:"listOrderDetail.productDetail",foreignField:"_id", as:"listOrderDetail.productDetail"}},{$unwind:"$listOrderDetail.productDetail"},{$group:{"_id":"$listOrderDetail.productDetail.product",totalQuantity:{$sum:"$listOrderDetail.quantity"}}},{$sort:{"totalQuantity":-1}},{$lookup:{from:"Product", localField:"_id",foreignField:"_id", as:"product"}},{$skip:(page-1)*limit},{$limit:limit}])
            if(orders){
                return {status: 200,message: "found Order success !", data: orders}
            }
            else
                return {status: 404, message: "Not found Order !"}
        } catch (error) {
            return {status: 500, message: "Something went wrong !", error: error};
        }
    }
    static async testTransaction(){
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const opts = {session,returnOriginal: false}
            const a = await Order.findOneAndUpdate({_id:new ObjectId("626a8c05d5b146dd050c67a5")},{status:"OKOK"},opts);
            throw new Error("Lỗi nè");
            
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            return {status: 500, message: "Something went wrong !", error: error};
        }
    }

    static async paymentWithPayPal(){
        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://localhost:5000/order/success",
                "cancel_url": "http://localhost:5000/order/cancel"
            },
            "transactions": [{
                "item_list": {
                    "items": items
                },
                "amount": {
                    "currency": "USD",
                    "total": total.toString()
                },
                "description": "Hat for the best team ever"
            }]
        }
        paypal.payment.create(create_payment_json, function (error: any, payment: any) {
            if (error) {
              return {status: 400, message:"cancel"}
            } else {
                for(let i = 0;i < payment.links.length;i++){
                  if(payment.links[i].rel === 'approval_url'){
                    return {status: 200, message:"payment", link: payment.links[i].href}
                  }
                }
            }
        });
    }
}
