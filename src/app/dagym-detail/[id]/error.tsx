"use client";

export default function Error({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-4 py-20 text-slate-400 sm:px-6">
      <p className="text-center text-sm">
        페이지를 불러오는데 문제가 발생하였습니다.
      </p>
      <button
        type="button"
        onClick={() => unstable_retry()}
        className="text-sm text-slate-500 underline hover:text-slate-700"
      >
        다시 시도
      </button>
    </div>
  );
}
