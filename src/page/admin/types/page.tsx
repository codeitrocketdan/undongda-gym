import TypesSection from "./components/TypesSection";

export default function AdminTypesPage() {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">다짐 타입 관리</h1>
        <p className="mt-2 text-sm text-gray-500">
          다짐 타입을 추가하고 관리하세요.
        </p>
      </div>
      <TypesSection />
    </div>
  );
}
