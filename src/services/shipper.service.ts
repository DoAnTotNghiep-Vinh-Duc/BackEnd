import { ObjectId } from "mongodb";
import { Order } from "../models/order";
import { RedisCache } from "../config/redis-cache";
import AWS from "aws-sdk";
import { v4 as uuid } from "uuid";
import { ProductDetail } from "../models/product-detail";
export class ShipperService {
    static async receiveOrder(accountId: String, orderId: String){
        try {
            const order = await Order.findOne({_id:new ObjectId(`${orderId}`), shipper: new ObjectId(`${accountId}`), status:"WAITING"});
            if(!order){
                return {status: 404, message:"Không tìm thấy đơn hàng cần nhận"};
            }
            const timezone = "Asia/Ho_Chi_Minh";
            let start = new Date();
            start.setHours(start.getHours()+7);
            await Order.updateOne({_id:new ObjectId(`${orderId}`)},{$set:{status:"DELIVERING", deliveryDay: start}})
            const keysOrder = await RedisCache.getKeys(`OrderService*`);
            await RedisCache.delKeys(keysOrder);
            return {status: 200, message:"nhận hàng thành công, bắt đầu vận chuyển !"}
        } catch (error) {
            return{status: 500,message: "Something went wrong !", error: error};
        }
    }

    static async finishOrder(accountId: String, orderId: String){
        try {
            // if(uploadFile.length>0){
            //     const order = await Order.findOne({_id:new ObjectId(`${orderId}`), shipper: new ObjectId(`${accountId}`), status:"DELIVERING"});
            //     if(!order){
            //         return {status: 404, message:"Không tìm thấy đơn hàng cần hoàn tất"};
            //     }
            //     const s3 = new AWS.S3({
            //         accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}`,
            //         secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`,
            //         region:"us-east-1"
            //     });
            //     let listImageUrl = [];
            //     for(let i = 0; i< uploadFile.length; i++){
            //         let ul = uploadFile[i].originalname.split(".");
            //         let filesTypes = ul[ul.length - 1];
            //         let filePath = `${uuid() + Date.now().toString()}.${filesTypes}`;
            //         console.log("filePath", filePath);
                    
            //         let params: any = {
            //             Body: uploadFile[i].buffer,
            //             Bucket: `${process.env.AWS_BUCKET_NAME}`,
            //             Key: `${filePath}`,
            //             ACL: "public-read",
            //             ContentType: uploadFile[i].mimetype,
            //         };
            //         let s3Response = await s3.upload(params).promise();
            //         console.log("s3Response",s3Response);
                    
            //         listImageUrl.push(s3Response.Location)
            //     }
            //     console.log("listImageUrl",listImageUrl);

                
            // }
            // else{
            //     return {status:400, message:"Bạn cần phải có hình ảnh xác thực !"};
            // }
            const timezone = "Asia/Ho_Chi_Minh";
            let start = new Date();
            start.setHours(start.getHours()+7);
            await Order.updateOne({_id:new ObjectId(`${orderId}`), shipper:new ObjectId(`${accountId}`)},{$set:{status:"DONE", receiveDay: start}})

            // await Order.updateOne({_id:new ObjectId(`${orderId}`)},{$set:{status:"DONE", receiveDay: start, confirmOrderImage:listImageUrl}})
            const keysOrder = await RedisCache.getKeys(`OrderService*`);
            await RedisCache.delKeys(keysOrder);
            return {status: 200, message:"Hoàn tất đơn hàng !"}
        } catch (error) {
            return{status: 500,message: "Something went wrong !", error: error};
        }
    }

    static async cancelOrder(orderId: String){
        try {
            let order = await Order.findOne({_id:new ObjectId(`${orderId}`)});
            if(order){
                await Order.updateOne({_id:new ObjectId(`${orderId}`)},{$set:{status:"CANCELED"}})
                for (let index = 0; index < order.listOrderDetail.length; index++) {
                    const element = order.listOrderDetail[index];
                    await ProductDetail.findOneAndUpdate({_id:order.listOrderDetail[index].productDetail},{$inc:{quantity:order.listOrderDetail[index].quantity}})
                }
                delKeyRedisWhenChangeOrder();
                return {status: 204,message: "cancel Order success !"};
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