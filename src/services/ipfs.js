import { create } from "ipfs-http-client";

const IPFS_BASE_URL = `https://ipfs.infura.io/ipfs`;
const ipfsClient = create("https://ipfs.infura.io:5001/api/v0");

export { ipfsClient, IPFS_BASE_URL };
