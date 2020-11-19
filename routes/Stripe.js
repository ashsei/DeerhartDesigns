const express = require("express");
const router = express.Router();
require("dotenv").config();


const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const calculateOrderAmount = items => {
    let itemTotal = 0;
    let total = 0;
    for (let i = 0; i < items.length; i++) {
        itemTotal = items[i].price * items[i].count;

        total += itemTotal;
        return total;
    }
    return total;
}

router.post("/create-payment-intent", async (req, res) => {
    const items = req.body[0].items.products;
    const total = calculateOrderAmount(items) * 100;
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "usd"
    });
    res.send({
        clientSecret: paymentIntent.client_secret,
        amount: total/100
    });
})

module.exports = router;