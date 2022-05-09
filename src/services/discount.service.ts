import {Discount} from "../models/discount";
import { RedisCache } from "../config/redis-cache";
export class DiscountService {

    static async getAllDiscount(){
        try {
            const key = `getAllDiscount`;
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
            const newDiscount = new Discount(discount);
            await newDiscount.save();
            const key = "discount_"+newDiscount._id.toString();
            const times = (discount.startDate.getTime() - discount.endDate.getTime()) / 1000;
            await RedisCache.setCache(key, newDiscount._id, times);
            await RedisCache.delCache("getAllColor")
            return {status: 201, message: "create Discount success !", data: newDiscount}
           
        } catch (error) {
            return{status:500,message: "Something went wrong !", error: error};
        }
    }
}
