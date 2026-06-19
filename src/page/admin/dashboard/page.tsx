import QuickStartBoard from "./components/QuickStartBoard";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          관리자 페이지에 오신 것을 환영합니다 👋
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          아래 가이드를 따라 다짐을 만들고 관리해보세요.
        </p>
      </div>
      <QuickStartBoard />
    </div>
  );
}
