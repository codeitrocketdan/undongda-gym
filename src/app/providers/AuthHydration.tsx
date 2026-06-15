import { User } from "@/entities/user";
import { serverFetcher } from "@/shared/api/serverFetcher";
import { ApiError } from "@/shared/api/types";
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
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      queryClient.setQueryData<User | null>(["user"], null);
    } else {
      throw error;
    }
  }
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
