import {Cart} from "../models/cart";
import mongoose from 'mongoose';
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
            if(cart){
                return {status: 200,message: "found Cart success !", data: Cart}
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
}
