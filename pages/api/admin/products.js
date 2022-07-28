import { getSession } from "next-auth/react";
import Product from "../../../models/Product";
import db from "../../../utils/db";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (req.method !== 'GET') {
    return res.status(405).send('method not allowed');
  }

  console.log({ session });
  if (!session || !session.user.isAdmin) {
    return res.status(401).send({ message: 'admin sign in required' });
  }

  await db.connect();
  const products = await Product.find({});
  await db.disconnect();

  res.send(products);
};

export default handler;
