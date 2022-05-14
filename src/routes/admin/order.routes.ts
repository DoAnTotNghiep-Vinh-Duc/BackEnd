import express from 'express';
import { OrderController } from '../../controllers/admin/order.controller';
import { AuthMiddleware } from '../../middleware/auth-middleware';
import { CheckAdminMiddleware } from '../../middleware/check-admin-middleware';
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
orderRoutes.get("/payment-paypal",(req, res)=>{
    try {
        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://localhost:5000/order/success",
                "cancel_url": "http://localhost:5000/order/cancel"
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
                    if (payment.links[i].rel === 'approval_url') {
                        return { status: 200, message: "payment", link: payment.links[i].href };
                    }
                }
            }
        });
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
orderRoutes.get("/sortOrder",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin, OrderController.sortOrder); 
orderRoutes.get("/all-order-with-user",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin, OrderController.getAllOrderWithUser);
orderRoutes.post("/by-date",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin,  OrderController.getOrdersByDate);
orderRoutes.get("/all-top-customer",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin, OrderController.getTopCustomer);
orderRoutes.get("/all-top-sell-product",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin, OrderController.getTopSellProduct);
orderRoutes.get("/top-customer/:page/:limit",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin, OrderController.getTopCustomerLimitPage);
orderRoutes.get("/top-sell-product/:page/:limit",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin, OrderController.getTopSellProductLimitPage);
orderRoutes.get("/get-order-by-id/:orderId",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin, OrderController.getOrderByOrderIdAdmin);
orderRoutes.put("/next-status-order/:orderId",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin, OrderController.nextStatusOrder);
orderRoutes.put("/cancel-order/:orderId",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin, OrderController.cancelOrder);