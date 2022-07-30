import { getSession } from "next-auth/react";
import Product from "../../../../models/Product";
import db from "../../../../utils/db";

const handler = async (req, res) => {
  const session = await getSession({ req });

  if (!session || !session.user.isAdmin) {
    return res.status(401).send({ message: 'admin sign in required' });
  }

  switch (req.method) {
    case 'GET':
      return getHandler(req, res);
    case 'POST':
      return postHandler(req, res);
    default:
      return res.status(405).send('method not allowed');
  }
};

async function getHandler(req, res) {
  await db.connect();
  const products = await Product.find({});
  await db.disconnect();

  res.send(products);
}

async function postHandler(req, res) {
  await db.connect();
  const newProduct = new Product({
    name: 'Sample name',
    slug: 'sample-name' + Math.random(),
    image: '/images/shirt1.jpg',
    price: 0,
    category: 'sample category',
    brand: 'sample brand',
    countInStock: 0,
    description: 'sample description',
    rating: 0,
    numReviews: 0,
  });
  const product = await newProduct.save();
  await db.disconnect();

  res.send({product, message: 'Product created successfully'});
}


export default handler;
