// TODO: 랜딩 페이지 작업 시 이 리다이렉트 제거 후 pages/dagym/page.tsx로 교체
import { redirect } from "next/navigation";

export default function DagymPage() {
  redirect("/");
}
