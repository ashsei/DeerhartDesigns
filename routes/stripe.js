const express = require("express");
const router = express.Router();
require("dotenv").config();


const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const calculateOrderAmount = items => {
    return items.reduce((currentValue, nextValue) => {
        return currentValue + nextValue.count * nextValue.price
    }, 0)
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
