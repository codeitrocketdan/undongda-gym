import { serverFetcher } from "@/shared/lib/auth/serverFetcher";
import Link from "next/link";
interface User {
  id: number;
  name: string;
}
const HomePage = async () => {
  const user = await serverFetcher<User>("/users/me");
  return (
    <div>
      {user ? <div>{user.name}</div> : <div>로그인 해야돼요</div>}
      <Link href="/mypage">마이페이지</Link>
    </div>
  );
};

export default HomePage;
