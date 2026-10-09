import { Metadata } from "next";
import PostPage from "@/page/post/page";
export const metadata: Metadata = {
  title: "다짐 토크",
  description: "운동 이야기를 나누는 커뮤니티 게시판",
};
export default function Post() {
  return <PostPage />;
}
