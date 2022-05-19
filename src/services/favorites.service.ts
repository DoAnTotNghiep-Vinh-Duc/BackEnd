import { ObjectId } from "mongodb";
import { RedisCache } from "../config/redis-cache";
import {Favorite} from "../models/favorite";
export class FavoriteService {

    static async getFavoriteByAccountId(accountId: String){
        try {
            const key = `getFavoriteByAccountId(accountId:${accountId})`;
            const dataCache = await RedisCache.getCache(key);
            if(dataCache){
                return {status: 200,message: "found Favorite success !", data: JSON.parse(dataCache)};
            }
            let favorites: any = await Favorite.aggregate([{$match: { account:new ObjectId(`${accountId}`)}}]);
            console.log(favorites);
            
            if(favorites[0].listProduct.length>0){
                favorites = await Favorite.aggregate([{$match: {  account:new ObjectId(`${accountId}`)}},{ "$lookup": { "from": "Product", "localField": "listProduct", "foreignField": "_id", "as": "listProduct" }},{$unwind:"$listProduct"},{$lookup:{from:"Discount", localField:"listProduct.discount",foreignField:"_id", as:"listProduct.discount"}},{$unwind:"$listProduct.discount"},{$group:{"_id":"$account", listProduct:{$push:"$listProduct"}}},{$project:{"listProduct.account": 0}}])
            }
            await RedisCache.setCache(key, JSON.stringify(favorites[0]), 60*5);
            return {status: 200,message: "found Favorite success !", data: favorites[0]}
        } catch (error) {
            console.log(error);
            
            return {status: 500, message: "Something went wrong !", error: error};
        }
    }

    static async createFavorite(favorite: any){
        try {
            const newFavorite = new Favorite(favorite);
            await newFavorite.save();
            return {status: 201, message: "create Favorite success !", data: newFavorite}
           
        } catch (error) {
            return{status:500,message: "Something went wrong !", error: error};
        }
    }

    static async addProductToFavorite(accountId: String, productId: String){
        try {
            let favorite = await Favorite.findOne({ account:new ObjectId(`${accountId}`)});
            console.log(favorite);
            
            if(favorite){
                let isAlreadyExist = false;
                for (let index = 0; index < favorite.listProduct.length; index++) {
                    const element = favorite.listProduct[index];
                    if(element.toString()===productId){
                        isAlreadyExist = true;
                        break;
                    }
                }
                if(!isAlreadyExist){
                    favorite.listProduct.push(new ObjectId(`${productId}`))
                    await favorite.save()
                }
                await RedisCache.delCache(`getFavoriteByAccountId(accountId:${accountId})`)
                return {status: 200, message: "add product to favorite success !", data: favorite}
            }
            else
                return {status: 404, message: "Not found account !"}
        } catch (error) {
            console.log(error);
            
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }

    static async removeProductFromFavorite(accountId: String, productId: String){
        try {
            const favorite = await Favorite.findOneAndUpdate({ account:new ObjectId(`${accountId}`)},{ $pull: { 'listProduct': new ObjectId(`${productId}`) } })
            await RedisCache.delCache(`getFavoriteByAccountId(accountId:${accountId})`)
            return {status: 204, message: "update Favorite success !", data: favorite}
            
        } catch (error) {
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }
}
