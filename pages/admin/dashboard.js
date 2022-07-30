import axios from 'axios';
import Link from 'next/link'
import React, { useEffect, useReducer } from 'react'
import ChartComponent from '../../components/Chart';
import Layout from '../../components/Layout'
import { getError } from '../../utils/error';

const FETCH_SUMMARY_REQUEST = 'FETCH_SUMMARY_REQUEST';
const FETCH_SUMMARY_SUCCESS = 'FETCH_SUMMARY_SUCCESS';
const FETCH_SUMMARY_FAIL = 'FETCH_SUMMARY_FAIL';

function reducer(state, action) {
  switch (action.type) {
    case FETCH_SUMMARY_REQUEST:
      return { ...state, loading: true, error: '' };
    case FETCH_SUMMARY_SUCCESS:
      return { ...state, loading: false, error: '', summary: action.payload };
    case FETCH_SUMMARY_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    }
  }
};

export default function AdminDashboardScreen() {
  const [{loading, error, summary}, dispatch] = useReducer(reducer, {
    loading: true,
    summary: { salesData: [] },
    error: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: FETCH_SUMMARY_REQUEST });
        const { data } = await axios.get('/api/admin/summary');
        dispatch({ type: FETCH_SUMMARY_SUCCESS, payload: data });
      } catch (error) {
        dispatch({ type: FETCH_SUMMARY_FAIL, payload: getError(error) });
      }
    };
    fetchData();
  }, []);

  const data = {
    labels: summary.salesData.map((x) => x._id), // 2022/01
    datasets: [
      {
        label: 'Sales',
        backgroundColor: 'rgba(162, 222, 208, 1)',
        data: summary.salesData.map((x) => x.totalSales)
      }
    ]
  };

  return (
    <Layout title='Admin dashboard'>
      <div className="grid md:grid-cols-4 md:gap-5">
        <div>
          <ul>
            <li>
              <Link href="/admin/dashboard">
                <a className="font-bold">Dashboard</a>
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
            <div>
              <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="card m-5 p-5">
                  <p className="text-3xl">${summary.ordersPrice}</p>
                  <p>Sales</p>
                  <Link href="/admin/orders">View sales</Link>
                </div>
                <div className="card m-5 p-5">
                  <p className="text-3xl">{summary.ordersCount}</p>
                  <p>Orders</p>
                  <Link href="/admin/orders">View orders</Link>
                </div>
                <div className="card m-5 p-5">
                  <p className="text-3xl">{summary.productsCount}</p>
                  <p>Products</p>
                  <Link href="/admin/products">View products</Link>
                </div>
                <div className="card m-5 p-5">
                  <p className="text-3xl">{summary.usersCount}</p>
                  <p>Users</p>
                  <Link href="/admin/users">View users</Link>
                </div>
              </div>
              <ChartComponent data={data} title='Sales Report'/>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

AdminDashboardScreen.auth = { adminOnly: true }
