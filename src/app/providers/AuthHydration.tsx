import { User } from "@/entities/user";
import { serverFetcher } from "@/shared/api/serverFetcher";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

export default async function AuthHydration({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ["user"],
      queryFn: () => serverFetcher.get<User>("/users/me"),
    });
  } catch {
    queryClient.setQueryData(["user"], null);
  }
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
