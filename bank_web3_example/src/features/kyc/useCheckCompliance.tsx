import { api } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import { useKycAuthentication } from "@/features/kyc/useKycAuthenticate";

export const useCheckCompliance = () => {
  const { user } = useKycAuthentication();
  const mutation = api.compliance.executeRule.useMutation();

  const checkCompliance = useMutation({
    mutationFn: async () => {
      if (!user) return Promise.resolve(false);
      console.log("isCompliant", user);
      const result = await mutation.mutateAsync({
        address: user,
      });
      console.log("isCompliant result", result);
      return result.every((compliant) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return compliant.result.result.validate?.[0].is_valid as boolean;
      });
    },
  });

  return { checkCompliance };
};