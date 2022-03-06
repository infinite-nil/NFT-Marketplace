import { Page, Divider } from "@geist-ui/react";
import { Navbar } from "./navbar";
import { Container } from "./container";

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <Divider />
      <Page>
        <Container>{children}</Container>
      </Page>
    </>
  );
};

export { Layout };
