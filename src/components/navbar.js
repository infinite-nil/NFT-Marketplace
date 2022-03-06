import { useRouter } from "next/router";
import { Button, Grid, Link, Spacer } from "@geist-ui/react";
import { User, Plus } from "@geist-ui/icons";
import { Container } from "./container";

const Navbar = () => {
  const router = useRouter();

  return (
    <Container>
      <Grid.Container direction="row" justify="space-between">
        <Grid padding={2}>
          <Link href="/">Marketplace</Link>
        </Grid>
        <Grid padding={2}>
          <Grid.Container>
            <Button auto onClick={() => router.push('/create-nft')} icon={<Plus />}>
              Create NFT
            </Button>
            <Spacer w={3} />
            <Button auto onClick={() => router.push('/')} icon={<User />}>
              My profile
            </Button>
          </Grid.Container>
        </Grid>
      </Grid.Container>
    </Container>
  );
};

export { Navbar };
