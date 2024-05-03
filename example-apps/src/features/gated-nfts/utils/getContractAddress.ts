import type { ChainId } from "@nexeraprotocol/identity-schemas";
import { NEXERA_CHAINS } from "@nexeraprotocol/identity-schemas";
import {
  ExampleGatedNFTMinterAddress_amoy_dev,
  ExampleGatedNFTMinterAddress_sepolia_dev,
  ExampleNFTMinterAddress_amoy_dev,
  ExampleNFTMinterAddress_sepolia_dev,
} from "@nexeraprotocol/nexera-id-sig-gating-contracts-sdk/addresses";

export const getGatedContractAddress = (chainId: ChainId) => {
  switch (chainId) {
    case NEXERA_CHAINS.SEPOLIA:
      return ExampleGatedNFTMinterAddress_sepolia_dev;
    case NEXERA_CHAINS.POLYGON_AMOY:
      return ExampleGatedNFTMinterAddress_amoy_dev;
    default:
      throw new Error("Chain not supported");
  }
};

export const getNonGatedContractAddress = (chainId: ChainId) => {
  switch (chainId) {
    case NEXERA_CHAINS.SEPOLIA:
      return ExampleNFTMinterAddress_sepolia_dev;
    case NEXERA_CHAINS.POLYGON_AMOY:
      return ExampleNFTMinterAddress_amoy_dev;
    default:
      throw new Error("Chain not supported");
  }
};
