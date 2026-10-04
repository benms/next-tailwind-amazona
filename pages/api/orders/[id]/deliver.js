import mongoose from "mongoose";
import { getSession } from "next-auth/react";
import Order from "../../../../models/Order";
import db from "../../../../utils/db";

const handler = async (req, res) => {
  if (req.method !== 'PUT') {
    return res.status(405).send({ message: `Method ${req.method} not allowed` });
  }
  const session = await getSession({ req });
  if (!session || !session.user.isAdmin) {
    return res.status(401).send({ message: 'Admin sign in required' });
  }

  const { id } = req.query;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).send({ message: 'Order not found' });
  }

  await db.connect();
  const order = await Order.findById(id);
  if (!order) {
    await db.disconnect();
    return res.status(404).send({ message: 'Order not found' });
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();
  const deliveredOrder = await order.save();
  await db.disconnect();

  res.send({
    message: 'Order delivered successfully',
    order: deliveredOrder
  });
};

export default handler;
