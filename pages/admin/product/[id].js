import React, { useEffect, useReducer } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { getError } from '../../../utils/error';
import Layout from '../../../components/Layout';
import Link from 'next/link';
import { toast } from 'react-toastify';

const PRODUCT_FETCH_REQUEST = 'PRODUCT_FETCH_REQUEST';
const PRODUCT_FETCH_SUCCESS = 'PRODUCT_FETCH_SUCCESS';
const PRODUCT_FETCH_FAIL = 'PRODUCT_FETCH_FAIL';
const PRODUCT_UPDATE_REQUEST = 'PRODUCT_UPDATE_REQUEST';
const PRODUCT_UPDATE_SUCCESS = 'PRODUCT_UPDATE_SUCCESS';
const PRODUCT_UPDATE_FAIL = 'PRODUCT_UPDATE_FAIL';

function reducer(state, action) {
  switch (action.type) {
    case PRODUCT_FETCH_REQUEST:
      return {...state, loading: true, error: ''};
    case PRODUCT_FETCH_SUCCESS:
      return {...state, loading: false, loadingUpdate: action.payload };
    case PRODUCT_FETCH_FAIL:
      return {...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export default function AdminProductEditScreen() {
  const { query } = useRouter();
  const productId = query.id;
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: ''
  });

  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: PRODUCT_FETCH_REQUEST });
        const { data } = await axios.get(`/api/admin/products/${productId}`);
        dispatch({ type: PRODUCT_FETCH_SUCCESS });
        setValue('name', data.name);
        setValue('slug', data.slug);
        setValue('price', data.price);
        setValue('image', data.image);
        setValue('category', data.category);
        setValue('brand', data.brand);
        setValue('countInStock', data.countInStock);
        setValue('description', data.description);
      } catch (error) {
        dispatch({ type: PRODUCT_FETCH_FAIL, payload: getError(error) });
      }
    };
    fetchData();
  }, [productId, setValue]);

  const submitHandler = async ({
    name,
    slug,
    price,
    category,
    image,
    featuredImage,
    brand,
    countInStock,
    description
  }) => {
    try {
      dispatch({ type: PRODUCT_UPDATE_REQUEST });
      await axios.put(`/api/admin/products/${productId}`, {
        name,
        slug,
        price,
        category,
        image,
        brand,
        countInStock,
        description
      });
      dispatch({ type: PRODUCT_UPDATE_SUCCESS });
      toast.success('Product updated successfully');
    } catch (error) {
      dispatch({ type: PRODUCT_UPDATE_FAIL, payload: getError(error) });
      toast.success(getError(error));
    }
  };

  return (
    <Layout title={`Edit Product ${productId}`}>
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
          { loading ? (<div>Loading</div>)
            : error ? (
              <div className='alert-error'>{error}</div>
            ) : (
              <form
                className='mx-auto max-w-screen-md'
                onSubmit={handleSubmit(submitHandler)}>
                  <h1 className="mb-4 text-xl">{`Edit product ${productId}`}</h1>
                  <div className="mb-4">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      className="w-full"
                      id='name'
                      autoFocus
                      {...register('name', {
                        required: 'Please enter name'
                      })}/>
                      {errors.name && (
                        <div className='text-red-500'>{error.name.message}</div>
                      )}
                  </div>
                  <div className="mb-4">
                    <label htmlFor="category">Category</label>
                    <input
                      type="text"
                      className="w-full"
                      id='category'
                      {...register('category', {
                        required: 'Please enter category'
                      })}/>
                      {errors.category && (
                        <div className='text-red-500'>{error.category.message}</div>
                      )}
                  </div>
                  <div className="mb-4">
                    <label htmlFor="description">Description</label>
                    <input
                      type="text"
                      className="w-full"
                      id='description'
                      {...register('description', {
                        required: 'Please enter description'
                      })}/>
                      {errors.description && (
                        <div className='text-red-500'>{error.description.message}</div>
                      )}
                  </div>
                  <div className="mb-4">
                    <button className="primary-button" disabled={loadingUpdate}>
                        { loadingUpdate ? 'Loading' : 'Update' }
                    </button>
                  </div>
                  <div className="mb-4">
                    <Link href='/admin/products'>Back</Link>
                  </div>
              </form>
            )}
        </div>
      </div>
    </Layout>
  )
}

AdminProductEditScreen.auth = { adminOnly: true };
