import { serverFetcher } from "@/shared/lib/auth/serverFetcher";
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
const HomePage = async () => {
  const user = await serverFetcher<User>("/users/me");
  return <div>{user?.name}</div>;
};

export default HomePage;
