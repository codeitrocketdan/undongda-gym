import { serverFetcher } from "@/shared/api/serverFetcher";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

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
