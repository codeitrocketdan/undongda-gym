import { UserRound } from "lucide-react";
import Link from "next/link";

export default function ProfileIcon() {
  return (
    <Link href="/mypage" className="inline-block rounded-full bg-gray-900 p-2">
      <UserRound size={26} color="#fff" />
    </Link>
  );
}
