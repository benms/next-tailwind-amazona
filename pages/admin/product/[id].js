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
const PRODUCT_UPLOAD_IMAGE_REQUEST = 'PRODUCT_UPLOAD_IMAGE_REQUEST';
const PRODUCT_UPLOAD_IMAGE_SUCCESS = 'PRODUCT_UPLOAD_IMAGE_SUCCESS';
const PRODUCT_UPLOAD_IMAGE_FAIL = 'PRODUCT_UPLOAD_IMAGE_FAIL';

function reducer(state, action) {
  switch (action.type) {
    case PRODUCT_FETCH_REQUEST:
      return {...state, loading: true, error: ''};
    case PRODUCT_FETCH_SUCCESS:
      return {...state, loading: false, loadingUpdate: action.payload };
    case PRODUCT_FETCH_FAIL:
      return {...state, loading: false, error: action.payload };

    case PRODUCT_UPDATE_REQUEST:
      return {...state, loadingUpdate: true, errorUpdate: ''};
    case PRODUCT_UPDATE_SUCCESS:
      return {...state, loadingUpdate: false, errorUpdate: ''};
    case PRODUCT_UPDATE_FAIL:
      return {...state, loadingUpdate: false, errorUpdate: action.payload }

    case PRODUCT_UPLOAD_IMAGE_REQUEST:
      return {...state, loadingUpload: true, errorUpload: ''};
    case PRODUCT_UPLOAD_IMAGE_SUCCESS:
      return {...state, loadingUpload: false, errorUpload: ''};
    case PRODUCT_UPLOAD_IMAGE_FAIL:
      return {...state, loadingUpload: false, errorUpload: action.payload }

    default:
      return state;
  }
}

export default function AdminProductEditScreen() {
  const { query } = useRouter();
  const productId = query.id;
  const [{
    loading,
    error,
    loadingUpdate,
    loadingUpload,
    errorUpload
  }, dispatch] = useReducer(reducer, {
    loading: true,
    error: ''
  });

  const { register, handleSubmit, formState: { errors }, setValue, getValues } = useForm();

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

  const uploadHandler = async (e, imageField = 'image') => {
    const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
    try {
      dispatch({ type: PRODUCT_UPLOAD_IMAGE_REQUEST });
      const { data: { signature, timestamp } } = await axios.get('/api/admin/cloudinary-sign');

      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);

      const { data } = await axios.post(url, formData);
      dispatch({ type: PRODUCT_UPLOAD_IMAGE_SUCCESS });
      setValue(imageField, data.secure_url);
      toast.success('File upload successfully');
    } catch (error) {
      dispatch({ type: PRODUCT_UPLOAD_IMAGE_FAIL, payload: getError(error) });
    }
  };

  const submitHandler = async ({
    name,
    slug,
    price,
    category,
    image,
    // featuredImage,
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
    <Layout title={`Edit Product ${getValues('name')}`}>
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
                  <h1 className="mb-4 text-xl">{`Edit product '${getValues('name')}'`}</h1>
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
                    <label htmlFor="slug">Slug</label>
                    <input
                      type="text"
                      className="w-full"
                      id="slug"
                      {...register('slug', {
                        required: 'Please enter slug',
                      })}
                    />
                    {errors.slug && (
                      <div className="text-red-500">{errors.slug.message}</div>
                    )}
                  </div>
                  <div className="mb-4">
                    <label htmlFor="price">Price</label>
                    <input
                      type="text"
                      className="w-full"
                      id="price"
                      {...register('price', {
                        required: 'Please enter price',
                      })}
                    />
                    {errors.price && (
                      <div className="text-red-500">{errors.price.message}</div>
                    )}
                  </div>
                  <div className="mb-4">
                    <label htmlFor="image">Image</label>
                    <input
                      type="text"
                      className="w-full"
                      id='image'
                      {...register('image', {
                        required: 'Please enter image'
                      })}/>
                      {errors.image && (
                        <div className='text-red-500'>{error.image.message}</div>
                      )}
                  </div>
                  <div className="mb-4">
                    <label htmlFor="imageFile">Upload image</label>
                    <input
                      type="file"
                      className="w-full"
                      id='imageFile'
                      onChange={uploadHandler}
                      />
                      {loadingUpload && <div>Uploading...</div>}
                      {errorUpload && (
                        <div className='text-red-500'>{errorUpload}</div>
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
                    <label htmlFor="brand">Brand</label>
                    <input
                      type="text"
                      className="w-full"
                      id="brand"
                      {...register('brand', {
                        required: 'Please enter brand',
                      })}
                    />
                    {errors.brand && (
                      <div className="text-red-500">{errors.brand.message}</div>
                    )}
                  </div>
                  <div className="mb-4">
                    <label htmlFor="countInStock">Count in stock</label>
                    <input
                      type="text"
                      className="w-full"
                      id="countInStock"
                      {...register('countInStock', {
                        required: 'Please enter countInStock',
                      })}
                    />
                    {errors.countInStock && (
                      <div className="text-red-500">
                        {errors.countInStock.message}
                      </div>
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
