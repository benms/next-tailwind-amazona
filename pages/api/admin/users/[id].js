import { getSession } from "next-auth/react";
import User from "../../../../models/User";
import db from "../../../../utils/db";

const handler = async (req, res) => {
  const session = await getSession({ req });

  if (!session || !session.user.isAdmin) {
    return res.status(401).send({ message: 'Admin sign in required' });
  }

  switch (req.method) {
    case 'GET':
      return await getHandler(req, res);
    case 'DELETE':
      return await deleteHandler(req, res);
    case 'PUT':
      return await putHandler(req, res);
    default:
      return res.status(405).send({message: 'Method is not allowed'});
  }
};

async function putHandler(req, res) {
  await db.connect();
  const updateUser = await User.findById(req.query.id);
  if (!updateUser) {
    await db.disconnect();
    return res.status(404).send({ message: 'User not found'});
  }
  const { name, email, isAdmin } = req.body;
  if (!name ||
      !email
     ) {
      return res.status(422).json({
        message: 'Validation error'
      });
  }

  updateUser.name = name;
  updateUser.email = email;
  updateUser.isAdmin = Boolean(isAdmin);
  await updateUser.save();
  await db.disconnect();

  return res.send({ message: 'User updated' });
}

async function deleteHandler(req, res) {
  await db.connect();
  const user = await User.findById(req.query.id);
  if (!user) {
    await db.disconnect();
    return res.status(404).send({ message: 'User not found'});
  }
  if (user.isAdmin || user.email === 'john.doe@example.com') {
    return res.status(400).send({ message: 'Can not delete admin or super admin' })
  }
  await user.remove();
  await db.disconnect();
  res.status(204).send({ message: 'User deleted' });
}

async function getHandler(req, res) {
  await db.connect();
  const user = await User.findById(req.query.id);
  if (!user) {
    await db.disconnect();
    return res.status(404).send({ message: 'User not found'});
  }
  await db.disconnect();
  res.send(user);
}

export default handler;
