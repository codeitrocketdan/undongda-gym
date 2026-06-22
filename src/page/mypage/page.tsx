import ProfileSection from "@/features/my-page/ui/ProfileSection";
import Test from "./components/Test";

export default function MyPage() {
  //   const errorModal = useModal();

  return (
    <>
      <div className="inner flex flex-col lg:flex-row lg:gap-10">
        <div className="mb-8 flex flex-col gap-2 md:mb-10 md:gap-6 lg:w-1/5 lg:gap-11">
          <span className="text-base-semibold md:text-2xl-semibold pt-2">
            마이페이지
          </span>
          <ProfileSection />
        </div>
        <Test />
      </div>
      {/* {errorModal.isOpen && <ErrorModal onClose={errorModal.close} />} */}
    </>
  );
}
