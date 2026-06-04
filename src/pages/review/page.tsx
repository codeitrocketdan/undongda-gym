import headerReview from "@/pages/review/assets/images/header_review.svg";
import SubPageHeader from "@/shared/ui/SubPageHeader/SubPageHeader";
import ReviewSection from "./components/ReviewSection";

export default function ReviewPage() {
  return (
    <main className="inner mt-8 md:mt-10 lg:mt-12.75">
      <SubPageHeader
        imageSrc={headerReview}
        title="모든 리뷰"
        description="운동다짐 이용자들은 이렇게 느꼈어요 o((>ω< ))o"
      />
      <ReviewSection />
    </main>
  );
}
