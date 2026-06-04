import { ChevronLeft, ChevronRight } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pages: number[];
  hasPrev: boolean;
  hasNext: boolean;
  goTo: (page: number) => void;
  goPrev: () => void;
  goNext: () => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  pages,
  hasPrev,
  hasNext,
  goTo,
  goPrev,
  goNext,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className={twMerge("flex items-center gap-1 text-sm", className)}>
      {/* 이전 버튼 */}
      <button
        type="button"
        aria-label="이전 페이지"
        onClick={goPrev}
        className={twMerge(
          "flex h-8 w-8 cursor-pointer items-center justify-center rounded text-slate-400 hover:bg-slate-200",
          !hasPrev && "pointer-events-none invisible"
        )}
      >
        <ChevronLeft />
      </button>

      {/* 페이지 번호 */}
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => goTo(page)}
          aria-label={`${page}페이지`}
          aria-current={currentPage === page ? "page" : undefined}
          className={twMerge(
            "flex h-8 w-8 cursor-pointer items-center justify-center rounded text-sm font-medium transition-colors",
            currentPage === page
              ? "bg-blue-200 text-blue-600"
              : "text-slate-500 hover:bg-slate-200"
          )}
        >
          {page}
        </button>
      ))}

      {/* 다음 버튼 */}
      <button
        type="button"
        aria-label="다음 페이지"
        onClick={goNext}
        className={twMerge(
          "flex h-8 w-8 cursor-pointer items-center justify-center rounded text-slate-400 hover:bg-slate-200",
          !hasNext && "pointer-events-none invisible"
        )}
      >
        <ChevronRight />
      </button>
    </div>
  );
}
