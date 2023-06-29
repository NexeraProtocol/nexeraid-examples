import KycClient from "@nexeraid/kyc-sdk/client";
import { useMutation } from "@tanstack/react-query";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { api } from "@/utils/api";
import { getSigner, TestUser } from "@/appConfig";

export const useKycAuthentication = () => {
  const authStore = useAuthStore((state) => state);
  const getAccessToken = api.access.accessToken.useMutation();

  const logout = useMutation(async () => {
    await Promise.resolve(authStore.logout());
  });

  const authenticate = useMutation(
    async (variables: { user: TestUser }) => {
      if (!variables.user.walletAddress)
        throw new Error("Missing data to authenticate");
      const signingMessage = KycClient.buildSignatureMessage(
        variables.user.walletAddress
      );
      const signer = getSigner(variables.user);
      const signature = await signer.signMessage(signingMessage);
      const response = await getAccessToken.mutateAsync({
        address: variables.user.walletAddress,
      });
      const { accessToken } = response;
      return {
        accessToken,
        signingMessage,
        signature,
        testUser: variables.user,
      };
    },
    {
      onSuccess: (data) => {
        authStore.authenticate(
          data.accessToken,
          data.signingMessage,
          data.signature,
          data.testUser
        );
      },
      onError: (error) => {
        console.error(error);
      },
    }
  );

  return {
    authenticate,
    logout,
    accessToken: authStore.accessToken,
    signingMessage: authStore.signingMessage,
    signature: authStore.signature,
    isAuthenticated: authStore.isAuthenticated,
    user: authStore.user,
  };
};

interface IAuthStore {
  accessToken?: string;
  signingMessage?: string;
  signature?: string;
  isAuthenticated: boolean;
  user?: TestUser;
  authenticate: (
    accessToken: string,
    signingMessage: string,
    signature: string,
    user: TestUser
  ) => void;
  logout: () => void;
}

const useAuthStore = create<IAuthStore>()(
  devtools(
    persist(
      immer((set) => ({
        accessToken: undefined,
        signature: undefined,
        signingMessage: undefined,
        isAuthenticated: false,
        authenticate: (
          accessToken: string,
          signingMessage: string,
          signature: string,
          user: TestUser
        ) => {
          set((state) => {
            state.accessToken = accessToken;
            state.signingMessage = signingMessage;
            state.signature = signature;
            state.isAuthenticated = true;
            state.user = user;
          });
        },
        logout: () => {
          set((state) => {
            state.accessToken = undefined;
            state.signingMessage = undefined;
            state.signature = undefined;
            state.isAuthenticated = false;
            state.user = undefined;
          });
        },
      })),
      {
        name: "bank-demo-auth-store",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);
