import {Order} from "../models/order";
import {Cart} from "../models/cart"
import { ProductDetail } from "../models/product-detail";
import { ObjectId } from "mongodb";
export class OrderService {

    static async getOrderByAccountId(accountId: String){
        try {
            const order = await Order.findOne({account: accountId})
            if(order){
                return {status: 200,message: "found Order success !", data: order}
            }
            else
                return {status: 404, message: "Not found Order !"}
        } catch (error) {
            return {status: 500, message: "Something went wrong !", error: error};
        }
    }

    static async createOrder(order: any){
        try {
            const cart = await Cart.findOne({account: order.account})
            let totalOrderPrice = 0;
            let listOrderDetail = [];
            let listOutOfStock = [];
            for(let i =0;i< order.listOrderDetail.length; i++){
                let result = cart.listCartDetail.find((obj: any) => {
                    return obj.productDetail.toString() === order.listOrderDetail[i]
                })          
                if(result){
                    if(result.productDetail.quantity<result.quantity){
                        listOutOfStock.push(result)
                    }
                    else{
                        const productDetail = await ProductDetail.findById(result.productDetail._id)
                        listOrderDetail.push({productDetail:result.productDetail,quantity:result.quantity, price: result.priceDiscount})
                        totalOrderPrice+=result.quantity*result.priceDiscount
                        
                        productDetail.quantity-=result.quantity; // Giảm số lượng trong kho
                        await productDetail.save()
                        await Cart.findByIdAndUpdate({_id:cart._id},{$pull:{'listCartDetail':{productDetail:result.productDetail._id}}})
                    }
                }
            }
            if(listOutOfStock.length>0){
                return {status: 400, message: "can not create order ! product out of stock !", data:listOutOfStock}
            }
            if(totalOrderPrice>0){
                const newOrder = new Order({
                    account: order.account,
                    listOrderDetail,
                    total: totalOrderPrice,
                    name: order.name,
                    address: order.address,
                    phone: order.phone
                })
                await newOrder.save();
                return {status: 201, message: "create Order success !", data:newOrder}
            }
            else{
                return {status: 400, message: "can not create order !",}
            }
           
        } catch (error) {
            console.log("error",error);
            
            return{status:500,message: "Something went wrong !", error: error};
        }
    }
}
