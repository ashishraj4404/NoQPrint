const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const {confirmOrder} = require("../utils/confirmOrder.js");
const {addCoins} = require("../utils/addCoins.js");

exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const paymentIntentId = session.payment_intent;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    const userId = paymentIntent.metadata.userId;
    const orderId = paymentIntent.metadata.orderId;
    const amount = parseInt(paymentIntent.metadata.amount);

    if (orderId) {
      await confirmOrder(orderId);
    } else if (userId) {
      await addCoins(userId, amount);
    }

    return res.status(200).send("Received");
  }

  res.status(200).send("Unhandled event type");
};

exports.createOrderCheckoutSession = async (req, res) => {
  const { orderId, amount } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "inr",
          product_data: {
            name: "NoQPrint Order Purchase",
            description: "*Use 4242 4242 4242 4242 for paying",
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: `http://localhost:5173/orderconfirm?orderId=${orderId}`,
      cancel_url: "http://localhost:5173/cancel",
      payment_intent_data: {
        metadata: { orderId, amount: amount.toString() },
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createCoinsCheckoutSession = async (req, res) => {
  const { userId, amount } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "inr",
          product_data: {
            name: "NoQPrint Coins Purchase",
            description: "*Use 4242 4242 4242 4242 for paying",
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: `http://localhost:5173/my-coins?success=${amount}`,
      cancel_url: "http://localhost:5173/cancel",
      payment_intent_data: {
        metadata: { userId, amount: amount.toString() },
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
