import { CreateNFTForm } from "@/components";
import { useCreateNFT } from "@/hooks/use-create-nft";

const CreateNFTs = () => {
  const {
    fileURL,
    handleFieldChange,
    handleFileChange,
    createMarketplaceItem,
  } = useCreateNFT();

  return (
    <CreateNFTForm
      fileURL={fileURL}
      onFieldChange={handleFieldChange}
      onFileChange={handleFileChange}
      onClick={createMarketplaceItem}
    />
  );
};

export default CreateNFTs;
