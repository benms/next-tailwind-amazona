import bcryptjs from "bcryptjs";
import User from "../../../models/User";
import db from "../../../utils/db";

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: `Method ${req.method} not allowed` });
  }

  const { name, email, password } = req.body;
  if (
    !name ||
    !email ||
    !email.includes('@') ||
    !password ||
    password.trim().length < 6
  ) {
    res.status(422).json({
      message: 'Validation error'
    });
    return;
  }

  await db.connect();
  const existUser = await User.findOne({ email });
  if (existUser) {
    res.status(422).json({
      message: 'User exists already'
    });
    await db.disconnect();
    return;
  }

  const newUser = new User({
    name,
    email,
    password: bcryptjs.hashSync(password),
    isAdmin: false
  });
  const user = await newUser.save();
  await db.disconnect();
  res.status(201).send({
    message: 'Created user',
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin
  });
}

export default handler;
