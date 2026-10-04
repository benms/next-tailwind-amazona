import { getSession } from "next-auth/react";
import User from "../../../../models/User";
import db from "../../../../utils/db";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || !session.user.isAdmin) {
    return res.status(401).send({ message: 'Admin sign in required' });
  }
  if (req.method !== 'GET') {
    return res.status(405).send({ message: 'Method is not allowed' });
  }

  await db.connect();
  const users = await User.find({}).select('-password');
  await db.disconnect();

  return res.send(users);
};

export default handler;
