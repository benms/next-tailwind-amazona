import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import CheckoutWizard from '../components/CheckoutWizard'
import Layout from '../components/Layout'
import { SAVE_PAYMENT_METHOD, useStore } from '../utils/Store';

export default function PaymentScreen() {
  const router = useRouter();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const { state, dispatch } = useStore();
  const { cart } = state;
  const { shippingAddress, paymentMethod } = cart;
  const submitHandler = (e) => {
    e.preventDefault();
    if (!selectedPaymentMethod) {
      return toast.error('Payment method is required');
    }
    dispatch({type: SAVE_PAYMENT_METHOD, payload: selectedPaymentMethod});
    router.push('/placeorder');
  };
  useEffect(() => {
    if (!shippingAddress.address) {
      return router.push('/shipping');
    }
    setSelectedPaymentMethod(paymentMethod || '');
  }, [paymentMethod, router, shippingAddress.address]);
  return (
    <Layout title="Payment Method">
      <CheckoutWizard activeStep={2} />
      <form className="mx-auto max-w-screen-md" onSubmit={submitHandler}>
        <h1 className="mb-4 text-xl">Payment Method</h1>
        {
          ['PayPal', 'Stripe', 'CashOnDelivery'].map((payment) => (
            <div className='mb-4' key={payment}>
              <input
                type="radio"
                className="p-2 outline-none focus:ring-0"
                id={payment}
                checked={selectedPaymentMethod === payment}
                onChange={() => setSelectedPaymentMethod(payment)}
              />
              <label className="p-2" htmlFor={payment}>
                {payment}
              </label>
            </div>
          ))
        }
        <div className="mb-4 flex justify-between">
          <button
            className="default-button"
            onClick={() => router.push('/shipping')}
            type="button"
            >Back</button>
          <button className="primary-button">Next</button>
        </div>
      </form>
    </Layout>
  )
}

PaymentScreen.auth = true;
