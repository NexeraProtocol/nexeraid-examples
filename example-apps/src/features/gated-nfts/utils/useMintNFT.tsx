import { useMutation } from "@tanstack/react-query";
import { encodeFunctionData } from "viem";

import { ExampleGatedNFTMinterABI } from "@nexeraprotocol/nexera-id-sig-gating-contracts-sdk/abis";

import {
  ChainId,
  type EIP155Signature,
} from "@nexeraprotocol/identity-schemas";
import { IDENTITY_CLIENT } from "../../kyc-widget/IdentityClient";
import {
  useChainId,
  useAccount,
  useBlockNumber,
  usePublicClient,
  useWalletClient,
} from "wagmi";
import { getGatedContractAddress } from "./getContractAddress";
import { waitForTransactionReceipt } from "viem/actions";

const WRONG_SIGNATURE: EIP155Signature =
  "0xc6fd40ac16944fd0fef20071149270a2c283c8ae92ffcbb5e61f44348490dc3b65e786637aaa82f46ac3c01941a9875046a2ceb9bad189362014b35f6e74df231b";

export const useMintGatedNFTFromSDK = () => {
  const chainId = useChainId();
  const account = useAccount();
  const blockNumber = useBlockNumber();
  const signer = useWalletClient();
  const publicClient = usePublicClient();

  return useMutation({
    mutationFn: async () => {
      if (!IDENTITY_CLIENT.init) {
        console.log("IDENTITY_CLIENT is not initizalied");
        return { signatureResponse: { isAuthorized: false } };
      }
      if (!account.address) {
        throw new Error("No account in wallet Client - address");
      }

      if (!signer.data) {
        throw new Error("No signer in wallet Client - data");
      }

      if (!publicClient) {
        throw new Error("No publicClient in wallet Client");
      }
      try {
        if (!account.address) {
          throw new Error("No account in wallet Client - address");
        }

        const signatureResponse = await IDENTITY_CLIENT.getTxAuthSignature({
          contractAbi: Array.from(ExampleGatedNFTMinterABI),
          contractAddress: getGatedContractAddress(ChainId.parse(chainId)),
          functionName: "mintNFTGated",
          args: [account.address],
          chainId: ChainId.parse(chainId),
        });

        // If user is not authorized, use wrong signature and dummy blockExpiratioin
        const blockExpiration =
          signatureResponse.blockExpiration ??
          (blockNumber.data ? Number(blockNumber.data) + 10 : 0);
        const signatureData =
          signatureResponse.signatureData ?? WRONG_SIGNATURE;

        // Mint Gated Nft with signature
        const unsignedTx = encodeFunctionData({
          abi: ExampleGatedNFTMinterABI,
          functionName: "mintNFTGated",
          args: [account.address],
        });

        // Complete data
        const txData = (unsignedTx + signatureData) as `0x${string}`;

        const tx = await signer.data.sendTransaction({
          to: getGatedContractAddress(ChainId.parse(chainId)),
          data: txData,
        });

        const receipt = await waitForTransactionReceipt(publicClient, {
          hash: tx,
        });

        return {
          txHash: receipt.transactionHash,
          signatureResponse: {
            isAuthorized: signatureResponse.isAuthorized,
            signatureData: signatureData,
            blockExpiration,
          },
        };
      } catch (e) {
        console.log("error during getTxAuthDataSignature", e);
        return {
          signatureResponse: {
            isAuthorized: false,
            signature: WRONG_SIGNATURE,
          },
          error: (e as Error).toString().substring(0, 108),
        };
      }
    },
  });
};
