import { serverFetcher } from "@/shared/lib/auth/serverFetcher";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
interface User {
  id: number;
  name: string;
}
export default async function AuthHydration({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const user = await serverFetcher<User>("/users/me");
      return user;
    },
  });

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}
