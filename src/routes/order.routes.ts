import express from 'express';
import { OrderController } from '../controllers/order-controller';
import { CheckPhoneMiddleware } from '../middleware/check-phone-middleware';
import { AuthMiddleware } from '../middleware/auth-middleware';
import paypal from "paypal-rest-sdk"
import { OrderService } from '../services/order.service';
import mongoose from 'mongoose';
import { Cart } from '../models/cart';
import { Information } from '../models/information';
import { Account } from '../models/account';
import { CartDetail } from '../models/cart-detail';
import { ProductDetail } from '../models/product-detail';
import { Order } from '../models/order';
import { RedisCache } from '../config/redis-cache';
export const orderRoutes = express.Router();
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': `${process.env.PAYPAL_CLIENTID}`,
    'client_secret': `${process.env.PAYPAL_CLIENTSECRET}`
});
orderRoutes.get("/payment-paypal",async (req, res)=>{
    try {
        const account = req.payload.userId;
        // const order = req.body // order = {listOrderDetail, name, city, district, ward, street, phone}
        const order = {
            "account":"627680b34a41c1347aef6e06",
            "listOrderDetail":["6293998830ca8f682db50f0c"],
            "name":"Vinh",
            "city":"Hồ Chí Minh",
            "district":"Gò Vấp",
            "ward":"phường 4",
            "street":"Nguyễn Văn Bảo",
            "phone":"0905242343"
        }
        let total = 0;
        const session = await mongoose.startSession();
        session.startTransaction();
        const opts = {session,returnOriginal: false};

        const cart = await Cart.findOne({account: order.account})
        const cartDetail = await CartDetail.find({$and:[{cartId:cart._id}, {status:"ACTIVE"}]});
        let items: Array<any> = [];

        let listOutOfStock = [];
        for(let i =0;i< order.listOrderDetail.length; i++){
            let result = cartDetail.find((obj: any) => {
                return obj.productDetail.toString() === order.listOrderDetail[i]
            })          
            if(result){
                const productDetail = await ProductDetail.aggregate([{$match:{_id: result.productDetail}},{ "$lookup": { "from": "Product", "localField": "product", "foreignField": "_id", "as": "product" }},{$unwind:"$product"},{ "$lookup": { "from": "Color", "localField": "color", "foreignField": "_id", "as": "color" }},{$unwind:"$color"}]);
                let tmpObject = {
                    "name": productDetail[0].product.name+ " "+productDetail[0].size+ " " +productDetail[0].color.name,
                    "sku": `${productDetail[0]._id.slice(-6)}`,
                    "price": `${productDetail[0].product.priceDiscount/23000}`,
                    "currency": "USD",
                    "quantity": result.quantity
                }
                items.push(tmpObject);
                total+=productDetail[0].product.priceDiscount/23000;
                if(result.quantity>productDetail[0].quantity){
                    listOutOfStock.push(result)
                }
            }
        }
        if(listOutOfStock.length>0){
            return {status: 400, message: "Bạn không thể đặt hàng ! Hết hàng !"}
        }
        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": `http://localhost:${process.env.PORT}/order/success`,
                "cancel_url": `http://localhost:${process.env.PORT}/order/cancel`
            },
            "transactions": [{
                "item_list": {
                    "items": items
                },
                "amount": {
                    "currency": "USD",
                    "total": total.toString()
                },
                "description": "Đặt hàng"
            }]
        }

        paypal.payment.create(create_payment_json,async function (error: any, payment: any) {
            if (error) {
                return { status: 400, message: "cancel" };
            } else {
                for (let i = 0; i < payment.links.length; i++) {
                    console.log(payment.links);

                    if (payment.links[i].rel === 'approval_url') {
                        console.log("return here");
                        await RedisCache.setCache(`OrerPaypal_${account}`,order, 60*5);
                        res.redirect(payment.links[i].href);
                    }
                }
            }
        });
        return {status:400, message:"Something went wrong !"};
    } catch (error) {
        console.log(error);
        return {status:500, message:"something went wrong !"};
        
    }
})

orderRoutes.get("/cancel",(req, res)=>{
    console.log("Cancel");
    res.status(200).send("Cancel success")
})

orderRoutes.get("/success",AuthMiddleware.verifyAccessToken,AuthMiddleware.checkAccountIsActive,CheckPhoneMiddleware.checkVerifyPhone,async (req, res)=>{
    const account = req.payload.userId;
    let cacheOrder = await RedisCache.getCache(`OrerPaypal_${account}`);
    if(!cacheOrder){
        return res.send('error');
    }
    const payerId = req.query.PayerID;
    const paymentId: any = req.query.paymentId;
    let parseCacheOrder = JSON.parse(cacheOrder);
    let total = 0;
    const cart = await Cart.findOne({account: parseCacheOrder.account})
    const cartDetail = await CartDetail.find({$and:[{cartId:cart._id}, {status:"ACTIVE"}]});
    for(let i =0;i< parseCacheOrder.listOrderDetail.length; i++){
        let result = cartDetail.find((obj: any) => {
            return obj.productDetail.toString() === parseCacheOrder.listOrderDetail[i]
        })          
        if(result){
            const productDetail = await ProductDetail.aggregate([{$match:{_id: result.productDetail}},{ "$lookup": { "from": "Product", "localField": "product", "foreignField": "_id", "as": "product" }},{$unwind:"$product"},{ "$lookup": { "from": "Color", "localField": "color", "foreignField": "_id", "as": "color" }},{$unwind:"$color"}]);
            let tmpObject = {
                "name": productDetail[0].product.name+ " "+productDetail[0].size+ " " +productDetail[0].color.name,
                "sku": `${productDetail[0]._id.slice(-6)}`,
                "price": `${productDetail[0].product.priceDiscount/23000}`,
                "currency": "USD",
                "quantity": result.quantity
            }
            total+=productDetail[0].product.priceDiscount/23000;
        }
    }
    const execute_payment_json: any = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": total.toString()
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
        if (error) {
        return res.send('error');
        } else {
            const data = await OrderService.createOrder(parseCacheOrder);

            return res.redirect("http://localhost:3000");
        }
    });
})
orderRoutes.post("/",AuthMiddleware.verifyAccessToken,AuthMiddleware.checkAccountIsActive,CheckPhoneMiddleware.checkVerifyPhone, OrderController.createOrder);
orderRoutes.get("/get-order-by-account", AuthMiddleware.verifyAccessToken,AuthMiddleware.checkAccountIsActive, OrderController.getOrderByAccountId)
orderRoutes.get("/get-order-by-orderId/:orderId", AuthMiddleware.verifyAccessToken,AuthMiddleware.checkAccountIsActive, OrderController.getOrderByOrderId)
orderRoutes.post("/cancel-order",AuthMiddleware.verifyAccessToken,AuthMiddleware.checkAccountIsActive,CheckPhoneMiddleware.checkVerifyPhone, OrderController.cancelOrder)

async function delKeyRedisWhenChangeOrder() {
    const keysOrder = await RedisCache.getKeys(`OrderService*`);
    await RedisCache.delKeys(keysOrder);
    const keysCart = await RedisCache.getKeys(`CartService*`);
    await RedisCache.delKeys(keysCart);
    const keysProduct = await RedisCache.getKeys(`ProductService*`);
    await RedisCache.delKeys(keysProduct);
}