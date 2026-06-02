import { serverFetcher } from "@/shared/lib/auth/serverFetcher";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

interface User {
  id: number;
  teamId: string;
  email: string;
  name: string;
  companyName: string;
  image: string | null;
  createAt: string;
  updateAt: string;
}

export default async function AuthHydration({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["user"],
    queryFn: () => serverFetcher<User>("/users/me"),
  });

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}
