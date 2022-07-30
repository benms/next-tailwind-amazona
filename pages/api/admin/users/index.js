import User from "../../../../models/User";
import db from "../../../../utils/db";

const handler = async (req, res) => {
  await db.connect();
  const users = await User.find({});
  await db.disconnect();

  return res.send(users);
};

export default handler;
