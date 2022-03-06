import "inter-ui/inter.css";

import { GeistProvider } from "@geist-ui/react";
import { Layout } from "@/components";

function MyApp({ Component, pageProps }) {
  return (
    <GeistProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </GeistProvider>
  );
}

export default MyApp;
