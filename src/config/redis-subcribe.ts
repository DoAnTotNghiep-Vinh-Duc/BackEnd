import { ObjectId } from 'mongodb';
import { createClient } from 'redis';
import { ProductDetail } from '../models/product-detail';
import { Product } from '../models/product';
import { CartDetail } from '../models/cart-detail';
const client = createClient({
  url: `redis://:@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

export class RedisSubcribe {
    static async connect() {
        await client.connect();
        client.on("error", (err: any) => console.log("Redis Client Error", err));
    }

    static async pubsubchanel(){
        await client.subscribe("__keyevent@0__:expired", async (message, channel)=>{
            if(message.toString().split('_')[0]==="discount"){
                console.log("discount "+ message.toString().split('_')[1]+ " expire");
                const discountId = message.toString().split('_')[1];
                const products = await Product.find({'discount': new ObjectId(`${discountId}`)});
                for (let index = 0; index < products.length; index++) {
                    let productDetails = await ProductDetail.aggregate([{$match:{product:new ObjectId(`${products[index]._id}`)}},{$match:{status:"ACTIVE"}},{$project:{_id:1}}])
                    let productDetailsConvert = productDetails.map(function(id) {
                        return id;
                    });
                    await CartDetail.updateMany({productDetail:{$in:productDetailsConvert}},{$set:{priceDiscount:products[index].price}});
                }
                await Product.updateMany({'discount': new ObjectId(`${discountId}`)},{$set:{'discount':new ObjectId('62599849f8f6be052f0a901d')}})
            }
        });
        client.on("pmessage",async (pattern: any, channel: any, message: any) => {
            console.log(message);
            
        })
    }
}