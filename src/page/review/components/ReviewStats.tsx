import ProgressBar from "@/shared/ui/progress-bar/ProgressBar";
import Rating from "@/shared/ui/rating/Rating";

interface ReviewStatsProps {
  averageScore: number;
  totalReviews: number;
  oneStar: number;
  twoStars: number;
  threeStars: number;
  fourStars: number;
  fiveStars: number;
}

export default function ReviewStats({
  averageScore,
  totalReviews,
  oneStar,
  twoStars,
  threeStars,
  fourStars,
  fiveStars,
}: ReviewStatsProps) {
  const bars = [
    { label: "5점", count: fiveStars },
    { label: "4점", count: fourStars },
    { label: "3점", count: threeStars },
    { label: "2점", count: twoStars },
    { label: "1점", count: oneStar },
  ];

  return (
    <div className="gradient-blue-light mt-4 flex justify-around rounded-3xl px-6 py-6 md:mt-6 md:rounded-4xl md:py-10 lg:mt-8">
      {/* 왼쪽: 평균 점수 */}
      <div className="flex flex-col items-center justify-center md:w-96">
        <span className="text-2xl-bold md:text-display-md-bold mb-1">
          {Math.round(averageScore)}
        </span>
        {/* 모바일: 16px */}
        <Rating
          score={Math.round(averageScore)}
          size={16}
          className="md:hidden"
        />
        {/* 데스크탑: 32px */}
        <Rating
          score={Math.round(averageScore)}
          size={32}
          className="hidden md:flex"
        />
        <span className="text-xs text-slate-500 md:text-base">
          (총 {totalReviews}명 참여)
        </span>
      </div>

      {/* 오른쪽: 별점 분포 바 */}
      <div className="text-xs-medium md:text-sm-medium flex w-60 flex-col gap-0.5 text-slate-500 md:w-96 md:gap-2">
        {bars.map(({ label, count }) => (
          <div key={label} className="flex items-center gap-2 md:gap-3">
            <span className="whitespace-nowrap">{label}</span>
            <ProgressBar
              participantCount={count}
              capacity={totalReviews || 1}
            />
            <span>{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
