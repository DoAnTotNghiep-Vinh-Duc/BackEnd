import {Order} from "../../models/order";
import {Cart} from "../../models/cart"
import { ProductDetail } from "../../models/product-detail";
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import vi from "date-fns/locale/vi";
import { zonedTimeToUtc,utcToZonedTime } from 'date-fns-tz';
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { CartDetail } from "../../models/cart-detail";
import { RedisCache } from "../../config/redis-cache";
import { Account } from "../../models/account";
import { Information } from "../../models/information";

export class OrderService {

    static async getOrderByOrderIdAdmin(orderId: String){
        try {
            const key = `OrderService_getOrderByOrderIdAdmin(orderId:${orderId})`;
            const dataCache = await RedisCache.getCache(key);
            if(dataCache){
                return {status: 200,message: "found Order success !", data: JSON.parse(dataCache)};
            }
            const order = await Order.aggregate([{$match:{_id:new ObjectId(`${orderId}`)}},{$lookup:{from:"Account", localField:"account",foreignField:"_id", as:"account"}},{$unwind:"$account"},{$lookup:{from:"Information", localField:"account.information",foreignField:"_id", as:"account.information"}},{$unwind:"$account.information"},{$project:{"account.password":0}},{$unwind:"$listOrderDetail"},{$lookup:{from:"ProductDetail", localField:"listOrderDetail.productDetail",foreignField:"_id", as:"listOrderDetail.productDetail"}},{$unwind:"$listOrderDetail.productDetail"},{ "$lookup": { "from": "Product", "localField": "listOrderDetail.productDetail.product", "foreignField": "_id", "as": "listOrderDetail.productDetail.product" }},{$unwind:"$listOrderDetail.productDetail.product"},{ "$lookup": { "from": "Color", "localField": "listOrderDetail.productDetail.color", "foreignField": "_id", "as": "listOrderDetail.productDetail.color" }},{$unwind:"$listOrderDetail.productDetail.color"},{$project:{"listOrderDetail.productDetail.product.listProductDetail":0}},{ "$group": { "_id": "$_id",account:{$first:"$account"},status:{$first:"$status"},subTotal:{$first:"$subTotal"},feeShip:{$first:"$feeShip"},total:{$first:"$total"},typePayment:{$first:"$typePayment"},name:{$first:"$name"},city:{$first:"$city"},district:{$first:"$district"},ward:{$first:"$ward"},street:{$first:"$street"},phone:{$first:"$phone"},createdAt:{$first:"$createdAt"},updatedAt:{$first:"$updatedAt"}, "listOrderDetail": { "$push": "$listOrderDetail" } }}])
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

    static async getAllOrderWithUser(){
        try {
            const key = `OrderService_getAllOrderWithUser`;
            const dataCache = await RedisCache.getCache(key);
            if(dataCache){
                return {status: 200,message: "found Order success !", data: JSON.parse(dataCache)};
            }
            const order = await Order.aggregate([{$lookup:{from:"Account", localField:"account",foreignField:"_id", as:"account"}},{$unwind:"$account"},{$lookup:{from:"Information", localField:"account.information",foreignField:"_id", as:"account.information"}},{$unwind:"$account.information"},{$project:{"account.password":0}},{$sort:{createdAt:-1}}])
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

    static async getUserOrderAdmin(accountId: any, statusOrder:any){
        try {
            const key = `OrderService_getUserOrderAdmin(accountId:${accountId},statusOrder:${statusOrder})`;
            const dataCache = await RedisCache.getCache(key);
            if(dataCache){
                return {status: 200,message: "found Order success !", data: JSON.parse(dataCache)};
            }
            let query: Array<any> = [];
            query.push({$match:{account:new ObjectId(`${accountId}`)}});
            if(statusOrder==='HANDLING'||statusOrder==='DELIVERING'||statusOrder==='DONE'||statusOrder==='CANCELED'){
                query.push({$match:{status:statusOrder}})
            }
            query.push({$project:{account:1,listOrderDetail:1,status:1,subTotal:1,feeShip:1,total:1,typePayment:1,name:1,city:1,district:1,ward:1,street:1,phone:1,createdAt:1,updatedAt:1,quantity:{$sum:"$listOrderDetail.quantity"}}})

            query.push({$unwind:"$listOrderDetail"});
            query.push({$lookup:{from:"ProductDetail", localField:"listOrderDetail.productDetail",foreignField:"_id", as:"listOrderDetail.productDetail"}});
            query.push({$unwind:"$listOrderDetail.productDetail"});
            query.push({ "$lookup": { "from": "Product", "localField": "listOrderDetail.productDetail.product", "foreignField": "_id", "as": "listOrderDetail.productDetail.product" }});
            query.push({$unwind:"$listOrderDetail.productDetail.product"});
            query.push({ "$lookup": { "from": "Color", "localField": "listOrderDetail.productDetail.color", "foreignField": "_id", "as": "listOrderDetail.productDetail.color" }});
            query.push({$unwind:"$listOrderDetail.productDetail.color"});
            query.push({$project:{"listOrderDetail.productDetail.product.listProductDetail":0}});
            query.push({ "$group": { "_id": "$_id",account:{$first:"$account"},status:{$first:"$status"},subTotal:{$first:"$subTotal"},feeShip:{$first:"$feeShip"},total:{$first:"$total"},typePayment:{$first:"$typePayment"},name:{$first:"$name"},city:{$first:"$city"},district:{$first:"$district"},ward:{$first:"$ward"},street:{$first:"$street"},phone:{$first:"$phone"},createdAt:{$first:"$createdAt"},updatedAt:{$first:"$updatedAt"}, "listOrderDetail": { "$push": "$listOrderDetail" } }});
            const order = await Order.aggregate(query)
            if(order){
                await RedisCache.setCache(key, JSON.stringify(order), 60*5);
                return {status: 200,message: "found Order success !", data: order}
            }
            else
                return {status: 404, message: "Not found Order !"}
        } catch (error) {
            console.log(error);
            
            return {status: 500, message: "Something went wrong !", error: error};
        }
    }

    static async getOrdersByDate(typeRequest: String, beginDate?: Date, endDate?: Date){
        try {
            const key = `OrderService_getOrdersByDate(typeRequest:${typeRequest}, beginDate?:${beginDate}, endDate?:${endDate})`;
            const dataCache = await RedisCache.getCache(key);
            if(dataCache){
                return {status: 200,message: "found Order success !", data: JSON.parse(dataCache)};
            }
            let orders = null;
            console.log("typeRequest",typeRequest);
            
            if(typeRequest==="TODAY"){
                let start = new Date();
                start.setHours(0,0,0,0);
                
                let end = new Date();
                end.setHours(23,59,59,999);
                start.setHours(start.getHours()+7);
                end.setHours(end.getHours()+7);
                
                orders = await Order.aggregate([{$match:{createdAt: { $gte: start, $lte: end}}},{$group:{"_id":"$_id",totalQuantity:{$sum:{$sum:"$listOrderDetail.quantity"}},totalPrice:{$sum:"$total"} }},{$sort:{totalPrice:1}}])
            }

            else if(typeRequest==="YESTERDAY"){
                let yesterdayStart = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);
                yesterdayStart.setHours(0,0,0,0);
                let yesterdayEnd = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);
                yesterdayEnd.setHours(23,59,59,999);
                yesterdayStart.setHours(yesterdayStart.getHours()+7);
                yesterdayEnd.setHours(yesterdayEnd.getHours()+7);
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
                await RedisCache.setCache(key, JSON.stringify(orders), 60*5);
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
            const key = `OrderService_getTopCustomer`;
            const dataCache = await RedisCache.getCache(key);
            if(dataCache){
                return {status: 200,message: "found Order success !", data: JSON.parse(dataCache)};
            }
            const orders = await Order.aggregate([{$match:{}},{$group:{"_id":"$account",totalQuantity:{$sum:{$sum:"$listOrderDetail.quantity"}},totalPrice:{$sum:"$total"} }},{$sort:{totalPrice:-1}},{$lookup:{from:"Account", localField:"_id",foreignField:"_id", as:"account"}},{$unwind:"$account"},{$project:{"account.information":1, totalQuantity:1, totalPrice:1}},{$lookup:{from:"Information", localField:"account.information",foreignField:"_id", as:"account"}},{$unwind:"$account"},{$project:{"information":"$account", totalQuantity:1, totalPrice:1}}])
            if(orders){
                await RedisCache.setCache(key, JSON.stringify(orders), 60*5);
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
            const key = `OrderService_getTopCustomer(page:${page},limit:${limit})`;
            const dataCache = await RedisCache.getCache(key);
            if(dataCache){
                return {status: 200,message: "found Order success !", data: JSON.parse(dataCache)};
            }
            const orders = await Order.aggregate([{$match:{}},{$group:{"_id":"$account",totalQuantity:{$sum:{$sum:"$listOrderDetail.quantity"}},totalPrice:{$sum:"$total"} }},{$sort:{totalPrice:-1}},{$lookup:{from:"Account", localField:"_id",foreignField:"_id", as:"account"}},{$unwind:"$account"},{$project:{"account.information":1, totalQuantity:1, totalPrice:1}},{$lookup:{from:"Information", localField:"account.information",foreignField:"_id", as:"account"}},{$unwind:"$account"},{$project:{"information":"$account", totalQuantity:1, totalPrice:1}},{$skip:(page-1)*limit},{$limit:limit}])
            if(orders){
                await RedisCache.setCache(key, JSON.stringify(orders), 60*5);
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
            const key = `OrderService_getTopSellProduct`;
            const dataCache = await RedisCache.getCache(key);
            if(dataCache){
                return {status: 200,message: "found Order success !", data: JSON.parse(dataCache)};
            }
            const orders = await Order.aggregate([{$match:{}},{$project:{listOrderDetail:1}} ,{$unwind:"$listOrderDetail"}, {$lookup:{from:"ProductDetail", localField:"listOrderDetail.productDetail",foreignField:"_id", as:"listOrderDetail.productDetail"}},{$unwind:"$listOrderDetail.productDetail"},{$group:{"_id":"$listOrderDetail.productDetail.product",totalQuantity:{$sum:"$listOrderDetail.quantity"}}},{$sort:{"totalQuantity":-1}},{$lookup:{from:"Product", localField:"_id",foreignField:"_id", as:"product"}}])
            if(orders){
                await RedisCache.setCache(key, JSON.stringify(orders), 60*5);
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
            const key = `OrderService_getTopSellProductLimitPage(page:${page},limit:${limit})`;
            const dataCache = await RedisCache.getCache(key);
            if(dataCache){
                return {status: 200,message: "found Order success !", data: JSON.parse(dataCache)};
            }
            const orders = await Order.aggregate([{$match:{}},{$project:{listOrderDetail:1}} ,{$unwind:"$listOrderDetail"}, {$lookup:{from:"ProductDetail", localField:"listOrderDetail.productDetail",foreignField:"_id", as:"listOrderDetail.productDetail"}},{$unwind:"$listOrderDetail.productDetail"},{$group:{"_id":"$listOrderDetail.productDetail.product",totalQuantity:{$sum:"$listOrderDetail.quantity"}}},{$sort:{"totalQuantity":-1}},{$lookup:{from:"Product", localField:"_id",foreignField:"_id", as:"product"}},{$skip:(page-1)*limit},{$limit:limit}])
            if(orders){
                await RedisCache.setCache(key, JSON.stringify(orders), 60*5);
                return {status: 200,message: "found Order success !", data: orders}
            }
            else
                return {status: 404, message: "Not found Order !"}
        } catch (error) {
            return {status: 500, message: "Something went wrong !", error: error};
        }
    }
    
    static async sortOrder(typeSort: String, sort: String, typeOrderStatus:String){
        try {
            const key = `OrderService_sortOrder(typeSort:${typeSort},sort:${sort},typeOrderStatus:${typeOrderStatus})`;
            const dataCache = await RedisCache.getCache(key);
            if(dataCache){
                return {status: 200,message: "found Order success !", data: JSON.parse(dataCache)};
            }
            let orders: any = null;
            let query: Array<any> = [];
            if(typeSort==="NAME"){
                if(sort === "ASC"){
                    // 1 là tăng dần
                    query.push({$sort:{name:1}})
                }
                else if(sort === "DESC"){
                    query.push({$sort:{name:-1}})
                }
            }
            else if(typeSort === "TOTALMONEY"){
                if(sort === "ASC"){
                    query.push({$sort:{total:1}})
                }
                else if(sort === "DESC"){
                    query.push({$sort:{total:-1}})
                }
            }
            else if(typeSort === "ORDERDATE"){
                if(sort === "ASC"){
                    query.push({$sort:{createdAt:1}})
                }
                else if(sort === "DESC"){
                    query.push({$sort:{createdAt:-1}})
                }
            }
            else{
                if(sort === "ASC"){
                    query.push({$sort:{_id:1}})
                }
                else if(sort === "DESC"){
                    query.push({$sort:{_id:-1}})
                }
            }
            if(typeOrderStatus === "HANDLING"||typeOrderStatus === "DELIVERING"||typeOrderStatus === "DONE"||typeOrderStatus === "CANCELED"){
                query.push({$match:{status:typeOrderStatus}})
            }
            query.push({$lookup:{from:"Account", localField:"account",foreignField:"_id", as:"account"}})
            query.push({$unwind:"$account"})
            query.push({$lookup:{from:"Information", localField:"account.information",foreignField:"_id", as:"account.information"}});
            query.push({$unwind:"$account.information"});
            query.push({$project:{"account.password":0}});
            orders = await Order.aggregate(query)
            if(typeSort==="NAME"){
                orders.sort(compare)
                console.log(orders);
                
            }
            function compare( a: any, b: any ) {
                if(sort === "ASC"){
                    if ( a.account.information.name < b.account.information.name ){
                        return -1;
                      }
                      if ( a.account.information.name > b.account.information.name ){
                        return 1;
                      }
                      return 0;
                }
                else if(sort === "DESC"){
                    if ( a.account.information.name > b.account.information.name ){
                        return -1;
                      }
                      if ( a.account.information.name < b.account.information.name ){
                        return 1;
                      }
                      return 0;
                }
                
            }
            if(orders){
                await RedisCache.setCache(key, JSON.stringify(orders), 60*5);
                return {status: 200,message: "found Order success !", data: orders}
            }
            else
                return {status: 404, message: "Not found Order !"}
        } catch (error) {
            return {status: 500, message: "Something went wrong !", error: error};
        }
    }
    static async nextStatusOrder(orderId: String){
        try {
            let order = await Order.findOne({_id:new ObjectId(`${orderId}`)});
            if(order){
                if(order.status === "HANDLING"){
                    const timezone = "Asia/Ho_Chi_Minh";
                    let date = zonedTimeToUtc(new Date(), timezone);

                    let start = new Date();
                    start.setHours(start.getHours()+7);
                    await Order.updateOne({_id:new ObjectId(`${orderId}`)},{$set:{status:"DELIVERING", deliveryDay: start}})
                }
                if(order.status === "DELIVERING"){
                    const timezone = "Asia/Ho_Chi_Minh";
                    let date = zonedTimeToUtc(new Date(), timezone);

                    let start = new Date();
                    start.setHours(start.getHours()+7);
                    await Order.updateOne({_id:new ObjectId(`${orderId}`)},{$set:{status:"DONE", receiveDay: start}})
                }
                // await RedisCache.clearCache();
                delKeyRedisWhenChangeOrder();
                return {status: 204,message: "change status Order success !"};
            }
            else
                return {status: 404, message: "Not found Order !"}
        } catch (error) {
            return {status: 500, message: "Something went wrong !", error: error};
        }
    }
    static async cancelOrder(orderId: String){
        try {
            let order = await Order.findOne({_id:new ObjectId(`${orderId}`)});
            if(order){
                await Order.updateOne({_id:new ObjectId(`${orderId}`)},{$set:{status:"CANCELED"}})
                // await RedisCache.clearCache();
                delKeyRedisWhenChangeOrder();
                return {status: 204,message: "cancel Order success !"};
            }
            else
                return {status: 404, message: "Not found Order !"}
        } catch (error) {
            return {status: 500, message: "Something went wrong !", error: error};
        }
    }
    static async getDataOrderForChart(){
        try {
            const key = `OrderService_getDataOrderForChart`;
            const dataCache = await RedisCache.getCache(key);
            if(dataCache){
                return {status: 200,message: "get data success success !", data: JSON.parse(dataCache)};
            }
            let nowDate = new Date();
            nowDate.setHours(24,0,0,0);
            nowDate.setHours(nowDate.getHours()+7);
            let sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate()-7);
            sevenDaysAgo.setHours(24,0,0,0)
            sevenDaysAgo.setHours(sevenDaysAgo.getHours()+7);
            
            let order = await Order.aggregate([{$match:{status:"DONE"}},{$match:{$and:[{receiveDay:{$lte:nowDate}},{receiveDay:{$gte:sevenDaysAgo}}]}},{$project:{total:1,receiveDay:1}}]);
            console.log(order);
            let listDate :Array<any>=[];
            let listData :Array<any>=[];
            for(let i = 1; i <= 7; i++){
                let nextDate = new Date(sevenDaysAgo);
                nextDate.setDate(nextDate.getDate()+i);
                let afterDate = new Date(sevenDaysAgo);
                afterDate.setDate(nextDate.getDate()-1);
                let totalMoney = 0;
                for (let index = 0; index < order.length; index++) {
                    if(order[index].receiveDay.getTime()>afterDate.getTime()&&order[index].receiveDay.getTime()<nextDate.getTime()){
                        totalMoney+=order[index].total;
                    }
                }
                listData.push(totalMoney);
                listDate.push(afterDate);
            }
            await RedisCache.setCache(key, JSON.stringify({listDate, listData}), 60*5);
            return {status: 200,message: "get data success !", data:{listDate, listData}};
            
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
function filterNumbers(min: number, max: number) {
    return function (a: number) { return a >= min && a <= max; };
}