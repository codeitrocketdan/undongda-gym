import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-4 py-20 text-slate-400 sm:px-6">
      <p className="text-center text-sm">
        삭제되었거나 존재하지 않는 다짐입니다.
      </p>
      <Link
        href="/dagym"
        className="text-sm text-slate-500 underline hover:text-slate-700"
      >
        다짐 목록으로 가기
      </Link>
    </div>
  );
}
