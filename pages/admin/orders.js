import axios from "axios";
import Link from "next/link";
import React, { useEffect, useReducer } from "react";
import Layout from "../../components/Layout";
import { getError } from "../../utils/error";

const ORDERS_FETCH_REQUEST = "ORDERS_FETCH_REQUEST";
const ORDERS_FETCH_SUCCESS = "ORDERS_FETCH_SUCCESS";
const ORDERS_FETCH_FAIL = "ORDERS_FETCH_FAIL";

function reducer(state, action) {
  switch (action.type) {
    case ORDERS_FETCH_REQUEST:
      return { ...state, loading: true, error: "" };
    case ORDERS_FETCH_SUCCESS:
      return { ...state, loading: false, orders: action.payload };
    case ORDERS_FETCH_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export default function AdminOrderScreen() {
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    orders: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: ORDERS_FETCH_REQUEST });
        const { data } = await axios.get("/api/admin/orders");
        dispatch({ type: ORDERS_FETCH_SUCCESS, payload: data });
      } catch (error) {
        dispatch({ type: ORDERS_FETCH_FAIL, payload: getError(error) });
      }
    };
    fetchData();
  }, []);

  return (
    <Layout title="Admin Dashboard">
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
                <a className="font-bold">Orders</a>
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
        <div className="overflow-x-auto md:col-span-3">
          <h1 className="mb-4 text-xl">Admin Orders</h1>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="border-b">
                    <th className="px-5 text-left">Id</th>
                    <th className="p-5 text-left">User</th>
                    <th className="p-5 text-left">Date</th>
                    <th className="p-5 text-left">Total</th>
                    <th className="p-5 text-left">Paid</th>
                    <th className="p-5 text-left">Delivered</th>
                    <th className="p-5 text-left">Action</th>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="border-b">
                        <td className="p-5">{order._id.substring(20, 24)}</td>
                        <td className="p-5">
                          {order.user ? order.user.name : "Deleted user"}
                        </td>
                        <td className="p-5">
                          {order.createdAt.substring(0, 10)}
                        </td>
                        <td className="p-5">${order.totalPrice}</td>
                        <td className="p-5">
                          {order.isPaid
                            ? order.paidAt.substring(0, 10)
                            : "not paid"}
                        </td>
                        <td className="p-5">
                          {order.isDelivered
                            ? order.deliverAt.substring(0, 10)
                            : "not delivered"}
                        </td>
                        <td className="p-5">
                          <Link href={`/order/${order._id}`} passHref>
                            <a>Details</a>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

AdminOrderScreen.auth = { adminOnly: true };
