import React, { useEffect, useReducer } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { getError } from '../../../utils/error';
import Layout from '../../../components/Layout';
import Link from 'next/link';
import { toast } from 'react-toastify';

const USER_FETCH_REQUEST = 'USER_FETCH_REQUEST';
const USER_FETCH_SUCCESS = 'USER_FETCH_SUCCESS';
const USER_FETCH_FAIL = 'USER_FETCH_FAIL';
const USER_UPDATE_REQUEST = 'USER_UPDATE_REQUEST';
const USER_UPDATE_SUCCESS = 'USER_UPDATE_SUCCESS';
const USER_UPDATE_FAIL = 'USER_UPDATE_FAIL';

function reducer(state, action) {
  switch (action.type) {
    case USER_FETCH_REQUEST:
      return {...state, loading: true, error: ''};
    case USER_FETCH_SUCCESS:
      return {...state, loading: false, loadingUpdate: action.payload };
    case USER_FETCH_FAIL:
      return {...state, loading: false, error: action.payload };

    case USER_UPDATE_REQUEST:
      return {...state, loadingUpdate: true, errorUpdate: ''};
    case USER_UPDATE_SUCCESS:
      return {...state, loadingUpdate: false, errorUpdate: ''};
    case USER_UPDATE_FAIL:
      return {...state, loadingUpdate: false, errorUpdate: action.payload }

    default:
      return state;
  }
}

export default function AdminUserEditScreen() {
  const router = useRouter();
  const { query } = router;
  const userId = query.id;
  const [{
    loading,
    error,
    loadingUpdate
  }, dispatch] = useReducer(reducer, {
    loading: true,
    error: ''
  });

  const { register, handleSubmit, formState: { errors }, setValue, getValues } = useForm();

  const submitHandler = async ({name, email, isAdmin}) => {
    try {
      dispatch({ type: USER_UPDATE_REQUEST });
      await axios.put(`/api/admin/users/${userId}`, {
        name,
        email,
        isAdmin
      });
      dispatch({ type: USER_UPDATE_SUCCESS });
      router.push('/admin/users');
      toast.success('User updated successfully');
    } catch (err) {
      dispatch({ type: USER_UPDATE_FAIL });
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: USER_FETCH_REQUEST });
        const { data } = await axios.get(`/api/admin/users/${userId}`);
        dispatch({ type: USER_FETCH_SUCCESS });
        setValue('name', data.name);
        setValue('email', data.email);
        setValue('isAdmin', data.isAdmin);
      } catch (error) {
        dispatch({ type: USER_FETCH_FAIL, payload: getError(error) });
      }
    };
    fetchData();
  }, [userId, setValue]);

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
                    <label htmlFor="name">Email</label>
                    <input
                      type="email"
                      className="w-full"
                      id='email'
                      {...register('email', {
                        required: 'Please enter email'
                      })}/>
                      {errors.name && (
                        <div className='text-red-500'>{error.name.message}</div>
                      )}
                  </div>
                  <div className="mb-4">
                      <div className="flex items-center mb-4">
                          <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          {...register('isAdmin')}/>
                          <label htmlFor="isAdmin" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Is admin</label>
                          {errors.name && (
                            <div className='text-red-500'>{error.name.message}</div>
                          )}
                     </div>
                  </div>
                  <div className="mb-4">
                    <button className="primary-button" disabled={loadingUpdate}>
                        { loadingUpdate ? 'Loading' : 'Update' }
                    </button>
                  </div>
                  <div className="mb-4">
                    <Link href='/admin/users'>Back</Link>
                  </div>
              </form>
            )}
        </div>
      </div>
    </Layout>
  )
}

AdminUserEditScreen.auth = { adminOnly: true };
