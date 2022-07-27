import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import "../styles/globals.css";
import { StoreProvider } from "../utils/Store";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <StoreProvider>
        <PayPalScriptProvider deferLoading>
        {
          Component.auth ? (
            <Auth adminOnly={Component.auth.adminOnly}>
              <Component {...pageProps} />
            </Auth>
          ) : <Component {...pageProps} />
        }
        </PayPalScriptProvider>
      </StoreProvider>
    </SessionProvider>
  );
}

function Auth({children, adminOnly}) {
  const router = useRouter();
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/unauthorized?message=login required');
    }
  });
  if (status === 'loading') {
    return (<div>Loading...</div>);
  }
  if (adminOnly && !session.user.isAdmin) {
    router.push('/unauthorized?message=admin login required');
  }

  return children;
}

export default MyApp;
