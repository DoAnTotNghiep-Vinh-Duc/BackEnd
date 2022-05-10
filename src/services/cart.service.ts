import { ObjectId } from "mongodb";
import { Product } from "../models/product";
import {Cart} from "../models/cart";
import { ProductDetailService } from "./product-detail.service";
import { ProductService } from "./product.service";
import {CartDetail} from "../models/cart-detail";
import { RedisCache } from "../config/redis-cache";
export class CartService {

    static async getCartByAccountId(accountId: String){
        try {
            const key = `CartService_getCartByAccountId(accountId:${accountId})`;
            const dataCache = await RedisCache.getCache(key);
            if(dataCache){
                return {status: 200,message: "found Cart success !", data: JSON.parse(dataCache)};
            }
            let cart = await Cart.findOne({account: accountId})
            
            if(!cart){
                return {status: 404, message: "Not found Cart !"}
            }
            cart = await Cart.aggregate([{ $match: { account: new ObjectId(`${accountId}`) }},{ "$lookup": { "from": "CartDetail", "localField": "listCartDetail", "foreignField": "_id", "as": "listCartDetail" }},{$unwind:"$listCartDetail"},{ "$lookup": { "from": "ProductDetail", "localField": "listCartDetail.productDetail", "foreignField": "_id", "as": "listCartDetail.productDetail" }},{$unwind:"$listCartDetail.productDetail"},{ "$lookup": { "from": "Product", "localField": "listCartDetail.productDetail.product", "foreignField": "_id", "as": "listCartDetail.productDetail.product" }},{$unwind:"$listCartDetail.productDetail.product"},{ "$lookup": { "from": "Color", "localField": "listCartDetail.productDetail.color", "foreignField": "_id", "as": "listCartDetail.productDetail.color" }},{$unwind:"$listCartDetail.productDetail.color"},{$project:{"listCartDetail.productDetail.product.description":0,"listCartDetail.productDetail.product.typeProducts":0,"listCartDetail.productDetail.product.listProductDetail":0,"listCartDetail.productDetail.product.images":0,"listCartDetail.productDetail.product.created_at":0,"listCartDetail.productDetail.product.updated_at":0,"listCartDetail.productDetail.product.supplier":0}},{ "$group": { "_id": "$_id",account:{$first:"$account"}, "listCartDetail": { "$push": "$listCartDetail" } }}])
            
            if(cart[0]){
                await RedisCache.setCache(key, JSON.stringify(cart[0]), 60*5);
                return {status: 200,message: "found Cart success !", data: cart[0]}
            }
            else
                await RedisCache.setCache(key, JSON.stringify(cart), 60*5);
                return {status: 200,message: "found Cart success !", data: cart}
        } catch (error) {
            return {status: 500, message: "Something went wrong !", error: error};
        }
    }

    static async createCart(cart: any){
        try {
            const newCart = new Cart(cart);
            await newCart.save()
            return {status: 201, message: "create Cart success !", data: newCart}
           
        } catch (error) {
            return{status:500,message: "Something went wrong !", error: error};
        }
    }

    // static async updateCartAfterChangePriceProduct(productId: String){
    //     try {
    //         const carts: any = Cart.aggregate([{ $match: {}},{$unwind:"$listCartDetail"},{ "$lookup": { "from": "ProductDetail", "localField": "listCartDetail.productDetail", "foreignField": "_id", "as": "listCartDetail.productDetail" }},{$unwind:"$listCartDetail.productDetail"},{ "$lookup": { "from": "Product", "localField": "listCartDetail.productDetail.product", "foreignField": "_id", "as": "listCartDetail.productDetail.product" }},{$unwind:"$listCartDetail.productDetail.product"},{$project:{"listCartDetail.productDetail.product.description":0,"listCartDetail.productDetail.product.typeProducts":0,"listCartDetail.productDetail.product.listProductDetail":0,"listCartDetail.productDetail.product.images":0,"listCartDetail.productDetail.product.created_at":0,"listCartDetail.productDetail.product.updated_at":0,"listCartDetail.productDetail.product.supplier":0}},{ "$group": { "_id": "$_id",account:{$first:"$account"}, total:{$first:"$total"}, "listCartDetail": { "$push": "$listCartDetail" } }},{$match:{"listCartDetail":{$elemMatch:{"productDetail.product._id":new ObjectId(`${productId}`)}}}}])

    //         const product = await Product.findById(productId)

    //         for (let i = 0; i < carts.length; i++) {
    //             for (let j = 0; j < carts[i].listCartDetail.length; j++) {
    //                 const element = carts[i].listCartDetail[j];
    //                 if(carts[i].listCartDetail[j].productDetail.product._id===new ObjectId(`${productId}`)){
    //                     carts[i].listCartDetail[j].price = carts[i].listCartDetail[j].productDetail.product.price;
    //                     carts[i].total+=carts[i].listCartDetail[j].quantity*carts[i].listCartDetail[j].productDetail.product.price - carts[i].listCartDetail[j].total; // Tổng tiền giỏ hàng sẽ cộng cho tổng số tiền mới từng món - tổng số tiền cũ của từng món
    //                     carts[i].listCartDetail[j].total = carts[i].listCartDetail[j].quantity*carts[i].listCartDetail[j].productDetail.product.price;
    //                 }
    //             }
                
