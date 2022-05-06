import express from 'express';
import { OrderController } from '../controllers/order-controller';
import { CheckPhoneMiddleware } from '../middleware/check-phone-middleware';
import { AuthMiddleware } from '../middleware/auth-middleware';
import paypal from "paypal-rest-sdk"
export const orderRoutes = express.Router();
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'ATStXMWKaLIbz91tuL_W6Zt4Mor9WbYytaisCdVdse-62sP3YYbzELeoGvlgO6Mrfx6gUF-Kkg5m5bwm',
    'client_secret': 'ENeq_uLxVXKoLb37jwFQkUQdRzIsi7jNoQh--DtN-30F26iChl4OV7qRysYF8KLY8l9CgAl8-gvDiDnz'
});
const items=   [{
    "name": "Red Sox Hat",
    "sku": "001",
    "price": "1.0",
    "currency": "USD",
    "quantity": 15
},
{
  "name": "Blue Sox Hat",
  "sku": "002",
  "price": "1.5",
  "currency": "USD",
  "quantity": 1
},
{
    "name": "Blue Sox Hat",
    "sku": "003",
    "price": "1.5",
    "currency": "USD",
    "quantity": 1
  },
  {
    "name": "Blue Sox Hat",
    "sku": "004",
    "price": "1.5",
    "currency": "USD",
    "quantity": 1
  }];
var total =0;
for(let i = 0;i<items.length;i++)
{
    total+=parseFloat(items[i].price)*items[i].quantity;
}
orderRoutes.get("/payment-paypal",OrderController.paymentWithPayPal)

orderRoutes.get("/cancel",(req, res)=>{
    console.log("Cancel");
    res.status(200).send("Cancel success")
})

orderRoutes.get("/success",(req, res)=>{
    const payerId = req.query.PayerID;
    const paymentId: any = req.query.paymentId;
    console.log("payerId",payerId);
    console.log("paymentId",paymentId);
    
    const execute_payment_json: any = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": total.toString()
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
        res.render('cancle');
        } else {
            console.log(JSON.stringify(payment));
            res.render('success');
        }
    });
})
orderRoutes.post("/",AuthMiddleware.verifyAccessToken,CheckPhoneMiddleware.checkVerifyPhone, OrderController.createOrder);
orderRoutes.post("/by-date", OrderController.getOrdersByDate);
orderRoutes.get("/all-top-customer", OrderController.getTopCustomer);
orderRoutes.get("/all-top-sell-product", OrderController.getTopSellProduct);
orderRoutes.get("/top-customer/:page/:limit", OrderController.getTopCustomerLimitPage);
orderRoutes.get("/top-sell-product/:page/:limit", OrderController.getTopSellProductLimitPage);