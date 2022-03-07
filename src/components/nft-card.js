import { Grid, Card, Text, Link, Image, Divider } from "@geist-ui/react";
import { EthereumIcon } from "@/components";

const NFTCard = ({ name, description, price, image }) => {
  return (
    <Card width="300px">
      <Image
        src={image}
        alt={`${name} - ${description}`}
        height="200px"
        width="auto"
        style={{ objectFit: "cover" }}
      />
      <Divider />
      <Grid.Container alignItems="center" justify="space-between">
        <Grid>
          <Text margin={0}>{name}</Text>
        </Grid>
        <Grid>
          <Grid.Container alignItems="center" justify="space-between">
            <EthereumIcon />
            <Text margin={0}>{price}</Text>
          </Grid.Container>
        </Grid>
      </Grid.Container>
    </Card>
  );
};

export { NFTCard };
