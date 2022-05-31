import express from 'express';
import { OrderController } from '../controllers/order-controller';
import { CheckPhoneMiddleware } from '../middleware/check-phone-middleware';
import { AuthMiddleware } from '../middleware/auth-middleware';
import paypal from "paypal-rest-sdk"
export const orderRoutes = express.Router();
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': `${process.env.PAYPAL_CLIENTID}`,
    'client_secret': `${process.env.PAYPAL_CLIENTSECRET}`
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
orderRoutes.get("/payment-paypal",(req, res)=>{
    try {
        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": `http://localhost:${process.env.PORT}/order/success`,
                "cancel_url": `http://localhost:${process.env.PORT}/order/cancel`
            },
            "transactions": [{
                "item_list": {
                    "items": items
                },
                "amount": {
                    "currency": "USD",
                    "total": total.toString()
                },
                "description": "Hat for the best team ever"
            }]
        }
        paypal.payment.create(create_payment_json, function (error: any, payment: any) {
            if (error) {
                return { status: 400, message: "cancel" };
            } else {
                for (let i = 0; i < payment.links.length; i++) {
                    console.log(payment.links);

                    if (payment.links[i].rel === 'approval_url') {
                        console.log("return here");

                        res.redirect(payment.links[i].href);
                    }
                }
            }
        });
        return {status:400, message:"Something went wrong !"};
    } catch (error) {
        console.log(error);
        return {status:500, message:"something went wrong !"};
        
    }
})

orderRoutes.get("/cancel",(req, res)=>{
    console.log("Cancel");
    res.status(200).send("Cancel success")
})

orderRoutes.get("/success",(req, res)=>{
    const payerId = req.query.PayerID;
    const paymentId: any = req.query.paymentId;

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
        return res.send('error');
        } else {
            console.log(JSON.stringify(payment));
            return res.redirect("http://localhost:3000");
        }
    });
})
orderRoutes.post("/",AuthMiddleware.verifyAccessToken,AuthMiddleware.checkAccountIsActive,CheckPhoneMiddleware.checkVerifyPhone, OrderController.createOrder);
orderRoutes.get("/get-order-by-account", AuthMiddleware.verifyAccessToken,AuthMiddleware.checkAccountIsActive, OrderController.getOrderByAccountId)
orderRoutes.get("/get-order-by-orderId/:orderId", AuthMiddleware.verifyAccessToken,AuthMiddleware.checkAccountIsActive, OrderController.getOrderByOrderId)
orderRoutes.post("/cancel-order",AuthMiddleware.verifyAccessToken,AuthMiddleware.checkAccountIsActive,CheckPhoneMiddleware.checkVerifyPhone, OrderController.cancelOrder)