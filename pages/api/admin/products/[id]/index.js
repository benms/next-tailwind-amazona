import { getSession } from "next-auth/react";
import Product from "../../../../../models/Product";
import db from "../../../../../utils/db";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || !session.user.isAdmin) {
    return res.status(401).send('admin sign in required');
  }

  if (req.method === 'GET') {
    return await getHandler(req, res);
  } else if (req.method === 'PUT') {
    return await putHandler(req, res);
  } else {
    return res.status(405).send('method is not allowed');
  }
};

async function getHandler(req, res) {
  const productId = req.query.id;
  await db.connect();
  const product = await Product.findById(productId).populate('user', 'name');
  await db.disconnect();

  return res.send(product);
}

async function putHandler(req, res) {
  const productId = req.query.id;
  await db.connect();
  const product = await Product.findById(productId).populate('user', 'name');
  const {
    name,
    slug,
    price,
    category,
    image,
    brand,
    countInStock,
    description
  } = req.body;

  if (!product) {
    await db.disconnect();
    return res.status(404).send({ message: 'Product not found' });
  }

  product.name = name;
  product.slug = slug;
  product.price = price;
  product.category = category;
  product.image = image;
  product.brand = brand;
  product.countInStock = countInStock;
  product.description = description;
  await product.save();
  await db.disconnect();
  return res.send({ message: 'Product updated successfully' });
}

export default handler;
