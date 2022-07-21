import bcryptjs from "bcryptjs";
import { getSession } from "next-auth/react";
import User from "../../../models/User";
import db from "../../../utils/db";

const handler = async (req, res) => {
  if (req.method !== 'PUT') {
    return res.status(405).send({ message: `Method ${req.method} not allowed` });
  }
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: 'Sign in required' });
  }

  const { user } = session;
  const { name, email, password } = req.body;

  if (!name ||
      !email ||
      (password && password.trim().length < 5)
     ) {
      return res.status(422).json({
        message: 'Validation error'
      });
    }

  await db.connect();
  const updateUser = await User.findById(user._id);
  if (!updateUser) {
    await db.disconnect();
    return res.status(404).send({ message: 'User not found' });
  }

  updateUser.name = name;
  updateUser.email = email;
  if (password) {
    updateUser.password = bcryptjs.hashSync(password);
  }
  await updateUser.save();
  await db.disconnect();

  return res.send({ message: 'User updated' });
}

export default handler;