    //         }
    //         return {status: 204, message: "update Cart success !"}
    //     } catch (error) {
    //         return {status: 500,message: "Something went wrong !", error: error};
    //     }
    // }

    static async addToCart (accountId: String, productDetailId: String, quantity: number){
        try {
            const cart: any = await Cart.findOne({account: accountId});
            const cartDetail = await CartDetail.findOne({$and:[{cartId:cart._id},{productDetail: new ObjectId(`${productDetailId}`)}, {status:"ACTIVE"}]});
            console.log(cartDetail);
            
            const productDetail = await ProductDetailService.getProductDetailById(productDetailId);
            const products = await Product.aggregate([{$match:{_id:new ObjectId(`${productDetail.data.product}`)}}, {$lookup:{from:"Discount", localField:"discount",foreignField:"_id", as:"discount"}},{$unwind:"$discount"}])
            const product = products[0];
            if(quantity<=productDetail.data.quantity){
                if(cartDetail){
                    if(quantity+cartDetail.quantity<= productDetail.data.quantity){
                        cartDetail.quantity+=quantity;
                        await cartDetail.save();
                        return {status: 204, message:"add product to cart success !"};
                    }
                    else{
                        return {status: 400, message:"error: quantity > quantity in stock !"};
                    }
                }
                else{
                    const newCartDetail = new CartDetail({
                        cartId: cart._id,
                        productDetail: productDetailId,
                        quantity: quantity,
                        price: product.price,
                        priceDiscount: product.price*(1-product.discount.percentDiscount)
                    }) 
                    await newCartDetail.save();
                    cart.listCartDetail.push(newCartDetail._id);
                    await cart.save();
                    const key = `CartService_getCartByAccountId(accountId:${accountId})`;
                    await RedisCache.delCache(key);
                    return {status: 204, message:"add product to cart success !"};
                }
            }
            else{
                return {status: 400, message:"error: quantity > quantity in stock !"};
            }
        } catch (error) {
            console.log("err: ", error)
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }

    static async removeProductOutCart(accountId: String, productDetailId: String){
        try {
            const cart: any = await Cart.findOne({account: accountId});
            const cartDetail = await CartDetail.findOneAndDelete({$and:[{cartId:cart._id},{productDetail: new ObjectId(`${productDetailId}`)}, {status:"ACTIVE"}]});
            
            for (let index = 0; index < cart.listCartDetail.length; index++) {
                if(cart.listCartDetail[index].toString() === cartDetail._id .toString()){
                    cart.listCartDetail.splice(index, 1);
                    break;
                }
            }
            await cart.save()
            const key = `CartService_getCartByAccountId(accountId:${accountId})`;
            await RedisCache.delCache(key);
            return {status: 204, message:"remove product out cart success !"};
        } catch (error) {
            console.log(error);
            
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }

    static async increaseQuantity(accountId: String, productDetailId: String){
        try {
            const productDetail = await ProductDetailService.getProductDetailById(productDetailId);
            const cart = await Cart.findOne({account: new ObjectId(`${accountId}`)})
            const cartDetail = await CartDetail.findOne({$and:[{cartId: cart._id},{productDetail: new ObjectId(`${productDetailId}`)}, {status:"ACTIVE"}]});
            if(cartDetail.quantity+1> productDetail.data.quantity){
                cartDetail.quantity = productDetail.data.quantity;
                await cartDetail.save();
                return {status: 400, message:"error: quantity > quantity in stock !"};
            }
            cartDetail.quantity+=1;
            await cartDetail.save();
            const key = `CartService_getCartByAccountId(accountId:${accountId})`;
            await RedisCache.delCache(key);
            return {status: 204, message:"update cart success !"};
        } catch (error) {
            return {status: 500, message: "Something went wrong !", error: error};
        }
    }

    static async decreaseQuantity(accountId: String, productDetailId: String){
        try {
            const cart = await Cart.findOne({account: new ObjectId(`${accountId}`)})
            const cartDetail = await CartDetail.findOne({$and:[{cartId:cart._id},{productDetail: new ObjectId(`${productDetailId}`)}, {status:"ACTIVE"}]});
            if(cartDetail.quantity===1){
                return {status: 400, message:"can not decease because quantity = 1 ! you just remove item !"};
            }
            else{
                cartDetail.quantity-=1;
                await cartDetail.save();
                const key = `CartService_getCartByAccountId(accountId:${accountId})`;
                await RedisCache.delCache(key);
                return {status: 204, message:"update cart success !"};
            }
            
        } catch (error) {
            return {status: 500, message: "Something went wrong !", error: error};
        }
    }
}
