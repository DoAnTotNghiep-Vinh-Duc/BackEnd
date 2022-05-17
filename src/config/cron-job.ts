import cron from "node-cron";
// Từ thứ 2 đến chủ nhật, vào lúc 0 giờ 0 phút 0 giây
var discountSchedule = cron.schedule('0 0 0 * * 1-7', () =>  {
    console.log("cronjob is running !");
    
  }, { scheduled: false });
  
export default discountSchedule;