// hooks/swr/usePost.ts
import { postFetcher } from "@/lib/fetchers/postFetcher";
import { mutate } from "swr";
import useSWRMutation from "swr/mutation";

type UsePostOptions = {
  revalidateKey?: string | string[];
};

export const usePost = <T = any>(url: string, options?: UsePostOptions) => {
  const { trigger, data, error, isMutating } = useSWRMutation(
    url,
    postFetcher,
    {
      onSuccess: () => {
        if (!options?.revalidateKey) return;

        const keys = Array.isArray(options.revalidateKey)
          ? options.revalidateKey
          : [options.revalidateKey];

        keys.forEach((key) => mutate(key));
      },
    },
  );

  return {
    data: data as T,
    isLoading: isMutating,
    isError: error,
    mutate: trigger,
  };
};