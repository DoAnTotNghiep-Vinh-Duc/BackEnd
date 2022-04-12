import {Cart} from "../models/cart";
import mongoose from 'mongoose';
import { ProductDetailService } from "./product-detail.service";
import { ProductService } from "./product.service";
import { ObjectId } from "mongodb";
export class CartService {

    static async getCartById(cartId: String){
        try {
            const cart = await Cart.findById(cartId)
            if(cart){
                return {status: 200,message: "found Cart success !", data: cart}
            }
            else
                return {status: 404, message: "Not found Cart !"}
        } catch (error) {
            return {status: 500, message: "Something went wrong !", error: error};
        }
    }

    static async getCartByAccountId(accountId: String){
        try {
            const cart = await Cart.findOne({account: accountId})
            console.log(cart)
            if(cart){
                return {status: 200,message: "found Cart success !", data: cart}
            }
            else
                return {status: 404, message: "Not found Cart !"}
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

    static async updateCartByAccountId(accountId: String, newCart: any){
        try {
            const cart = await Cart.findOne({account: accountId })
            if(cart){
                const result = await Cart.findByIdAndUpdate(cart._id, newCart);
                return {status: 204, message: "update Cart success !", data: result}
            }
            else
                return {status: 404, message: "Not found Color Image !"}
        } catch (error) {
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }

    static async addToCart (accountId: String, productDetailId: String){
        try {
            const productDetail = await ProductDetailService.getProductDetailById(productDetailId);
            const product = await ProductService.getProductById(productDetail.data.product);
            const cart: any = await Cart.findOne({account: accountId});

            let checkExistItem = false;
            for (let index = 0; index < cart.listCartDetail.length; index++) {
                if(cart.listCartDetail[index].productDetail.toString() === productDetailId ){
                    console.log("Đã tồn tại");
                    cart.listCartDetail[index].quantity+=1;
                    cart.listCartDetail[index].total+=product.data.price;
                    cart.total += product.data.price;
                    checkExistItem = true;
                    break;
                }
            }

            if(!checkExistItem){          
                const itemInCart = {
                    productDetail: productDetailId,
                    quantity: 1,
                    price: product.data.price,
                    total: product.data.price*1
                }
                cart.listCartDetail.push(itemInCart);
                cart.total+=itemInCart.total;         
            }
            await cart.save()  

            return {status: 204, message:"add product to cart success !"};
        } catch (error) {
            console.log("err: ", error)
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }

    static async removeProductOutCart(accountId: String, productDetailId: String){
        try {
            const cart: any = await Cart.findOne({account: accountId});
            let i = 0;
            for (let index = 0; index < cart.listCartDetail.length; index++) {
                if(cart.listCartDetail[index].productDetail.toString() === productDetailId ){
                    i = index;
                    break;
                }
            }
            cart.listCartDetail.splice(i, 1);
            return {status: 204, message:"remove product out cart success !"};
        } catch (error) {
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }

    static async increaseQuantity(accountId: String, productDetailId: String){
        try {
            const data = await Cart.updateOne({account: accountId},{$addToSet:{"listCartDetail":{'productDetail':productDetailId,'quantity':'$quantity'+1}}})
            return {sstatus: 204, message:"update cart success !", data};
        } catch (error) {
            return {status: 500, message: "Something went wrong !", error: error};
        }
    }
}
