import { Button, Grid, Link, Spacer } from "@geist-ui/react";
import { User } from "@geist-ui/icons";
import { Container } from "./container";

const Navbar = () => {
  return (
    <Container>
      <Grid.Container direction="row" justify="space-between">
        <Grid padding={2}>
          <Link href="/">Marketplace</Link>
        </Grid>
        <Grid padding={2}>
          <Grid.Container>
            <Link href="/create-nft">Create NFT</Link>
            <Spacer w={3} />
            <Button auto icon={<User />}>
              My profile
            </Button>
          </Grid.Container>
        </Grid>
      </Grid.Container>
    </Container>
  );
};

export { Navbar };
