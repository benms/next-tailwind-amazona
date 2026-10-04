import axios from "axios";

const {
  PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET,
  PAYPAL_API_URL = 'https://api-m.sandbox.paypal.com',
} = process.env;

export function isPaypalConfigured() {
  return Boolean(PAYPAL_CLIENT_ID && PAYPAL_CLIENT_SECRET);
}

async function getAccessToken() {
  const { data } = await axios.post(
    `${PAYPAL_API_URL}/v1/oauth2/token`,
    'grant_type=client_credentials',
    {
      auth: { username: PAYPAL_CLIENT_ID, password: PAYPAL_CLIENT_SECRET },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }
  );
  return data.access_token;
}

// Fetches the order straight from PayPal so the client can't fake a payment
export async function getPaypalOrder(paypalOrderId) {
  const accessToken = await getAccessToken();
  const { data } = await axios.get(
    `${PAYPAL_API_URL}/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return data;
}
