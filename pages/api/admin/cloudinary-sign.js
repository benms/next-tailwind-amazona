import { getSession } from "next-auth/react";
const cloudinary = require('cloudinary').v2;

async function signature(req, res) {
  const session = await getSession({ req });
  if (!session || !session.user.isAdmin) {
    return res.status(401).send({ message: 'Admin sign in required' });
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request({ timestamp }, process.env.CLOUDINARY_SECRET);

  res.statusCode = 200;
  res.json({ signature, timestamp });
}

export default signature;
