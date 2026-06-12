import DagymDescription from "@/features/dagym-detail/components/DagymDescription";
import DagymHero from "@/features/dagym-detail/components/DagymHero";
import DagymLocation from "@/features/dagym-detail/components/DagymLocation";
import DagymReviews from "@/features/dagym-detail/components/DagymReviews";
import DagymSuggest from "@/features/dagym-detail/components/DagymSuggest";

interface Props {
  id: string;
}

const DagymDetailPage = async ({ id }: Props) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/meetings/${id}`, {
    cache: "no-store",
  });

  //   if (!res.ok) {
  //     throw new Error("모임 정보를 불러오는데 실패했습니다.");
  //   }

  const dagym = await res.json();
  console.log(dagym, "다짐");
  //   const dagym = {
  //     id: 1522,
  //     teamId: "rocket",
  //     type: "웨이트",

  //     participantCount: 1,
  //     canceledAt: null,
  //     confirmedAt: null,
  //     hostId: 1756,
  //     createdAt: "2026-06-01T06:15:50.430Z",
  //     updatedAt: "2026-06-01T06:15:50.430Z",
  //     host: {
  //       id: 1756,
  //       name: "테스트",
  //       image: null,
  //     },
  //     createdBy: 1756,
  //     isCompleted: false,
  //     name: "테스트 모임",
  //     region: "서울 강남구",
  //     address: "서울 강남구 역삼동 123-45",
  //     latitude: 37.12345,
  //     longitude: 127.12345,
  //     dateTime: "2023-10-10T18:00:00Z",
  //     registrationEnd: "2023-10-09T18:00:00Z",
  //     capacity: 20,
  //     image: null,
  //     description: "테스트 모임 설명입니다.",
  //     isFavorited: false,
  //     isJoined: false,
  //   };
  return (
    <div className="px-4 sm:px-6">
      <DagymHero dagym={dagym} />
      <DagymDescription dagym={dagym} />
      <DagymLocation dagym={dagym} />
      <DagymReviews dagym={dagym} />
      <DagymSuggest />
    </div>
  );
};

export default DagymDetailPage;
