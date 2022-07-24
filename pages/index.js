import axios from 'axios';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import ProductItem from '../components/ProductItem';
import Product from '../models/Product';
import db from '../utils/db';
import { CART_ADD_ITEM, useStore } from '../utils/Store';

export default function Home({products}) {
  const { state, dispatch } = useStore();
  const { cart } = state;

  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((c) => c.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data: product_data } = await axios.get(`/api/products/${product._id}`);
    if (product_data.countInStock < quantity) {
      toast.error('Sorry. Product is out of stock');
      return;
    }
    dispatch({
      type: CART_ADD_ITEM,
      payload: {...product, quantity}
    });

    toast.success("Product added to the cart");
  };

  return (
    <Layout title="Home page">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductItem
            product={product}
            key={product.slug}
            addToCartHandler={addToCartHandler} />
        ))}
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();
  await db.disconnect();

  return {
    props: {
      products: products.map(db.convertDocsToObj)
    }
  };
}
