import cron from "node-cron";
import { Product } from "../models/product";
import { Discount } from "../models/discount";
import { ObjectId } from "mongodb";
import { ProductDetail } from "../models/product-detail";
import { CartDetail } from "../models/cart-detail";
// Từ thứ 2 đến chủ nhật, vào lúc 0 giờ 0 phút 0 giây
var discountSchedule = cron.schedule(`${process.env.DISCOUNT_SCHEDULE}`,async () =>  {
    console.log("cronjob is running !");
    const listDiscount = await Discount.find();
    let now = new Date();
    console.log("now",now.getDate(),now.getMonth(),now.getFullYear());
    
    for (let index = 0; index < listDiscount.length; index++) {
        console.log("listDiscount[index].startDate",listDiscount[index].startDate,listDiscount[index].nameDiscount);
        let startDate = new Date(listDiscount[index].startDate);
        let endDate = new Date(listDiscount[index].endDate);
        // Check ngày bắt đầu để bắt đầu giảm giá các sản phẩm
        if(startDate.getDate()===now.getDate()&&startDate.getMonth()===now.getMonth()&&startDate.getFullYear()===now.getFullYear()){
            console.log(listDiscount[index]._id);
            
            const products = await Product.aggregate([{$match:{discount: new ObjectId(`${listDiscount[index]._id.toString()}`)}}])
            for (let i = 0; i < products.length; i++) {
                let productDetails = await ProductDetail.aggregate([{$match:{product:new ObjectId(`${products[i]._id}`)}},{$match:{status:"ACTIVE"}},{$project:{_id:1}}])
                let productDetailsConvert = productDetails.map(function(id) {
                    return id;
                });
                console.log(productDetailsConvert);
                
                await Product.updateOne({'_id': products[i]._id},{$set:{'priceDiscount':products[i].price*(1-listDiscount[index].percentDiscount)}});
                await CartDetail.updateMany({productDetail:{$in:productDetailsConvert}},{$set:{priceDiscount:products[i].price*(1-listDiscount[index].percentDiscount)}});
            }
        }
        if(endDate.getDate()===now.getDate()&&endDate.getMonth()===now.getMonth()&&endDate.getFullYear()===now.getFullYear()){
            const products = await Product.aggregate([{$match:{discount: new ObjectId(`${listDiscount[index]._id.toString()}`)}}])
            for (let i = 0; i < products.length; i++) {
                let productDetails = await ProductDetail.aggregate([{$match:{product:new ObjectId(`${products[i]._id}`)}},{$match:{status:"ACTIVE"}},{$project:{_id:1}}])
                let productDetailsConvert = productDetails.map(function(id) {
                    return id;
                });
                console.log(productDetailsConvert);
                
                await CartDetail.updateMany({productDetail:{$in:productDetailsConvert}},{$set:{priceDiscount:products[i].price}});
                await Product.updateOne({'_id': products[i]._id},{$set:{'priceDiscount':products[i].price}});
            }
        }
        
    }
  }, { scheduled: false });
  
export default discountSchedule;