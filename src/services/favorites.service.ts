import { ObjectId } from "mongodb";
import {Favorite} from "../models/favorite";
export class FavoriteService {

    static async getFavoriteByAccountId(accountId: String){
        try {
            const favorites = await Favorite.aggregate([{$match: { account:new ObjectId(`${accountId}`)}},{$unwind:"$listProduct"},{ "$lookup": { "from": "Product", "localField": "listProduct.product", "foreignField": "_id", "as": "listProduct" }},{$unwind:"$listProduct"},{ "$group": { "_id": "$_id",account:{$first:"$account"}, "listProduct": { "$push": "$listProduct" } }}])
            if(favorites){
                return {status: 200,message: "found Favorite success !", data: favorites}
            }
            else
                return {status: 404, message: "Not found Favorite !"}
        } catch (error) {
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
            const favorite: any = await this.getFavoriteByAccountId(accountId)
            if(favorite){
                const result = await Favorite.updateOne({_id: favorite._id},{$push:{listProductDetail:productId}});
                return {status: 204, message: "update Favorite success !", data: result}
            }
            else
                return {status: 404, message: "Not found account !"}
        } catch (error) {
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }

    static async removeProductFromFavorite(accountId: String, productId: String){
        try {
            const favorite: any = await this.getFavoriteByAccountId(accountId)
            if(favorite){
                const result = await Favorite.updateOne({_id: favorite._id},{$pull:{listProductDetail:productId}});
                return {status: 204, message: "update Favorite success !", data: result}
            }
            else
                return {status: 404, message: "Not found account !"}
        } catch (error) {
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }
}
