import { Grid } from "@geist-ui/react";

const Container = ({ children }) => {
  return (
    <Grid.Container style={{ maxWidth: "1000px", margin: "0 auto" }}>
      {children}
    </Grid.Container>
  );
};

export { Container };
