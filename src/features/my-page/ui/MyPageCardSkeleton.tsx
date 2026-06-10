import Skeleton from "@/shared/ui/skeleton/Skeleton";

export default function MyPageCardSkeleton() {
  return (
    <>
      {/* 모바일 */}
      <div className="overflow-hidden rounded-3xl bg-white md:hidden">
        <Skeleton className="h-48 w-full rounded-none" />
        <div className="flex flex-col gap-3 p-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
      {/* 데스크탑 */}
      <div className="hidden rounded-4xl bg-white p-6 md:flex md:gap-6">
        <Skeleton className="h-50 w-50 shrink-0 rounded-xl" />
        <div className="flex flex-1 flex-col justify-between py-1">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-6 w-48" />
          </div>
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
    </>
  );
}
