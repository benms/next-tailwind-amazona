import mongoose from "mongoose";
import { getSession } from "next-auth/react";
import Order from "../../../../models/Order";
import db from "../../../../utils/db";
import { getPaypalOrder, isPaypalConfigured } from "../../../../utils/paypal";

const handler = async (req, res) => {
  if (req.method !== 'PUT') {
    return res.status(405).send({ message: `Method ${req.method} not allowed` });
  }
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: 'Error: sign in required' });
  }
  if (!mongoose.isValidObjectId(req.query.id)) {
    return res.status(404).send({ message: 'Error: Order not found' });
  }
  const paypalOrderId = req.body?.id;
  if (!paypalOrderId || typeof paypalOrderId !== 'string') {
    return res.status(422).send({ message: 'Error: PayPal order id is required' });
  }
  if (!isPaypalConfigured()) {
    return res.status(500).send({ message: 'Error: PayPal is not configured on the server' });
  }

  await db.connect();
  try {
    const order = await Order.findById(req.query.id);
    if (!order || order.user.toString() !== session.user._id) {
      return res.status(404).send({ message: 'Error: Order not found' });
    }
    if (order.isPaid) {
      return res.status(400).send({ message: 'Error: Order is already paid' });
    }

    let paypalOrder;
    try {
      paypalOrder = await getPaypalOrder(paypalOrderId);
    } catch (err) {
      return res.status(402).send({ message: 'Error: Unable to verify PayPal payment' });
    }
    const amount = paypalOrder.purchase_units?.[0]?.amount;
    if (paypalOrder.status !== 'COMPLETED') {
      return res.status(402).send({ message: 'Error: PayPal payment is not completed' });
    }
    if (amount?.currency_code !== 'USD' ||
        Math.round(Number(amount.value) * 100) !== Math.round(order.totalPrice * 100)) {
      return res.status(402).send({ message: 'Error: PayPal amount does not match order total' });
    }
    const alreadyUsed = await Order.exists({ 'paymentResult.id': paypalOrder.id });
    if (alreadyUsed) {
      return res.status(400).send({ message: 'Error: PayPal payment was already used' });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: paypalOrder.id,
      status: paypalOrder.status,
      email_address: paypalOrder.payer?.email_address,
    };
    const paidOrder = await order.save();
    res.send({ message: 'Order paid successfully', order: paidOrder });
  } finally {
    await db.disconnect();
  }
}

export default handler;
