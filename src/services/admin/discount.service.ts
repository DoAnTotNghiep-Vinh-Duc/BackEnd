import {Discount} from "../../models/discount";
import { RedisCache } from "../../config/redis-cache";
import { ObjectId } from "mongodb";
import { Product } from "../../models/product";
import { ProductDetail } from "../../models/product-detail";
import { CartDetail } from "../../models/cart-detail";
export class DiscountService {

    static async getAllDiscount(){
        try {
            const key = `getAllDiscount()`;
            const dataCache = await RedisCache.getCache(key);
            if(dataCache){
                return {status: 200,message: "found discount success !", data: JSON.parse(dataCache)};
            }
            const discount = await Discount.find()
            if(discount){
                await RedisCache.setCache(key, JSON.stringify(discount), 60*5);
                return {status: 200,message: "found Discount success !", data: discount}
            }
            else
                return {status: 404, message: "Not found Discount !"}
        } catch (error) {
            return {status: 500, message: "Something went wrong !", error: error};
        }
    }

    static async createDiscount(discount: any){
        try {
            const timeNow = new Date();
            console.log("timeNow",timeNow);
            timeNow.setHours(timeNow.getHours()+7);
            const timeStart = (discount.startDate.getTime()- timeNow.getTime())/1000;
            const timeEnd = (discount.endDate.getTime() -timeNow.getTime()) / 1000;
            console.log(timeStart);
            console.log(timeEnd);
            if(discount.endDate.getTime()-discount.startDate.getTime()<0){
                return {status: 400, message:"start date must be before end date"}
            }
            if(discount.startDate.getTime()- timeNow.getTime()<0){
                return {status: 400, message:"start date cannot be after current date"}
            }
            if(discount.percentDiscount<0||discount.percentDiscount>1){
                return {status: 400, message:"percent discount must >=0 and <=1"}
            }
            const newDiscount = new Discount(discount);
            console.log(newDiscount);
            
            await newDiscount.save();
            const key = `getAllDiscount()`;
            await RedisCache.delCache(key);
            return {status: 201, message: "create Discount success !", data: newDiscount}
           
        } catch (error) {
            console.log(error);
            
            return{status:500,message: "Something went wrong !", error: error};
        }
    }

    static async updateDiscount(discount: any){
        try {
            const objDiscount = await Discount.findOne({_id: new ObjectId(`${discount._id}`)});
            if(!objDiscount){
                return {status: 404, message: "Not found discount !"};
            }
            console.log(discount);
            
            const timeNow = new Date();
            console.log("timeNow",timeNow);
            timeNow.setHours(timeNow.getHours()+7);
            const timeStart = (discount.startDate.getTime()- timeNow.getTime())/1000;
            const timeEnd = (discount.endDate.getTime() -timeNow.getTime()) / 1000;
            console.log(timeStart);
            console.log(timeEnd);
            if(discount.percentDiscount<0||discount.percentDiscount>1){
                return {status: 400, message:"phần trăm giảm giá phải từ 0->1"}
            }
            if(discount.endDate.getTime()-discount.startDate.getTime()<0){
                return {status: 400, message:"ngày bắt đầu phải trước ngày kết thúc"}
            }
            if(objDiscount.startDate.getTime()<timeNow.getTime()){
                if(objDiscount.startDate.getTime()!==discount.startDate.getTime()){
                    return {status: 400, message:"discount này đã bắt đầu, bạn không thể sửa ngày bắt đầu !"}
                }
            }
            if(objDiscount.startDate.getTime()> timeNow.getTime()){
                if(discount.startDate.getTime()- timeNow.getTime()<0){
                    return {status: 400, message:"ngày bắt đầu không được trước ngày hiện tại"}
                }
            }

            objDiscount.nameDiscount = discount.nameDiscount;
            objDiscount.startDate = discount.startDate;
            objDiscount.endDate = discount.endDate;
            objDiscount.percentDiscount = discount.percentDiscount;
            await objDiscount.save();
            const key = `getAllDiscount()`;
            await RedisCache.delCache(key);
            return {status: 204, message: "update discount success !"}
           
        } catch (error) {
            console.log(error);
            
            return{status:500,message: "Something went wrong !", error: error};
        }
    }

    static async deleteDiscount(discountId: String){
        try {
            
            const discount = await Discount.findOne({_id:discountId});
            let now = new Date();
            now.setHours(now.getHours()+7);
            if(discount.startDate.getTime()<now.getTime()&&discount.endDate.getTime()>now.getTime()){
                return {status: 400, message:"Bạn không thể xóa giảm giá này"}
            }
            // const products = await Product.find({discount: new ObjectId(`${discountId}`)})
            await Discount.deleteOne({_id: new ObjectId(`${discountId}`)});
            const key = `getAllDiscount()`;
            const products = await Product.find({'discount': new ObjectId(`${discountId}`)});
            for (let index = 0; index < products.length; index++) {
                let productDetails = await ProductDetail.aggregate([{$match:{product:new ObjectId(`${products[index]._id}`)}},{$match:{status:"ACTIVE"}},{$project:{_id:1}}])
                let productDetailsConvert = productDetails.map(function(id) {
                    return id;
                });
                await CartDetail.updateMany({productDetail:{$in:productDetailsConvert}},{$set:{priceDiscount:products[index].price}});
            }
            await Product.updateMany({'discount': new ObjectId(`${discountId}`)},{$set:{'discount':new ObjectId('62599849f8f6be052f0a901d')}})
            delKeyRedisWhenDeleteDiscount();
            await RedisCache.delCache(key);
            return {status: 200, message:"delete discount success !"};
        } catch (error) {
            return{status:500,message: "Something went wrong !", error: error};
        }
    }
}
async function delKeyRedisWhenDeleteDiscount() {
    const keysCart = await RedisCache.getKeys(`CartService*`);
    await RedisCache.delKeys(keysCart);
    const keysProduct = await RedisCache.getKeys(`ProductService*`);
    await RedisCache.delKeys(keysProduct);
    const keysFavorite = await RedisCache.getKeys(`FavoriteService*`);
    await RedisCache.delKeys(keysFavorite);
}