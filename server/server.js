require('dotenv').config();
const express = require("express");

const cors = require("cors");

const app = express();
const Razorpay = require("razorpay");
const crypto = require("crypto");

app.use(cors());
app.use(express.json());

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
key_secret: process.env.RAZORPAY_KEY_SECRET
});


app.get("/test", (req, res) => {
    res.send("Backend received the request!");
});

app.get("/razorpay-test", async (req, res) => {

    try {
        const payments = await razorpay.payments.all({
            count: 1
        });

        res.json(payments);

    } catch (error) {
        console.log(error);
        res.status(500).send("Razorpay API connection failed");
    }

});

app.post("/create-order", async (req, res) => {

    try {

        const amount = req.body.amount;

        const options = {
            amount: amount*100,
            currency: "INR",
            receipt: "receipt_001"
        };

        const order = await razorpay.orders.create(options);

        res.json(order);

    } catch (error) {

        console.log(error);
        res.status(500).send("Order creation failed");

    }

});

app.post("/verify-payment", (req, res) => {

    const paymentId = req.body.razorpay_payment_id;
    const orderId = req.body.razorpay_order_id;
    const signature = req.body.razorpay_signature;

    const body = orderId + "|" + paymentId;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

    if (expectedSignature === signature) {

        console.log("Payment verified");

        res.json({
            success: true,
            message: "Payment verified"
        });

    } else {

        console.log("Payment verification failed");

        res.json({
            success: false,
            message: "Payment verification failed"
        });

    }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
