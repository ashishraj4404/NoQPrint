require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { ClerkExpressWithAuth } = require("@clerk/clerk-sdk-node");
const Stripe = require("stripe");

const userRoutes = require("./router/userRoute.js");
const revenueRoutes = require("./router/revenueRoute.js");
const pricingRoutes = require("./router/pricingRoute.js");
const orderRoutes = require("./router/orderRoute.js");
const uploadRoutes = require("./router/uploadRoute.js");
const stripeRoutes = require("./router/stripeRoute.js");
const { handleStripeWebhook } = require("./controllers/stripeController.js");

const app = express();
app.use(cors());
app.use(ClerkExpressWithAuth({ secretKey: process.env.CLERK_SECRET_KEY }));

const port=process.env.PORT;
const mongo_url = process.env.MONGO_URL;
mongoose.connect(mongo_url)
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
})
.catch((err) => console.log(err));

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.post(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/create-checkout-session", stripeRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes); 
app.use("/api/user", userRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/revenue", revenueRoutes);



