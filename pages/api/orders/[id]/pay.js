import { getSession } from "next-auth/react";
import Order from "../../../../models/Order";
import db from "../../../../utils/db";

const handler = async (req, res) => {
  const session = getSession({ req });
  if (!session) {
    return res.status(401).send('Error: sign in required');
  }

  await db.connect();
  const order = await Order.findById(req.query.id);
  if (!order) {
    await db.disconnect();
    return res.status(404).send({ message: 'Error: Order not found' });
  }
  if (order.isPaid) {
    return res.status(400).send({ message: 'Error: Order is already paid' });
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    email_address: req.body.email_address
  };
  const paidOrder = await order.save();
  await db.disconnect();
  res.send({ message: 'Order paid successfully', order: paidOrder });
}

export default handler;