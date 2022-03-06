import {
  Card,
  Text,
  Grid,
  Input,
  Button,
  Divider,
  Image,
} from "@geist-ui/react";
import Save from "@geist-ui/icons/save";

const CreateNFTForm = ({ fileURL, onFieldChange, onFileChange, onClick }) => {
  return (
    <Card width="100%">
      <Grid
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px dashed #eaeaea",
        }}
      >
        {fileURL ? (
          <Image src={fileURL} alt="" />
        ) : (
          <Text>No file selected</Text>
        )}
      </Grid>
      <Divider my={4} />
      <Grid.Container wrap="wrap" gap={2}>
        <Grid xs={24}>
          <Input
            scale={1.5}
            name="file"
            id="file"
            htmlType="file"
            multiple={false}
            accept="image/*"
            onChange={onFileChange}
          />
        </Grid>
        <Grid xs={12}>
          <Input
            scale={1.5}
            name="name"
            placeholder="NFT name"
            id="name"
            onChange={onFieldChange}
            w="100%"
          />
        </Grid>
        <Grid xs={12}>
          <Input
            scale={1.5}
            name="price"
            placeholder="Price in ether"
            id="price"
            onChange={onFieldChange}
            w="100%"
          />
        </Grid>
        <Grid xs={24}>
          <Input
            scale={1.5}
            name="description"
            placeholder="NFT Description"
            id="description"
            onChange={onFieldChange}
            w="100%"
          />
        </Grid>
        <Grid xs={6}>
          <Button scale={1.5} onClick={onClick} icon={<Save />}>
            Create
          </Button>
        </Grid>
      </Grid.Container>
    </Card>
  );
};

export { CreateNFTForm };
