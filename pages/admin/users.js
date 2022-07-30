import React, { useEffect, useReducer } from 'react';
import Layout from '../../components/Layout';
import { toast } from 'react-toastify';
import { getError } from '../../utils/error';
import axios from 'axios';
import Link from 'next/link';

const USERS_FETCH_REQUEST = 'USERS_FETCH_REQUEST';
const USERS_FETCH_SUCCESS = 'USERS_FETCH_SUCCESS';
const USERS_FETCH_FAIL = 'USERS_FETCH_FAIL';
const USER_DELETE_REQUEST = 'USER_DELETE_REQUEST';
const USER_DELETE_SUCCESS = 'USER_DELETE_SUCCESS';
const USER_DELETE_FAIL = 'USER_DELETE_FAIL';
const USER_DELETE_RESET = 'USER_DELETE_RESET';

const reducer = (state, action) => {
  switch (action.type) {
    case USERS_FETCH_REQUEST:
      return { ...state, loading: true, error: '' };
    case USERS_FETCH_SUCCESS:
      return { ...state, loading: false, users: action.payload, error: '' };
    case USERS_FETCH_FAIL:
      return { ...state, loading: false, error: action.payload };
    case USER_DELETE_REQUEST:
      return { ...state, loadingDelete: true };
    case USER_DELETE_SUCCESS:
      return { ...state, loadingDelete: false, successDelete: true };
    case USER_DELETE_FAIL:
      return { ...state, loadingDelete: false, successDelete: false };
    case USER_DELETE_RESET:
      return { ...state, loadingDelete: false, successDelete: false };
  }
};

export default function AdminUsersScreen() {
  const [{ loading, error, users, successDelete, loadingDelete }, dispatch] = useReducer(reducer, {
    loading: true,
    users: [],
    error: ''
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        dispatch({ type: USERS_FETCH_REQUEST });
        const { data } = await axios.get('/api/admin/users');
        dispatch({ type: USERS_FETCH_SUCCESS, payload: data });
      } catch (error) {
        dispatch({ type: USERS_FETCH_FAIL, payload: getError(error) });
      }
    };
    if (successDelete) {
      dispatch({ type: USER_DELETE_RESET });
    } else {
      fetchUsers();
    }
  }, [successDelete]);

  const deleteHandler = async (userId) => {
    try {
      if (!window.confirm('Are you sure?')) {
        return;
      }
      dispatch({ type: USER_DELETE_REQUEST });
      const { data } = await axios.delete(`/api/admin/users/${userId}`);
      dispatch({ type: USER_DELETE_SUCCESS, payload: data });
      toast.success('User deleted successfully');
    } catch (error) {
      dispatch({ type: USER_DELETE_FAIL, payload: getError(error) });
      toast.error(getError(error));
    }
  };

  return (
    <Layout title="Admin Users">
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
                <a>Products</a>
              </Link>
            </li>
            <li>
              <Link href="/admin/users">
                <a className="font-bold">Users</a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="md:col-span-3">
          <h1 className="mb-4 text-xl">Users</h1>
          {loadingDelete && <div>Deleting...</div>}
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
                    <th className="p-5 text-left">Email</th>
                    <th className="p-5 text-left">Admin</th>
                    <th className="p-5 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b">
                      <td className="p-5">{user._id.substring(20, 24)}</td>
                      <td className="p-5">{user.name}</td>
                      <td className="p-5">{user.email}</td>
                      <td className="p-5">{user.isAdmin ? 'YES' : 'NO'}</td>
                      <td className="p-5">
                        <Link href={`/admin/user/${user._id}`} passHref>
                          <a type='button' className='default-button'>Edit</a>
                        </Link>
                        &nbsp;
                        <button
                          type='button'
                          className='default-button'
                          onClick={() => deleteHandler(user._id)}
                        >
                        Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

AdminUsersScreen.auth = { adminOnly: true };
