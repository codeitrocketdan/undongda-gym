"use client";
import Image from "next/image";
import { useAuth } from "../providers/AuthClientProvider";

const Page = () => {
  const { user } = useAuth();
  console.log(user);

  return (
    <div>
      {user && (
        <div>
          <h1>{user.name}</h1>
          <Image src={user.image ?? "/vercel.svg"} width={50} height={50} alt="프로필 이미지" />
        </div>
      )}
    </div>
  );
};

export default Page;
