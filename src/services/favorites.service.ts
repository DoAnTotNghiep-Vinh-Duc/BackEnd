import {Favorite} from "../models/favorite";
export class FavoriteService {

    static async getFavoriteByAccountId(accountId: String){
        try {
            const favorite = await Favorite.findOne({account: accountId})
            if(favorite){
                return {status: 200,message: "found Favorite success !", data: favorite}
            }
            else
                return {status: 404, message: "Not found Favorite !"}
        } catch (error) {
            return {status: 500, message: "Something went wrong !", error: error};
        }
    }

    static async getFavoriteByProductId(productId: String){
        try {
            const Favorites = await Favorite.find({product: productId})
            if(Favorites.length>0){
                return {status: 200,message: "found Favorite success !", data: Favorites}
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

    static async addProductToFavorite(accountId: String, productDetailIdFavorite: String){
        try {
            const favorite: any = await this.getFavoriteByAccountId(accountId)
            if(favorite){
                const result = await Favorite.updateOne({_id: favorite._id},{$push:{listProductDetail:productDetailIdFavorite}});
                return {status: 204, message: "update Favorite success !", data: result}
            }
            else
                return {status: 404, message: "Not found account !"}
        } catch (error) {
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }

    static async removeProductFromFavorite(accountId: String, productDetailIdRemove: String){
        try {
            const favorite: any = await this.getFavoriteByAccountId(accountId)
            if(favorite){
                const result = await Favorite.updateOne({_id: favorite._id},{$Pull:{listProductDetail:productDetailIdRemove}});
                return {status: 204, message: "update Favorite success !", data: result}
            }
            else
                return {status: 404, message: "Not found account !"}
        } catch (error) {
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }
}
