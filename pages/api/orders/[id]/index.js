import mongoose from 'mongoose';
import { getSession } from 'next-auth/react';
import Order from '../../../../models/Order';
import db from '../../../../utils/db';

const handler = async (req, res) => {
  const session = await getSession({req});
  if (!session) {
    return res.status(401).send({ message: 'Sign in required' });
  }
  if (!mongoose.isValidObjectId(req.query.id)) {
    return res.status(404).send({ message: 'Order not found' });
  }

  await db.connect();
  const order = await Order.findById(req.query.id);
  await db.disconnect();

  if (!order ||
      (order.user.toString() !== session.user._id && !session.user.isAdmin)) {
    return res.status(404).send({ message: 'Order not found' });
  }

  res.send(order);
}

export default handler;
