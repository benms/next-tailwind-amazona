import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useReducer } from 'react'
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import { getError } from '../../utils/error';

const PRODUCTS_FETCH_REQUEST = 'PRODUCTS_FETCH_REQUEST';
const PRODUCTS_FETCH_FAIL = 'PRODUCTS_FETCH_FAIL';
const PRODUCTS_FETCH_SUCCESS = 'PRODUCTS_FETCH_SUCCESS';
const PRODUCT_CREATE_REQUEST = 'PRODUCT_CREATE_REQUEST';
const PRODUCT_CREATE_SUCCESS = 'PRODUCT_CREATE_SUCCESS';
const PRODUCT_CREATE_FAIL = 'PRODUCT_CREATE_FAIL';
const PRODUCT_DELETE_REQUEST = 'PRODUCT_DELETE_REQUEST';
const PRODUCT_DELETE_SUCCESS = 'PRODUCT_DELETE_SUCCESS';
const PRODUCT_DELETE_FAIL = 'PRODUCT_DELETE_FAIL';
const PRODUCT_DELETE_RESET = 'PRODUCT_DELETE_RESET';

function reducer(state, action) {
  switch (action.type) {
    case PRODUCTS_FETCH_REQUEST:
      return { ...state, loading: true, error: '' };
    case PRODUCTS_FETCH_SUCCESS:
      return { ...state, loading: false, products: action.payload, error: '' };
    case PRODUCTS_FETCH_FAIL:
      return { ...state, loading: false, error: action.payload };
    case PRODUCT_CREATE_REQUEST:
      return { ...state, loadingCreate: true, errorCreate: '' };
    case PRODUCT_CREATE_SUCCESS:
      return { ...state, loadingCreate: false, errorCreate: '' };
    case PRODUCT_CREATE_FAIL:
      return { ...state, loadingCreate: false, errorCreate: action.payload };
    case PRODUCT_DELETE_REQUEST:
      return { ...state, loadingDelete: true };
    case PRODUCT_DELETE_SUCCESS:
      return { ...state, loadingDelete: false, successDelete: true };
    case PRODUCT_DELETE_FAIL:
      return { ...state, loadingDelete: false, successDelete: false };
    case PRODUCT_DELETE_RESET:
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
}

export default function AdminProductsScreen() {
  const [{
    loading,
    error,
    products,
    loadingCreate,
    successDelete,
    loadingDelete
  }, dispatch] = useReducer(reducer, {
    loading: true,
    products: [],
    error: ''
  });

  const router = useRouter();

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

    if (successDelete) {
      dispatch({ type: PRODUCT_DELETE_RESET });
    } else {
      fetchData();
    }
  }, [successDelete]);

  const deleteHandler = async (productId) => {
    if (!window.confirm('Are you sure?')) {
      return;
    }
    try {
      dispatch({ type: PRODUCT_DELETE_REQUEST });
      await axios.delete(`/api/admin/products/${productId}`);
      dispatch({ type: PRODUCT_DELETE_SUCCESS });
      toast.success('Product deleted successfully');
    } catch (error) {
      dispatch({ type: PRODUCT_DELETE_FAIL });
      toast.error(getError(error));
    }
  };

  const createHandler = async () => {
    if (!window.confirm('Are you sure?')) {
      return;
    }
    try {
      dispatch({ type: PRODUCT_CREATE_REQUEST });
      const { data } = await axios.post('/api/admin/products');
      dispatch({ type: PRODUCT_CREATE_SUCCESS });
      toast.success('Product created successfully');
      router.push(`/admin/product/${data.product._id}`);
    } catch (error) {
      dispatch({ type: PRODUCT_CREATE_FAIL, payload: getError(error) });
      toast.error(getError(error));
    }
  };

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
          <div className="flex justify-between">
            <h1 className="mb-4 text-xl">Products</h1>
            { loadingDelete && (<div>Delete item...</div>) }
            <button
              disabled={loadingCreate}
              onClick={createHandler}
              className="primary-button"
          >{ loadingCreate ? 'Loading' : 'Create' }</button>
          </div>
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
                        <Link href={`/admin/product/${product._id}`} passHref>
                          <a className='default-button'>Edit</a>
                        </Link>
                        &nbsp;
                        <button
                          onClick={() => deleteHandler(product._id)}
                          className='default-button'
                          type='button'
                          >
                          Delete
                        </button>
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
