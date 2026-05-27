"use client";
import { useUser } from "@/shared/hooks/useUser";
import Link from "next/link";

const Page = () => {
  // 서버 컴포넌트 테스트
  //   const user = await getServerUser();

  // 클라이언트 컴포넌트 테스트
  const { user } = useUser();

  console.log(user);
  return <div>{user ? <div>{user.name}</div> : <Link href="/login">로그인</Link>}</div>;
};

export default Page;
