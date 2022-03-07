import { Divider, Grid } from "@geist-ui/react";
import { Navbar } from "./navbar";
import { Container } from "./container";

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <Divider />
      <Grid className="page">
        <Container>{children}</Container>
      </Grid>
    </>
  );
};

export { Layout };
