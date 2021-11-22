import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/layouts/default";

function ShortMeApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default ShortMeApp;
