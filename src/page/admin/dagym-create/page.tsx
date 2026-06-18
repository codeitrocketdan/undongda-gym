import CreateMeetingForm from "./components/CreateMeetingForm";

export default function AdminCreatePage() {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">다짐 만들기</h1>
        <p className="mt-2 text-sm text-gray-500">
          새로운 다짐을 생성하세요.
        </p>
      </div>
      <CreateMeetingForm />
    </div>
  );
}
