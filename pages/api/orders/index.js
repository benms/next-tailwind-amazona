import { getSession } from "next-auth/react";
import Order from "../../../models/Order";
import db from "../../../utils/db";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send('sign in is required');
  }

  const { user } = session;
  await db.connect();
  const newOrder = await Order({
    ...req.body,
    user: user._id
  });
  const order = await newOrder.save();
  await db.disconnect();

  res.status(201).send(order);
}

export default handler;
