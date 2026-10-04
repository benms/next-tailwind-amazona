import mongoose from "mongoose";
import { getSession } from "next-auth/react";
import Order from "../../../models/Order";
import Product from "../../../models/Product";
import db from "../../../utils/db";
import { calcPrices } from "../../../utils/pricing";

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: `Method ${req.method} not allowed` });
  }
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: 'Sign in required' });
  }

  const { orderItems, shippingAddress, paymentMethod } = req.body;
  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    return res.status(422).send({ message: 'Order has no items' });
  }
  const invalidItem = orderItems.find((item) =>
    !mongoose.isValidObjectId(item?._id) ||
    !Number.isInteger(Number(item.quantity)) ||
    Number(item.quantity) < 1
  );
  if (invalidItem) {
    return res.status(422).send({ message: 'Invalid order item' });
  }

  await db.connect();
  try {
    const products = await Product.find({
      _id: { $in: orderItems.map((item) => item._id) }
    });

    const items = [];
    for (const item of orderItems) {
      const product = products.find((p) => p._id.toString() === item._id);
      if (!product) {
        return res.status(422).send({ message: `Product ${item.name || item._id} not found` });
      }
      const quantity = Number(item.quantity);
      if (product.countInStock < quantity) {
        return res.status(422).send({ message: `Not enough ${product.name} in stock` });
      }
      // Name, image and price always come from the database, never from the client
      items.push({
        product: product._id,
        name: product.name,
        slug: product.slug,
        image: product.image,
        price: product.price,
        quantity,
      });
    }

    const order = await new Order({
      user: session.user._id,
      orderItems: items,
      shippingAddress,
      paymentMethod,
      ...calcPrices(items),
    }).save();

    return res.status(201).send(order);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(422).send({ message: err.message });
    }
    throw err;
  } finally {
    await db.disconnect();
  }
};

export default handler;
