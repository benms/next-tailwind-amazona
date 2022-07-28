import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useReducer } from 'react'
import Layout from '../../components/Layout';
import { getError } from '../../utils/error';

const PRODUCTS_FETCH_REQUEST = 'PRODUCTS_FETCH_REQUEST';
const PRODUCTS_FETCH_FAIL = 'PRODUCTS_FETCH_FAIL';
const PRODUCTS_FETCH_SUCCESS = 'PRODUCTS_FETCH_SUCCESS';

function reducer(state, action) {
  switch (action.type) {
    case PRODUCTS_FETCH_REQUEST:
      return { ...state, loading: true, error: '' };
    case PRODUCTS_FETCH_SUCCESS:
      return { ...state, loading: false, products: action.payload, error: '' };
    case PRODUCTS_FETCH_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export default function AdminProductsScreen() {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    loading: true,
    products: [],
    error: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: PRODUCTS_FETCH_REQUEST });
        const { data } = await axios.get('/api/admin/products');
        dispatch({ type: PRODUCTS_FETCH_SUCCESS, payload: data });
      } catch (error) {
        dispatch({ type: PRODUCTS_FETCH_FAIL, payload: getError(error) });
      }
    };
    fetchData();
  }, []);

  return (
    <Layout title="Admin Products">
       <div className="grid md:grid-cols-4 md:gap-5">
        <div>
          <ul>
            <li>
              <Link href="/admin/dashboard">
                <a>Dashboard</a>
              </Link>
            </li>
            <li>
              <Link href="/admin/orders">
                <a>Orders</a>
              </Link>
            </li>
            <li>
              <Link href="/admin/products">
                <a className="font-bold">Products</a>
              </Link>
            </li>
            <li>
              <Link href="/admin/users">
                <a>Users</a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="md:col-span-3">
          <h1 className="mb-4 text-xl">Admin Dashboard</h1>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className='alert-error'>{error}</div>
          ) : (
            <div className='overflow-x-auto'>
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">Id</th>
                    <th className="p-5 text-left">Name</th>
                    <th className="p-5 text-left">Price</th>
                    <th className="p-5 text-left">Category</th>
                    <th className="p-5 text-left">Count</th>
                    <th className="p-5 text-left">Rating</th>
                    <th className="p-5 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  { products.map((product) => (
                    <tr key={product._id} className='border-b'>
                      <td className="p-5">{product._id.substring(20, 24)}</td>
                      <td className="p-5">{product.name}</td>
                      <td className="p-5">${product.price}</td>
                      <td className="p-5">{product.category}</td>
                      <td className="p-5">{product.countInStock}</td>
                      <td className="p-5">{product.rating}</td>
                      <td className="p-5">
                        <Link href={`/admin/product/${product._id}`} passHref>Edit</Link>
                        &nbsp;
                        <button>Delete</button>
                      </td>
                    </tr>
                  )) }
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

AdminProductsScreen.auth = { adminOnly: true };
