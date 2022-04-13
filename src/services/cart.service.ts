import {Cart} from "../models/cart";
import { ProductDetailService } from "./product-detail.service";
import { ProductService } from "./product.service";
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

    static async addToCart (accountId: String, productDetailId: String, quantity: number){
        try {
            const productDetail = await ProductDetailService.getProductDetailById(productDetailId);
            const product = await ProductService.getProductById(productDetail.data.product);
            const cart: any = await Cart.findOne({account: accountId});
            if(quantity<=productDetail.data.quantity){
                let checkExistItem = false;
                for (let index = 0; index < cart.listCartDetail.length; index++) {
                    if(cart.listCartDetail[index].productDetail.toString() === productDetailId ){
                        console.log("Đã tồn tại");
                        if(quantity+cart.listCartDetail[index].quantity<=productDetail.data.quantity) {
                            cart.listCartDetail[index].quantity+=quantity;
                            cart.listCartDetail[index].total+=product.data.price*quantity;
                            cart.total += product.data.price*quantity;
                            checkExistItem = true;
                        }
                        else{
                            return {status: 400, message:"error: quantity > quantity in stock !"};
                        }
                        break;
                    }
                }
    
                if(!checkExistItem){          
                    const itemInCart = {
                        productDetail: productDetailId,
                        quantity: quantity,
                        price: product.data.price,
                        total: product.data.price*quantity
                    }
                    cart.listCartDetail.push(itemInCart);
                    cart.total+=itemInCart.total;         
                }
                await cart.save()  
    
                return {status: 204, message:"add product to cart success !"};
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
            for (let index = 0; index < cart.listCartDetail.length; index++) {
                if(cart.listCartDetail[index].productDetail.toString() === productDetailId ){
                    cart.total-= cart.listCartDetail[index].total;
                    cart.listCartDetail.splice(index, 1);
                    break;
                }
            }
            await cart.save()
            return {status: 204, message:"remove product out cart success !"};
        } catch (error) {
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }

    static async increaseQuantity(accountId: String, productDetailId: String){
        try {
            const productDetail = await ProductDetailService.getProductDetailById(productDetailId);
            const cart: any = await Cart.findOne({account: accountId});
            for (let index = 0; index < cart.listCartDetail.length; index++) {
                if(cart.listCartDetail[index].productDetail.toString() === productDetailId ){
                    if(cart.listCartDetail[index].quantity+1>productDetail.data.quantity){
                        cart.listCartDetail[index].quantity = productDetail.data.quantity;
                        cart.total-= cart.listCartDetail[index].price * (productDetail.data.quantity - cart.listCartDetail[index].quantity);
                        cart.listCartDetail[index].total-=cart.listCartDetail[index].price * (productDetail.data.quantity - cart.listCartDetail[index].quantity);
                        return {status: 400, message:"error: quantity > quantity in stock !"};
                    }
                    else{
                        cart.total+= cart.listCartDetail[index].price;
                        cart.listCartDetail[index].quantity+=1;
                        cart.listCartDetail[index].total+=cart.listCartDetail[index].price;
                    }
                    break;
                }
            }
            await cart.save()
            return {status: 204, message:"update cart success !"};
        } catch (error) {
            return {status: 500, message: "Something went wrong !", error: error};
        }
    }

    static async decreaseQuantity(accountId: String, productDetailId: String){
        try {
            const cart: any = await Cart.findOne({account: accountId});
            for (let index = 0; index < cart.listCartDetail.length; index++) {
                if(cart.listCartDetail[index].productDetail.toString() === productDetailId ){
                    if(cart.listCartDetail[index].quantity===1){
                        return {status: 400, message:"can not decease because quantity = 1 ! you just remove item !"};
                    }
                    else{
                        cart.total-= cart.listCartDetail[index].price;
                        cart.listCartDetail[index].quantity-=1;
                        cart.listCartDetail[index].total-=cart.listCartDetail[index].price;
                    }
                    break;
                }
            }
            await cart.save()
            return {status: 204, message:"update cart success !"};
        } catch (error) {
            return {status: 500, message: "Something went wrong !", error: error};
        }
    }
}
