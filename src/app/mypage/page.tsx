"use client";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../providers/AuthClientProvider";

const Page = () => {
  const { user } = useAuth();
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
