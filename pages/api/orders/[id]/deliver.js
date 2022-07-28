import Order from "../../../../models/Order";
import db from "../../../../utils/db";

const handler = async (req, res) => {
  const { id } = req.query;

  await db.connect();
  const order = await Order.findById(id);
  if (!order) {
    await db.disconnect();
    return res.status(404).send({ message: 'Order not found' });
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();
  const deliveredOrder = await order.save();
  await db.disconnect();

  res.send({
    message: 'Order delivered successfully',
    order: deliveredOrder
  });
};

export default handler;
