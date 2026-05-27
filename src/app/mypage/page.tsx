"use client";
import { useUser } from "@/shared/hooks/useUser";
import Image from "next/image";
import Link from "next/link";

const Page = () => {
  // 서버 컴포넌트 테스트
  //   const user = await getServerUser();

  // 클라이언트 컴포넌트 테스트
  const { user } = useUser();

  console.log(user);
  return (
    <div>
      {user ? (
        <div>
          <h1>{user.name}</h1>
          <Image src={user.image ?? "/vercel.svg"} width={50} height={50} alt="프로필 이미지" />
        </div>
      ) : (
        <Link href="/login">로그인</Link>
      )}
    </div>
  );
};

export default Page;
