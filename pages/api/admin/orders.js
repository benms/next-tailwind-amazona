import { getSession } from "next-auth/react"
import Order from "../../../models/Order";
import db from "../../../utils/db";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || !session.user.isAdmin) {
    return res.status(401).send('admin sign in required');
  }
  if (req.method !== 'GET') {
    return res.status(405).send('Method not allowed');
  }

  await db.connect();
  const orders = await Order.find({}).populate('user', 'name');
  await db.disconnect();

  res.send(orders);
}

export default handler;
