import cron from "node-cron";
import { Discount } from "../models/discount";
// Từ thứ 2 đến chủ nhật, vào lúc 0 giờ 0 phút 0 giây
var discountSchedule = cron.schedule('5 0 0 * * 1-7',async () =>  {
    console.log("cronjob is running !");
    const listDiscount = await Discount.find();
    let now = new Date();
    now.setHours(now.getHours()+7);
    for (let index = 0; index < listDiscount.length; index++) {
        // Check ngày bắt đầu để bắt đầu giảm giá các sản phẩm
        if(listDiscount[index].startDate.getDay()===now.getDay()&&listDiscount[index].startDate.getMonth()===now.getMonth()&&listDiscount[index].startDate.getFullYear()===now.getFullYear()){
            
        }
        
    }
  }, { scheduled: false });
  
export default discountSchedule;