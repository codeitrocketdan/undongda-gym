import { authServerFetch } from "@/shared/lib/auth/authServerFetch";
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

  const user = await authServerFetch<User>("/users/me");

  await queryClient.prefetchQuery({
    queryKey: ["user"],
    queryFn: () => user,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
