"use client";
import { useDagymDetailQuery } from "@/features/dagym-detail/api/useDagymDetailQuery";
import DagymDescription from "@/features/dagym-detail/components/dagymDescription/DagymDescription";
import DagymHero from "@/features/dagym-detail/components/dagymHero/DagymHero";
import DagymLocation from "@/features/dagym-detail/components/dagymLocation/DagymLocation";
import DagymReviews from "@/features/dagym-detail/components/dagymReviews/DagymReviews";
import DagymSuggest from "@/features/dagym-detail/components/dagymSuggest/DagymSuggest";

interface Props {
  id: string;
}

const DagymDetailPage = ({ id }: Props) => {
  const { data: dagym } = useDagymDetailQuery(id);

  if (!dagym) {
    return null;
  }

  return (
    <div className="px-4 sm:px-6">
      <DagymHero dagym={dagym} id={id} />
      <DagymDescription dagym={dagym} />
      <DagymLocation dagym={dagym} />
      <DagymReviews dagym={dagym} meetingId={id} />
      <DagymSuggest dagym={dagym} meetingId={id} />
    </div>
  );
};

export default DagymDetailPage;
