import { Metadata } from "next";
import FavoritePage from "@/page/favorite/page";

export const metadata: Metadata = {
  title: "찜한 다짐",
  robots: { index: false }, // 검색 결과에서 제외
};

export default function Favorite() {
  return <FavoritePage />;
}
