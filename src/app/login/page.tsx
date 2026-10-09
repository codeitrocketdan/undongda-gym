import { Metadata } from "next";
import LoginPage from "@/page/login/page";

export const metadata: Metadata = {
  title: "로그인",
  description: "운동다짐을 이용하시려면 로그인이 필요합니다.",
};

const Page = () => {
  return <LoginPage />;
};

export default Page;
