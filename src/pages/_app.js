import "inter-ui/inter.css";

import { GeistProvider, CssBaseline } from "@geist-ui/react";
import { Layout } from "@/components";

function MyApp({ Component, pageProps }) {
  return (
    <GeistProvider>
      <CssBaseline />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </GeistProvider>
  );
}

export default MyApp;
