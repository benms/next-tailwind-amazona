import { getSession } from "next-auth/react";
import Product from "../../../../../models/Product";
import db from "../../../../../utils/db";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || !session.user.isAdmin) {
    return res.status(401).send('admin sign in required');
  }

  switch (req.method) {
    case 'GET':
      return await getHandler(req, res);
    case 'PUT':
      return await putHandler(req, res);
    case 'DELETE':
        return await deleteHandler(req, res);
    default:
      return res.status(405).send('method is not allowed');
  }
};

async function getHandler(req, res) {
  const productId = req.query.id;
  await db.connect();
  const product = await Product.findById(productId);
  await db.disconnect();

  return res.send(product);
}

async function deleteHandler(req, res) {
  const productId = req.query.id;
  await db.connect();
  const product = await Product.findById(productId);
  if (!product) {
    await db.disconnect();
    return res.status(404).send({ message: 'Product not found' });
  }
  await product.remove();
  await db.disconnect();

  return res.status(204).send({ message: 'Product deleted successfully' });
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
