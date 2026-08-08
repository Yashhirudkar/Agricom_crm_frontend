import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/lib/axios";

export function useCurrencyMaster() {
  return useQuery({
    queryKey: ["currencies", "active"],
    queryFn: async () => {
      const res = await axiosClient.get("/masters/currencies", {
        params: { limit: 200, status: "Active" }
      });
      return res.data?.data || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes cache
    gcTime: 30 * 60 * 1000,    // 30 minutes garbage collection time (Next.js/React Query v5)
  });
}
