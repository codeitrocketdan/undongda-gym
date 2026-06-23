import Link from "next/link";
import FullBleed from "./FullBleed";

export default function LandingFooter() {
  return (
    <FullBleed className="bg-gray-900 text-gray-500">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4.5 px-6 py-11">
        <span className="text-lg-bold text-white">운동다짐</span>
        <div className="flex gap-6 text-sm">
          <Link href="#" className="text-gray-300">
            이용약관
          </Link>
          <Link href="#" className="text-gray-300">
            개인정보처리방침
          </Link>
          <Link href="#" className="text-gray-300">
            고객센터
          </Link>
        </div>
        <span className="text-xs-regular text-gray-600">
          © 2026 운동다짐. All rights reserved.
        </span>
      </div>
    </FullBleed>
  );
}
