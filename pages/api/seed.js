import { getSession } from "next-auth/react";
import Product from "../../models/Product";
import User from "../../models/User";
import data from "../../utils/data";
import db from "../../utils/db";

const handler = async (req, res) => {
  // Seeding wipes all users and products, so in production only an admin may run it
  if (process.env.NODE_ENV === 'production') {
    const session = await getSession({ req });
    if (!session || !session.user.isAdmin) {
      return res.status(401).send({ message: 'Admin sign in required' });
    }
  }

  await db.connect();
  await User.deleteMany();
  await User.insertMany(data.users);
  await Product.deleteMany();
  await Product.insertMany(data.products);
  await db.disconnect();
  res.send({message: 'Seeded Mongodb successfully'});
}

export default handler;
