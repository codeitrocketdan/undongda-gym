"use client";
import { useDagymDetailQuery } from "@/features/dagym-detail/api/useDagymDetailQuery";
import DagymDescription from "@/features/dagym-detail/components/dagymDescription/DagymDescription";
import DagymHero from "@/features/dagym-detail/components/dagymHero/DagymHero";
import DagymLocation from "@/features/dagym-detail/components/dagymLocation/DagymLocation";
import DagymReviews from "@/features/dagym-detail/components/dagymReviews/DagymReviews";
import DagymSuggest from "@/features/dagym-detail/components/dagymSuggest/DagymSuggest";
import { ApiError } from "@/shared/api/types";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
}

const DagymDetailPage = ({ id }: Props) => {
  const router = useRouter();
  const { data: dagym, isError, error } = useDagymDetailQuery(id);

  if (isError) {
    const isNotFound = error instanceof ApiError && error.status === 404;
    return (
      <div className="flex flex-col items-center justify-center gap-4 px-4 py-20 text-slate-400 sm:px-6">
        <p className="text-center text-sm">
          {isNotFound
            ? "삭제되었거나 존재하지 않는 다짐입니다."
            : "페이지를 불러오는데 문제가 발생하였습니다."}
        </p>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-slate-500 underline hover:text-slate-700"
        >
          이전 페이지로 돌아가기
        </button>
      </div>
    );
  }

  if (!dagym) {
    return null;
  }

  return (
    <div className="px-4 sm:px-6">
      <DagymHero dagym={dagym} id={id} />
      <DagymDescription dagym={dagym} />
      <DagymLocation dagym={dagym} />
      <DagymReviews meetingId={id} />
      <DagymSuggest dagym={dagym} meetingId={id} />
    </div>
  );
};

export default DagymDetailPage;
