import { serverFetcher } from "@/shared/api/serverFetcher";
import { Dagym } from "../model/types";
import ReviewItem from "./ReviewItem";

interface Props {
  dagym: Dagym;
}

const DagymReviews = async ({ dagym }: Props) => {
  const res = await serverFetcher.get(`/meetings/1578/reviews`);
  console.log(res);
  return (
    <section className="mb-20">
      <h2 className="text-2xl-semibold mb-5">리뷰 모아보기</h2>
      <div className="rounded-4xl bg-white px-8 py-6">
        {Array.from({ length: 4 }).map((_, index) => {
          return (
            <ReviewItem
              key={index}
              dagym={dagym}
              rating={4.5}
              content="리뷰가 들어갈 공간입니다."
            />
          );
        })}
      </div>
      {/* <Pagination /> */}
    </section>
  );
};

export default DagymReviews;
